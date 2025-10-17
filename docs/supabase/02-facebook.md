Login with Facebook

To enable Facebook Auth for your project, you need to set up a Facebook OAuth application and add the application credentials to your Supabase Dashboard.

Overview#
Setting up Facebook logins for your application consists of 3 parts:

Create and configure a Facebook Application on the Facebook Developers Site
Add your Facebook keys to your Supabase Project
Add the login code to your Supabase JS Client App
Access your Facebook Developer account#
Go to developers.facebook.com.
Click on Log In at the top right to log in.
Facebook Developer Portal.

Create a Facebook app#
Click on My Apps at the top right.
Click Create App near the top right.
Select your app type and click Continue.
Fill in your app information, then click Create App.
This should bring you to the screen: Add Products to Your App. (Alternatively you can click on Add Product in the left sidebar to get to this screen.)
The next step requires a callback URL, which looks like this: https://<project-ref>.supabase.co/auth/v1/callback

Go to your Supabase Project Dashboard
Click on the Authentication icon in the left sidebar
Click on Providers under the Configuration section
Click on Facebook from the accordion list to expand and you'll find your Callback URL, you can click Copy to copy it to the clipboard
For testing OAuth locally with the Supabase CLI see the local development docs.

Set up Facebook login for your Facebook app#
From the Add Products to your App screen:

Click Setup under Facebook Login
Skip the Quickstart screen, instead, in the left sidebar, click Settings under Facebook Login
Enter your callback URI under Valid OAuth Redirect URIs on the Facebook Login Settings page
Enter this in the Valid OAuth Redirect URIs box
Click Save Changes at the bottom right
Be aware that you have to set the right use case permissions to enable Third party applications to read the email address. To do so:

Under Build Your App, click on Use Cases screen. From there, do the following steps:

Click the Edit button in Authentication and Account Creation on the right side. This action will lead to the other page.
public_profile is set by default, so make sure it and email have status of Ready for testing in the redirected page.
If not, click the Add button in email on right side.
Copy your Facebook app ID and secret#
Click Settings / Basic in the left sidebar
Copy your App ID from the top of the Basic Settings page
Under App Secret click Show then copy your secret
Make sure all required fields are completed on this screen.
Enter your Facebook app ID and secret into your Supabase project#
Go to your Supabase Project Dashboard
In the left sidebar, click the Authentication icon (near the top)
Click on Providers under the Configuration section
Click on Facebook from the accordion list to expand and turn Facebook Enabled to ON
Enter your Facebook Client ID and Facebook Client Secret saved in the previous step
Click Save
You can also configure the Facebook auth provider using the Management API:

# Get your access token from https://supabase.com/dashboard/account/tokens
export SUPABASE_ACCESS_TOKEN="your-access-token"
export PROJECT_REF="your-project-ref"
# Configure Facebook auth provider
curl -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "external_facebook_enabled": true,
    "external_facebook_client_id": "your-facebook-app-id",
    "external_facebook_secret": "your-facebook-app-secret"
  }'
Add login code to your client app#

JavaScript

Flutter

Swift

Kotlin
Make sure you're using the right supabase client in the following code.

If you're not using Server-Side Rendering or cookie-based Auth, you can directly use the createClient from @supabase/supabase-js. If you're using Server-Side Rendering, see the Server-Side Auth guide for instructions on creating your Supabase client.

When your user signs in, call signInWithOAuth() with facebook as the provider:

async function signInWithFacebook() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
  })
}
For a PKCE flow, for example in Server-Side Auth, you need an extra step to handle the code exchange. When calling signInWithOAuth, provide a redirectTo URL which points to a callback route. This redirect URL should be added to your redirect allow list.


Client

Server
In the browser, signInWithOAuth automatically redirects to the OAuth provider's authentication endpoint, which then redirects to your endpoint.

await supabase.auth.signInWithOAuth({
  provider,
  options: {
    redirectTo: `http://example.com/auth/callback`,
  },
})
At the callback endpoint, handle the code exchange to save the user session.


Next.js

SvelteKit

Astro

Remix

Express
Create a new file at app/auth/callback/route.ts and populate with the following:

app/auth/callback/route.ts
import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/'
  }
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }
  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

JavaScript

Flutter

Swift

Kotlin
When your user signs out, call signOut() to remove them from the browser session and any objects from localStorage:

async function signOut() {
  const { error } = await supabase.auth.signOut()
}
Now, you should be able to login with Facebook and alert you to Submit for Login Review when users try to sign into your app. Follow the instructions there to make your app go live for full features and products.
You can read more about App Review here.

Resources#
Supabase - Get started for free
Supabase JS Client
Facebook Developers Dashboard
