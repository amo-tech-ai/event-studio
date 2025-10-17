# Supabase Authentication Implementation Plan

## Overview
EventOS authentication system supporting multiple OAuth providers (Apple, Facebook, Google, LinkedIn) with comprehensive user profile management.

## Core Setup

### 1. Authentication Providers Configuration
- **Apple**: OAuth flow with Services ID configuration
- **Facebook**: OAuth flow with Facebook App integration
- **Google**: OAuth flow with Google Cloud Platform
- **LinkedIn (OIDC)**: OpenID Connect flow

### 2. Database Schema

#### Core Tables

##### `public.profiles`
Extended user profile information beyond auth.users
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  provider TEXT, -- 'apple', 'facebook', 'google', 'linkedin_oidc'
  provider_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

##### `public.user_sessions`
Track user login sessions and activity
```sql
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  session_started_at TIMESTAMPTZ DEFAULT NOW(),
  session_ended_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);
```

##### `public.oauth_connections`
Store OAuth provider tokens for API access
```sql
CREATE TABLE public.oauth_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_user_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  scope TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);
```

### 3. Indexes

```sql
-- Profile indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_provider ON public.profiles(provider);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at DESC);

-- Session indexes
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_active ON public.user_sessions(is_active) WHERE is_active = true;
CREATE INDEX idx_user_sessions_started_at ON public.user_sessions(session_started_at DESC);

-- OAuth connections indexes
CREATE INDEX idx_oauth_connections_user_id ON public.oauth_connections(user_id);
CREATE INDEX idx_oauth_connections_provider ON public.oauth_connections(provider);
CREATE INDEX idx_oauth_connections_expires_at ON public.oauth_connections(token_expires_at);
```

### 4. Database Triggers

#### Auto-update timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_oauth_connections_updated_at
  BEFORE UPDATE ON public.oauth_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### Auto-create profile on user signup
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, provider, metadata)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_app_meta_data->>'provider',
    NEW.raw_user_meta_data
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

#### Track user sessions
```sql
CREATE OR REPLACE FUNCTION track_user_session()
RETURNS TRIGGER AS $$
BEGIN
  -- End previous active sessions
  UPDATE public.user_sessions
  SET is_active = false, session_ended_at = NOW()
  WHERE user_id = NEW.id AND is_active = true;

  -- Create new session
  INSERT INTO public.user_sessions (user_id, provider)
  VALUES (
    NEW.id,
    NEW.raw_app_meta_data->>'provider'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_sign_in
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION track_user_session();
```

### 5. Row Level Security (RLS) Policies

```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_connections ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User sessions policies
CREATE POLICY "Users can view their own sessions"
  ON public.user_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- OAuth connections policies
CREATE POLICY "Users can view their own OAuth connections"
  ON public.oauth_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own OAuth connections"
  ON public.oauth_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own OAuth connections"
  ON public.oauth_connections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own OAuth connections"
  ON public.oauth_connections FOR DELETE
  USING (auth.uid() = user_id);
```

### 6. Edge Functions

#### Function: `handle-oauth-callback`
Purpose: Process OAuth callbacks and store provider tokens
```typescript
// Location: supabase/functions/handle-oauth-callback/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { provider, access_token, refresh_token, expires_in, user_metadata } = await req.json()

  // Store OAuth tokens
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase.from('oauth_connections').upsert({
      user_id: user.id,
      provider,
      access_token,
      refresh_token,
      token_expires_at: new Date(Date.now() + expires_in * 1000),
      metadata: user_metadata
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

#### Function: `refresh-oauth-token`
Purpose: Refresh expired OAuth tokens
```typescript
// Location: supabase/functions/refresh-oauth-token/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { provider } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  // Get stored OAuth connection
  const { data: connection } = await supabase
    .from('oauth_connections')
    .select('*')
    .eq('user_id', user.id)
    .eq('provider', provider)
    .single()

  // Refresh token logic based on provider
  // ... provider-specific refresh implementation

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

#### Function: `sync-user-profile`
Purpose: Sync user profile data from OAuth providers
```typescript
// Location: supabase/functions/sync-user-profile/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { provider } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  // Fetch latest profile data from provider using stored tokens
  // Update profiles table with fresh data

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

## Provider-Specific Configuration

### Apple Sign-In
- **Required**: Services ID, Team ID, Key ID, Private Key
- **Callback URL**: `https://<project-ref>.supabase.co/auth/v1/callback`
- **Scopes**: email, name
- **Token Type**: ID Token (JWT)

### Facebook Login
- **Required**: App ID, App Secret
- **Callback URL**: `https://<project-ref>.supabase.co/auth/v1/callback`
- **Scopes**: public_profile, email
- **Special**: Requires app review for production

### Google Sign-In
- **Required**: Client ID, Client Secret
- **Callback URL**: `https://<project-ref>.supabase.co/auth/v1/callback`
- **Scopes**: openid, email, profile
- **Features**: Supports One-Tap, FedCM

### LinkedIn (OIDC)
- **Required**: Client ID, Client Secret
- **Callback URL**: `https://<project-ref>.supabase.co/auth/v1/callback`
- **Scopes**: openid, profile, email
- **Note**: Using new OIDC provider (replaces legacy LinkedIn OAuth)

## Implementation Checklist

### Phase 1: Database Setup
- [ ] Create profiles table
- [ ] Create user_sessions table
- [ ] Create oauth_connections table
- [ ] Add all indexes
- [ ] Create trigger functions
- [ ] Set up RLS policies

### Phase 2: Provider Configuration
- [ ] Configure Apple Sign-In in Supabase Dashboard
- [ ] Configure Facebook Login in Supabase Dashboard
- [ ] Configure Google Sign-In in Supabase Dashboard
- [ ] Configure LinkedIn (OIDC) in Supabase Dashboard
- [ ] Test each provider OAuth flow

### Phase 3: Edge Functions
- [ ] Deploy handle-oauth-callback function
- [ ] Deploy refresh-oauth-token function
- [ ] Deploy sync-user-profile function
- [ ] Test edge function execution

### Phase 4: Client Integration
- [ ] Implement auth callback route
- [ ] Add provider sign-in buttons
- [ ] Handle OAuth redirects
- [ ] Implement session management
- [ ] Add error handling

### Phase 5: Testing & Security
- [ ] Test all OAuth flows end-to-end
- [ ] Verify RLS policies
- [ ] Test token refresh logic
- [ ] Audit security advisors
- [ ] Performance testing

## Security Considerations

1. **Token Storage**: OAuth tokens encrypted at rest in oauth_connections table
2. **RLS Enforcement**: All tables have strict RLS policies
3. **Service Role**: Edge functions use service role key (stored as secret)
4. **HTTPS Only**: All OAuth callbacks require HTTPS in production
5. **Nonce Validation**: Implement nonce for Apple and Google flows
6. **PKCE Flow**: Use PKCE for server-side auth flows

## Monitoring & Maintenance

1. **Session Analytics**: Track login patterns via user_sessions table
2. **Token Expiry**: Monitor oauth_connections for expired tokens
3. **Provider Health**: Regular testing of OAuth flows
4. **Security Advisors**: Check Supabase advisors weekly
5. **Audit Logs**: Review auth logs for suspicious activity

## References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Apple Sign-In Setup](./01-apple.md)
- [Facebook Login Setup](./02-facebook.md)
- [Google Sign-In Setup](./02-google.md)
- [LinkedIn OIDC Setup](./04-linkedin.md)
