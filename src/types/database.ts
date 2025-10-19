export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      attendees: {
        Row: {
          created_at: string
          email: string
          event_id: string
          full_name: string
          id: string
          order_id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          event_id: string
          full_name: string
          id?: string
          order_id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          event_id?: string
          full_name?: string
          id?: string
          order_id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_stats"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendees_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          actual_amount: number | null
          category: string
          created_at: string
          currency: string | null
          description: string
          estimated_amount: number
          event_id: string
          id: string
          notes: string | null
          organizer_id: string
          paid_at: string | null
          payment_due_date: string | null
          status: string | null
          subcategory: string | null
          updated_at: string
          variance: number | null
        }
        Insert: {
          actual_amount?: number | null
          category: string
          created_at?: string
          currency?: string | null
          description: string
          estimated_amount: number
          event_id: string
          id?: string
          notes?: string | null
          organizer_id: string
          paid_at?: string | null
          payment_due_date?: string | null
          status?: string | null
          subcategory?: string | null
          updated_at?: string
          variance?: number | null
        }
        Update: {
          actual_amount?: number | null
          category?: string
          created_at?: string
          currency?: string | null
          description?: string
          estimated_amount?: number
          event_id?: string
          id?: string
          notes?: string | null
          organizer_id?: string
          paid_at?: string | null
          payment_due_date?: string | null
          status?: string | null
          subcategory?: string | null
          updated_at?: string
          variance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "budgets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_stats"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "budgets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "organizers"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          annual_revenue: number | null
          city: string | null
          company_size: string | null
          country: string | null
          created_at: string
          currency: string | null
          custom_fields: Json | null
          email: string | null
          id: string
          industry: string | null
          last_interaction_at: string | null
          lead_source: string | null
          linkedin_url: string | null
          name: string
          notes: string | null
          organizer_id: string
          phone: string | null
          postal_code: string | null
          slug: string | null
          state_province: string | null
          status: string | null
          tags: string[] | null
          total_events_attended: number | null
          total_revenue: number | null
          twitter_handle: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          annual_revenue?: number | null
          city?: string | null
          company_size?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          custom_fields?: Json | null
          email?: string | null
          id?: string
          industry?: string | null
          last_interaction_at?: string | null
          lead_source?: string | null
          linkedin_url?: string | null
          name: string
          notes?: string | null
          organizer_id: string
          phone?: string | null
          postal_code?: string | null
          slug?: string | null
          state_province?: string | null
          status?: string | null
          tags?: string[] | null
          total_events_attended?: number | null
          total_revenue?: number | null
          twitter_handle?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          annual_revenue?: number | null
          city?: string | null
          company_size?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          custom_fields?: Json | null
          email?: string | null
          id?: string
          industry?: string | null
          last_interaction_at?: string | null
          lead_source?: string | null
          linkedin_url?: string | null
          name?: string
          notes?: string | null
          organizer_id?: string
          phone?: string | null
          postal_code?: string | null
          slug?: string | null
          state_province?: string | null
          status?: string | null
          tags?: string[] | null
          total_events_attended?: number | null
          total_revenue?: number | null
          twitter_handle?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          company_id: string | null
          country: string | null
          created_at: string
          custom_fields: Json | null
          department: string | null
          email: string
          email_consent: boolean | null
          first_name: string
          full_name: string | null
          id: string
          job_title: string | null
          last_event_attended_at: string | null
          last_interaction_at: string | null
          last_name: string
          lead_source: string | null
          linkedin_url: string | null
          mobile_phone: string | null
          notes: string | null
          organizer_id: string
          phone: string | null
          postal_code: string | null
          sms_consent: boolean | null
          state_province: string | null
          status: string | null
          tags: string[] | null
          total_events_attended: number | null
          total_spent: number | null
          twitter_handle: string | null
          updated_at: string
          whatsapp_consent: boolean | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_id?: string | null
          country?: string | null
          created_at?: string
          custom_fields?: Json | null
          department?: string | null
          email: string
          email_consent?: boolean | null
          first_name: string
          full_name?: string | null
          id?: string
          job_title?: string | null
          last_event_attended_at?: string | null
          last_interaction_at?: string | null
          last_name: string
          lead_source?: string | null
          linkedin_url?: string | null
          mobile_phone?: string | null
          notes?: string | null
          organizer_id: string
          phone?: string | null
          postal_code?: string | null
          sms_consent?: boolean | null
          state_province?: string | null
          status?: string | null
          tags?: string[] | null
          total_events_attended?: number | null
          total_spent?: number | null
          twitter_handle?: string | null
          updated_at?: string
          whatsapp_consent?: boolean | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_id?: string | null
          country?: string | null
          created_at?: string
          custom_fields?: Json | null
          department?: string | null
          email?: string
          email_consent?: boolean | null
          first_name?: string
          full_name?: string | null
          id?: string
          job_title?: string | null
          last_event_attended_at?: string | null
          last_interaction_at?: string | null
          last_name?: string
          lead_source?: string | null
          linkedin_url?: string | null
          mobile_phone?: string | null
          notes?: string | null
          organizer_id?: string
          phone?: string | null
          postal_code?: string | null
          sms_consent?: boolean | null
          state_province?: string | null
          status?: string | null
          tags?: string[] | null
          total_events_attended?: number | null
          total_spent?: number | null
          twitter_handle?: string | null
          updated_at?: string
          whatsapp_consent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body: string
          bounced_count: number | null
          campaign_id: string
          clicked_count: number | null
          created_at: string
          delivered_count: number | null
          event_id: string
          from_email: string | null
          from_name: string | null
          id: string
          metadata: Json | null
          name: string
          opened_count: number | null
          preheader: string | null
          reply_to: string | null
          send_date: string | null
          send_time_offset_hours: number | null
          sent_at: string | null
          sent_count: number | null
          status: string
          subject: string
          template_type: string
          unsubscribed_count: number | null
          updated_at: string
        }
        Insert: {
          body: string
          bounced_count?: number | null
          campaign_id: string
          clicked_count?: number | null
          created_at?: string
          delivered_count?: number | null
          event_id: string
          from_email?: string | null
          from_name?: string | null
          id?: string
          metadata?: Json | null
          name: string
          opened_count?: number | null
          preheader?: string | null
          reply_to?: string | null
          send_date?: string | null
          send_time_offset_hours?: number | null
          sent_at?: string | null
          sent_count?: number | null
          status?: string
          subject: string
          template_type: string
          unsubscribed_count?: number | null
          updated_at?: string
        }
        Update: {
          body?: string
          bounced_count?: number | null
          campaign_id?: string
          clicked_count?: number | null
          created_at?: string
          delivered_count?: number | null
          event_id?: string
          from_email?: string | null
          from_name?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          opened_count?: number | null
          preheader?: string | null
          reply_to?: string | null
          send_date?: string | null
          send_time_offset_hours?: number | null
          sent_at?: string | null
          sent_count?: number | null
          status?: string
          subject?: string
          template_type?: string
          unsubscribed_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_templates_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_stats"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "email_templates_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_dashboards: {
        Row: {
          conversion_rate: number | null
          created_at: string
          engagement_metrics: Json | null
          event_id: string
          first_sale_at: string | null
          first_view_at: string | null
          funnel_metrics: Json | null
          id: string
          last_updated_at: string
          marketing_metrics: Json | null
          metrics: Json | null
          organizer_id: string | null
          snapshots: Json | null
          total_revenue: number | null
          total_tickets_sold: number | null
          total_views: number | null
          updated_at: string
        }
        Insert: {
          conversion_rate?: number | null
          created_at?: string
          engagement_metrics?: Json | null
          event_id: string
          first_sale_at?: string | null
          first_view_at?: string | null
          funnel_metrics?: Json | null
          id?: string
          last_updated_at?: string
          marketing_metrics?: Json | null
          metrics?: Json | null
          organizer_id?: string | null
          snapshots?: Json | null
          total_revenue?: number | null
          total_tickets_sold?: number | null
          total_views?: number | null
          updated_at?: string
        }
        Update: {
          conversion_rate?: number | null
          created_at?: string
          engagement_metrics?: Json | null
          event_id?: string
          first_sale_at?: string | null
          first_view_at?: string | null
          funnel_metrics?: Json | null
          id?: string
          last_updated_at?: string
          marketing_metrics?: Json | null
          metrics?: Json | null
          organizer_id?: string | null
          snapshots?: Json | null
          total_revenue?: number | null
          total_tickets_sold?: number | null
          total_views?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_dashboards_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "event_stats"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_dashboards_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_settings: {
        Row: {
          collect_special_requests: boolean | null
          created_at: string
          email_footer_text: string | null
          event_id: string
          homepage_display_weight: number | null
          id: string
          is_online_event: boolean
          online_event_url: string | null
          order_timeout_minutes: number
          post_checkout_message: string | null
          pre_checkout_message: string | null
          primary_color: string | null
          require_attendee_info: boolean
          seo_description: string | null
          seo_image_url: string | null
          seo_title: string | null
          show_remaining_tickets: boolean | null
          social_links: Json | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          collect_special_requests?: boolean | null
          created_at?: string
          email_footer_text?: string | null
          event_id: string
          homepage_display_weight?: number | null
          id?: string
          is_online_event?: boolean
          online_event_url?: string | null
          order_timeout_minutes?: number
          post_checkout_message?: string | null
          pre_checkout_message?: string | null
          primary_color?: string | null
          require_attendee_info?: boolean
          seo_description?: string | null
          seo_image_url?: string | null
          seo_title?: string | null
          show_remaining_tickets?: boolean | null
          social_links?: Json | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          collect_special_requests?: boolean | null
          created_at?: string
          email_footer_text?: string | null
          event_id?: string
          homepage_display_weight?: number | null
          id?: string
          is_online_event?: boolean
          online_event_url?: string | null
          order_timeout_minutes?: number
          post_checkout_message?: string | null
          pre_checkout_message?: string | null
          primary_color?: string | null
          require_attendee_info?: boolean
          seo_description?: string | null
          seo_image_url?: string | null
          seo_title?: string | null
          show_remaining_tickets?: boolean | null
          social_links?: Json | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_settings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "event_stats"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_settings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number
          created_at: string
          description: string | null
          end_at: string
          id: string
          name: string
          organizer_id: string
          price_cents: number
          slug: string
          start_at: string
          status: string
          type: string
          updated_at: string
          venue_id: string | null
          visibility: string
        }
        Insert: {
          capacity: number
          created_at?: string
          description?: string | null
          end_at: string
          id?: string
          name: string
          organizer_id: string
          price_cents: number
          slug: string
          start_at: string
          status?: string
          type: string
          updated_at?: string
          venue_id?: string | null
          visibility?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          description?: string | null
          end_at?: string
          id?: string
          name?: string
          organizer_id?: string
          price_cents?: number
          slug?: string
          start_at?: string
          status?: string
          type?: string
          updated_at?: string
          venue_id?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      interactions: {
        Row: {
          company_id: string | null
          contact_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          event_id: string | null
          follow_up_date: string | null
          follow_up_notes: string | null
          id: string
          interaction_date: string
          interaction_type: string
          organizer_id: string
          outcome: string | null
          requires_follow_up: boolean | null
          subject: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          event_id?: string | null
          follow_up_date?: string | null
          follow_up_notes?: string | null
          id?: string
          interaction_date?: string
          interaction_type: string
          organizer_id: string
          outcome?: string | null
          requires_follow_up?: boolean | null
          subject: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          event_id?: string | null
          follow_up_date?: string | null
          follow_up_notes?: string | null
          id?: string
          interaction_date?: string
          interaction_type?: string
          organizer_id?: string
          outcome?: string | null
          requires_follow_up?: boolean | null
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_stats"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "interactions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_campaigns: {
        Row: {
          channels: string[]
          completed_at: string | null
          content: Json | null
          created_at: string
          description: string | null
          emails_clicked: number | null
          emails_opened: number | null
          emails_sent: number | null
          event_id: string
          id: string
          launched_at: string | null
          metadata: Json | null
          name: string
          scheduled_at: string | null
          social_engagement: number | null
          social_posts_created: number | null
          status: string
          updated_at: string
          whatsapp_messages_sent: number | null
          whatsapp_responses: number | null
        }
        Insert: {
          channels?: string[]
          completed_at?: string | null
          content?: Json | null
          created_at?: string
          description?: string | null
          emails_clicked?: number | null
          emails_opened?: number | null
          emails_sent?: number | null
          event_id: string
          id?: string
          launched_at?: string | null
          metadata?: Json | null
          name: string
          scheduled_at?: string | null
          social_engagement?: number | null
          social_posts_created?: number | null
          status?: string
          updated_at?: string
          whatsapp_messages_sent?: number | null
          whatsapp_responses?: number | null
        }
        Update: {
          channels?: string[]
          completed_at?: string | null
          content?: Json | null
          created_at?: string
          description?: string | null
          emails_clicked?: number | null
          emails_opened?: number | null
          emails_sent?: number | null
          event_id?: string
          id?: string
          launched_at?: string | null
          metadata?: Json | null
          name?: string
          scheduled_at?: string | null
          social_engagement?: number | null
          social_posts_created?: number | null
          status?: string
          updated_at?: string
          whatsapp_messages_sent?: number | null
          whatsapp_responses?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_stats"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "marketing_campaigns_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string
          event_id: string
          id: string
          order_number: string
          paid_at: string | null
          payment_status: string
          quantity: number
          stripe_payment_intent_id: string | null
          total_cents: number
          unit_price_cents: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          event_id: string
          id?: string
          order_number: string
          paid_at?: string | null
          payment_status?: string
          quantity: number
          stripe_payment_intent_id?: string | null
          total_cents: number
          unit_price_cents: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          event_id?: string
          id?: string
          order_number?: string
          paid_at?: string | null
          payment_status?: string
          quantity?: number
          stripe_payment_intent_id?: string | null
          total_cents?: number
          unit_price_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_stats"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "orders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      organizers: {
        Row: {
          business_address_line1: string | null
          business_address_line2: string | null
          business_city: string | null
          business_country: string | null
          business_postal_code: string | null
          business_registration_number: string | null
          business_state: string | null
          created_at: string
          currency: string | null
          description: string | null
          id: string
          is_verified: boolean
          logo_url: string | null
          organization_name: string
          organization_type: string | null
          stripe_account_id: string | null
          stripe_account_status: string | null
          stripe_charges_enabled: boolean | null
          stripe_payouts_enabled: boolean | null
          support_email: string | null
          support_phone: string | null
          tax_id: string | null
          timezone: string | null
          total_events: number | null
          total_revenue: number | null
          total_tickets_sold: number | null
          updated_at: string
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
          website_url: string | null
        }
        Insert: {
          business_address_line1?: string | null
          business_address_line2?: string | null
          business_city?: string | null
          business_country?: string | null
          business_postal_code?: string | null
          business_registration_number?: string | null
          business_state?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id: string
          is_verified?: boolean
          logo_url?: string | null
          organization_name: string
          organization_type?: string | null
          stripe_account_id?: string | null
          stripe_account_status?: string | null
          stripe_charges_enabled?: boolean | null
          stripe_payouts_enabled?: boolean | null
          support_email?: string | null
          support_phone?: string | null
          tax_id?: string | null
          timezone?: string | null
          total_events?: number | null
          total_revenue?: number | null
          total_tickets_sold?: number | null
          updated_at?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          website_url?: string | null
        }
        Update: {
          business_address_line1?: string | null
          business_address_line2?: string | null
          business_city?: string | null
          business_country?: string | null
          business_postal_code?: string | null
          business_registration_number?: string | null
          business_state?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean
          logo_url?: string | null
          organization_name?: string
          organization_type?: string | null
          stripe_account_id?: string | null
          stripe_account_status?: string | null
          stripe_charges_enabled?: boolean | null
          stripe_payouts_enabled?: boolean | null
          support_email?: string | null
          support_phone?: string | null
          tax_id?: string | null
          timezone?: string | null
          total_events?: number | null
          total_revenue?: number | null
          total_tickets_sold?: number | null
          updated_at?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          applicable_ticket_ids: string[] | null
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          discount_type: string
          discount_value: number
          event_id: string
          id: string
          is_active: boolean
          max_uses: number | null
          max_uses_per_customer: number
          minimum_purchase_amount: number | null
          minimum_quantity: number | null
          times_used: number
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          applicable_ticket_ids?: string[] | null
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type: string
          discount_value: number
          event_id: string
          id?: string
          is_active?: boolean
          max_uses?: number | null
          max_uses_per_customer?: number
          minimum_purchase_amount?: number | null
          minimum_quantity?: number | null
          times_used?: number
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          applicable_ticket_ids?: string[] | null
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          event_id?: string
          id?: string
          is_active?: boolean
          max_uses?: number | null
          max_uses_per_customer?: number
          minimum_purchase_amount?: number | null
          minimum_quantity?: number | null
          times_used?: number
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_codes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_stats"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "promo_codes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          category: string | null
          completed_at: string | null
          created_at: string
          depends_on_task_ids: string[] | null
          description: string | null
          due_date: string | null
          event_id: string
          id: string
          notes: string | null
          organizer_id: string
          priority: string | null
          reminder_date: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          completed_at?: string | null
          created_at?: string
          depends_on_task_ids?: string[] | null
          description?: string | null
          due_date?: string | null
          event_id: string
          id?: string
          notes?: string | null
          organizer_id: string
          priority?: string | null
          reminder_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          completed_at?: string | null
          created_at?: string
          depends_on_task_ids?: string[] | null
          description?: string | null
          due_date?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          organizer_id?: string
          priority?: string | null
          reminder_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_stats"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "organizers"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_tiers: {
        Row: {
          created_at: string
          currency: string
          custom_fields: Json | null
          description: string | null
          display_order: number | null
          event_id: string
          id: string
          is_featured: boolean | null
          is_hidden: boolean | null
          name: string
          price: number
          quantity_available: number | null
          quantity_sold: number | null
          quantity_total: number
          sale_end_date: string | null
          sale_start_date: string | null
          slug: string
          status: string
          tier_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          custom_fields?: Json | null
          description?: string | null
          display_order?: number | null
          event_id: string
          id?: string
          is_featured?: boolean | null
          is_hidden?: boolean | null
          name: string
          price?: number
          quantity_available?: number | null
          quantity_sold?: number | null
          quantity_total: number
          sale_end_date?: string | null
          sale_start_date?: string | null
          slug: string
          status?: string
          tier_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          custom_fields?: Json | null
          description?: string | null
          display_order?: number | null
          event_id?: string
          id?: string
          is_featured?: boolean | null
          is_hidden?: boolean | null
          name?: string
          price?: number
          quantity_available?: number | null
          quantity_sold?: number | null
          quantity_total?: number
          sale_end_date?: string | null
          sale_start_date?: string | null
          slug?: string
          status?: string
          tier_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_tiers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_stats"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "ticket_tiers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          attendee_id: string | null
          checked_in_at: string | null
          created_at: string
          event_id: string
          id: string
          order_id: string
          qr_code: string
          status: string
          ticket_number: string
          updated_at: string
        }
        Insert: {
          attendee_id?: string | null
          checked_in_at?: string | null
          created_at?: string
          event_id: string
          id?: string
          order_id: string
          qr_code: string
          status?: string
          ticket_number: string
          updated_at?: string
        }
        Update: {
          attendee_id?: string | null
          checked_in_at?: string | null
          created_at?: string
          event_id?: string
          id?: string
          order_id?: string
          qr_code?: string
          status?: string
          ticket_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "attendees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_stats"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address_line1: string | null
          business_name: string
          business_registration: string | null
          city: string | null
          contact_name: string | null
          country: string | null
          created_at: string
          description: string | null
          email: string
          id: string
          insurance_verified: boolean | null
          is_preferred: boolean | null
          last_used_date: string | null
          notes: string | null
          organizer_id: string
          phone: string | null
          postal_code: string | null
          rating: number | null
          service_category: string
          services_offered: string[] | null
          state_province: string | null
          status: string | null
          total_events_serviced: number | null
          total_reviews: number | null
          total_spent_with_vendor: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          address_line1?: string | null
          business_name: string
          business_registration?: string | null
          city?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          email: string
          id?: string
          insurance_verified?: boolean | null
          is_preferred?: boolean | null
          last_used_date?: string | null
          notes?: string | null
          organizer_id: string
          phone?: string | null
          postal_code?: string | null
          rating?: number | null
          service_category: string
          services_offered?: string[] | null
          state_province?: string | null
          status?: string | null
          total_events_serviced?: number | null
          total_reviews?: number | null
          total_spent_with_vendor?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          address_line1?: string | null
          business_name?: string
          business_registration?: string | null
          city?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          insurance_verified?: boolean | null
          is_preferred?: boolean | null
          last_used_date?: string | null
          notes?: string | null
          organizer_id?: string
          phone?: string | null
          postal_code?: string | null
          rating?: number | null
          service_category?: string
          services_offered?: string[] | null
          state_province?: string | null
          status?: string | null
          total_events_serviced?: number | null
          total_reviews?: number | null
          total_spent_with_vendor?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "organizers"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_bookings: {
        Row: {
          attendee_count: number
          booking_source: string
          cancelled_at: string | null
          confirmed_at: string | null
          created_at: string
          currency: string | null
          event_date: string
          event_date_range: unknown | null
          event_id: string
          event_type: string | null
          final_price: number | null
          id: string
          metadata: Json | null
          notes: string | null
          payment_due_date: string | null
          payment_status: string | null
          quoted_price: number | null
          rejection_reason: string | null
          requested_by: string
          requestor_company: string | null
          requestor_name: string | null
          requestor_phone: string | null
          responded_at: string | null
          responded_by: string | null
          special_requests: string | null
          status: string
          updated_at: string
          venue_id: string
        }
        Insert: {
          attendee_count: number
          booking_source?: string
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          currency?: string | null
          event_date: string
          event_date_range?: unknown | null
          event_id: string
          event_type?: string | null
          final_price?: number | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          payment_due_date?: string | null
          payment_status?: string | null
          quoted_price?: number | null
          rejection_reason?: string | null
          requested_by: string
          requestor_company?: string | null
          requestor_name?: string | null
          requestor_phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          special_requests?: string | null
          status?: string
          updated_at?: string
          venue_id: string
        }
        Update: {
          attendee_count?: number
          booking_source?: string
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          currency?: string | null
          event_date?: string
          event_date_range?: unknown | null
          event_id?: string
          event_type?: string | null
          final_price?: number | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          payment_due_date?: string | null
          payment_status?: string | null
          quoted_price?: number | null
          rejection_reason?: string | null
          requested_by?: string
          requestor_company?: string | null
          requestor_name?: string | null
          requestor_phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          special_requests?: string | null
          status?: string
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_stats"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "venue_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_bookings_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          address: string
          amenities: Json | null
          capacity: number
          city: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          name: string
          postal_code: string | null
          updated_at: string
        }
        Insert: {
          address: string
          amenities?: Json | null
          capacity: number
          city?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name: string
          postal_code?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          amenities?: Json | null
          capacity?: number
          city?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name?: string
          postal_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      wizard_sessions: {
        Row: {
          completed_at: string | null
          contact_company: string | null
          contact_email: string | null
          contact_name: string | null
          contact_role: string | null
          created_at: string
          current_stage: string
          event_id: string | null
          id: string
          last_activity_at: string
          referrer: string | null
          stages_completed: string[] | null
          started_at: string
          state: Json | null
          status: string
          time_spent_seconds: number | null
          total_messages: number | null
          updated_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          contact_company?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_role?: string | null
          created_at?: string
          current_stage: string
          event_id?: string | null
          id?: string
          last_activity_at?: string
          referrer?: string | null
          stages_completed?: string[] | null
          started_at?: string
          state?: Json | null
          status?: string
          time_spent_seconds?: number | null
          total_messages?: number | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          contact_company?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_role?: string | null
          created_at?: string
          current_stage?: string
          event_id?: string | null
          id?: string
          last_activity_at?: string
          referrer?: string | null
          stages_completed?: string[] | null
          started_at?: string
          state?: Json | null
          status?: string
          time_spent_seconds?: number | null
          total_messages?: number | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wizard_sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_stats"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "wizard_sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      event_budget_summary: {
        Row: {
          event_id: string | null
          organizer_id: string | null
          paid_items: number | null
          total_actual: number | null
          total_estimated: number | null
          total_line_items: number | null
          total_paid: number | null
          total_variance: number | null
        }
        Relationships: [
          {
            foreignKeyName: "budgets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_stats"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "budgets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "organizers"
            referencedColumns: ["id"]
          },
        ]
      }
      event_stats: {
        Row: {
          capacity: number | null
          event_id: string | null
          event_name: string | null
          tickets_active: number | null
          tickets_available: number | null
          tickets_cancelled: number | null
          tickets_sold: number | null
          tickets_used: number | null
        }
        Relationships: []
      }
      event_task_progress: {
        Row: {
          blocked_tasks: number | null
          completed_tasks: number | null
          completion_percentage: number | null
          event_id: string | null
          organizer_id: string | null
          overdue_tasks: number | null
          pending_tasks: number | null
          total_tasks: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_stats"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "organizers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_venue_availability: {
        Args: {
          p_event_date: string
          p_event_date_range?: unknown
          p_venue_id: string
        }
        Returns: boolean
      }
      create_metrics_snapshot: {
        Args: { p_event_id: string }
        Returns: undefined
      }
      initialize_event_dashboard: {
        Args: { p_event_id: string }
        Returns: string
      }
      mark_abandoned_wizard_sessions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
      update_dashboard_metrics: {
        Args: {
          p_event_id: string
          p_metric_name: string
          p_metric_value: number
        }
        Returns: undefined
      }
      validate_promo_code: {
        Args: { p_code: string; p_event_id: string; p_ticket_tier_id?: string }
        Returns: {
          discount_type: string
          discount_value: number
          error_message: string
          is_valid: boolean
          promo_code_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

