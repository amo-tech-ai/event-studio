# 09 - CRM System

## 🎯 Purpose

Manage relationships with event organizers, track opportunities, and automate sales workflows.

## 📊 Schema

```sql
-- Organizers (leads/customers)
CREATE TABLE public.crm_organizers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  industry TEXT,
  assigned_to UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'lead',
  health_score INTEGER DEFAULT 50,
  total_revenue NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opportunities
CREATE TABLE public.crm_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES crm_organizers(id),
  name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  stage_id UUID NOT NULL,
  probability INTEGER DEFAULT 50,
  expected_close_date DATE,
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pipeline stages
CREATE TABLE public.crm_pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  default_probability INTEGER DEFAULT 50,
  is_won BOOLEAN DEFAULT false,
  is_closed BOOLEAN DEFAULT false
);

-- Activities
CREATE TABLE public.crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES crm_organizers(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔄 Features

1. **Lead Management**: Track potential organizers
2. **Opportunity Pipeline**: Visualize sales stages
3. **Activity Timeline**: Log all interactions
4. **AI Insights**: Predict deal outcomes
5. **Automated Tasks**: Follow-up reminders

## 📈 Dashboard

- Pipeline visualization
- Revenue forecasting
- Activity feed
- Health score tracking
