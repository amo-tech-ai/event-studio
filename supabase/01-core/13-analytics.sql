-- =====================================================
-- EventOS Core Schema: analytics (Analytics & Reporting)
-- =====================================================

-- Analytics and reporting table for tracking key metrics
-- Stores aggregated data for dashboards and reporting
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL, -- Optional link to specific event
  
  -- Analytics Context
  metric_type TEXT NOT NULL CHECK (metric_type IN (
    'event_registrations', 'ticket_sales', 'revenue', 'attendee_engagement',
    'campaign_performance', 'contact_activity', 'user_activity', 'venue_utilization',
    'session_attendance', 'feedback_scores', 'conversion_rates', 'retention_rates'
  )),
  metric_name TEXT NOT NULL, -- Specific metric name
  metric_category TEXT DEFAULT 'general' CHECK (metric_category IN (
    'general', 'financial', 'operational', 'marketing', 'customer', 'performance'
  )),
  
  -- Time Period
  period_type TEXT NOT NULL CHECK (period_type IN (
    'daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'
  )),
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  
  -- Metric Values
  metric_value DECIMAL(15,4) NOT NULL DEFAULT 0,
  previous_value DECIMAL(15,4) DEFAULT 0,
  change_amount DECIMAL(15,4) GENERATED ALWAYS AS (metric_value - previous_value) STORED,
  change_percentage DECIMAL(8,4) GENERATED ALWAYS AS (
    CASE WHEN previous_value != 0 THEN ((metric_value - previous_value) / previous_value) * 100 ELSE 0 END
  ) STORED,
  
  -- Additional Metrics
  secondary_value DECIMAL(15,4) DEFAULT 0, -- Additional metric value
  tertiary_value DECIMAL(15,4) DEFAULT 0, -- Third metric value
  
  -- Dimensions & Filters
  dimensions JSONB DEFAULT '{}', -- Additional dimension data
  filters JSONB DEFAULT '{}', -- Applied filters for this metric
  
  -- Data Quality
  data_source TEXT DEFAULT 'system' CHECK (data_source IN (
    'system', 'manual', 'imported', 'calculated', 'external'
  )),
  data_quality_score DECIMAL(3,2) DEFAULT 1.0, -- 0.0 to 1.0
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Benchmarking
  benchmark_value DECIMAL(15,4), -- Industry or internal benchmark
  benchmark_percentage DECIMAL(8,4), -- Performance vs benchmark
  
  -- Goal Tracking
  goal_value DECIMAL(15,4), -- Target goal for this metric
  goal_achievement_percentage DECIMAL(8,4) GENERATED ALWAYS AS (
    CASE WHEN goal_value IS NOT NULL AND goal_value != 0 
         THEN (metric_value / goal_value) * 100 
         ELSE NULL 
    END
  ) STORED,
  
  -- Metadata
  calculation_method TEXT DEFAULT 'sum' CHECK (calculation_method IN (
    'sum', 'average', 'count', 'min', 'max', 'median', 'custom'
  )),
  calculation_formula TEXT, -- Custom calculation formula if applicable
  
  -- Assignment & Management
  created_by UUID REFERENCES users(id),
  last_updated_by UUID REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_period CHECK (period_end > period_start),
  CONSTRAINT valid_data_quality CHECK (data_quality_score BETWEEN 0.0 AND 1.0),
  CONSTRAINT unique_metric_period UNIQUE (account_id, event_id, metric_type, metric_name, period_type, period_start)
);

-- Enable Row Level Security
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_analytics_account ON analytics(account_id);
CREATE INDEX idx_analytics_event ON analytics(event_id);
CREATE INDEX idx_analytics_metric_type ON analytics(metric_type);
CREATE INDEX idx_analytics_metric_name ON analytics(metric_name);
CREATE INDEX idx_analytics_period_type ON analytics(period_type);
CREATE INDEX idx_analytics_period_start ON analytics(period_start);
CREATE INDEX idx_analytics_period_end ON analytics(period_end);
CREATE INDEX idx_analytics_metric_value ON analytics(metric_value);
CREATE INDEX idx_analytics_change_percentage ON analytics(change_percentage);
CREATE INDEX idx_analytics_goal_achievement ON analytics(goal_achievement_percentage);
CREATE INDEX idx_analytics_created_by ON analytics(created_by);
CREATE INDEX idx_analytics_search ON analytics USING gin(to_tsvector('english', metric_name || ' ' || COALESCE(metric_type, '')));

-- Create updated_at trigger
CREATE TRIGGER update_analytics_updated_at
  BEFORE UPDATE ON analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update last_calculated_at
CREATE OR REPLACE FUNCTION update_analytics_last_calculated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_calculated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_analytics_last_calculated_trigger
  BEFORE INSERT OR UPDATE ON analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_analytics_last_calculated();

-- RLS Policies
CREATE POLICY "Analytics are viewable by account members"
  ON analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = analytics.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
    )
  );

CREATE POLICY "Account members can create analytics"
  ON analytics FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = analytics.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
    )
  );

CREATE POLICY "Analytics creators and managers can update analytics"
  ON analytics FOR UPDATE
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = analytics.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
      AND account_users.role IN ('owner', 'admin', 'manager')
    )
  );

-- Comments for documentation
COMMENT ON TABLE analytics IS 'Analytics and reporting data for dashboards and insights';
COMMENT ON COLUMN analytics.dimensions IS 'JSON object containing additional dimension data';
COMMENT ON COLUMN analytics.filters IS 'JSON object containing applied filters for this metric';
COMMENT ON COLUMN analytics.calculation_formula IS 'Custom calculation formula for complex metrics';

-- Sample data for development
INSERT INTO analytics (
  account_id, event_id, metric_type, metric_name, metric_category, period_type,
  period_start, period_end, metric_value, previous_value, goal_value, created_by
) VALUES
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  (SELECT id FROM events WHERE slug = 'tech-summit-2025'),
  'event_registrations',
  'total_registrations',
  'operational',
  'monthly',
  '2025-01-01 00:00:00-05:00',
  '2025-01-31 23:59:59-05:00',
  150,
  120,
  200,
  '11111111-1111-1111-1111-111111111111'
),
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  (SELECT id FROM events WHERE slug = 'tech-summit-2025'),
  'revenue',
  'total_revenue',
  'financial',
  'monthly',
  '2025-01-01 00:00:00-05:00',
  '2025-01-31 23:59:59-05:00',
  29950.00,
  24000.00,
  40000.00,
  '22222222-2222-2222-2222-222222222222'
),
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  NULL,
  'contact_activity',
  'active_contacts',
  'customer',
  'weekly',
  '2025-01-20 00:00:00-05:00',
  '2025-01-26 23:59:59-05:00',
  45,
  38,
  50,
  '11111111-1111-1111-1111-111111111111'
);
