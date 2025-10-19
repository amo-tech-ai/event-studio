# 08 - Resend Email Integration

## 📧 Overview

Transactional email system using Resend for order confirmations, event reminders, and automated communications.

## 🔧 Setup

```sql
-- Email templates
CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  html_body TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  category TEXT CHECK (category IN ('transactional', 'marketing', 'notification')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email queue
CREATE TABLE public.email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  template_name TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  status TEXT DEFAULT 'queued',
  resend_message_id TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📤 Edge Function

```typescript
// supabase/functions/send-email/index.ts
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req) => {
  const { to, templateName, variables } = await req.json();
  
  const { data: template } = await supabase
    .from('email_templates')
    .select('*')
    .eq('name', templateName)
    .single();

  const html = renderTemplate(template.html_body, variables);

  const { data, error } = await resend.emails.send({
    from: 'events@yourdomain.com',
    to: [to],
    subject: template.subject,
    html
  });

  return new Response(JSON.stringify({ messageId: data?.id }));
});
```

## ✉️ Templates

- Order confirmation
- Event reminder (24h, 1 week)
- Check-in instructions
- Post-event survey
