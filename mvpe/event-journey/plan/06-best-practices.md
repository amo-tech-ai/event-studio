# Vite + React + Supabase Best Practices

## 🎯 **Best Practices Overview**

This document outlines the best practices for implementing the event registration flow using Vite, React, and Supabase, ensuring optimal performance, security, and maintainability.

## ⚡ **Vite Best Practices**

### **1. Project Configuration**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Enable JSX runtime
      jsxRuntime: 'automatic'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types')
    }
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:54321',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          stripe: ['@stripe/stripe-js']
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      '@stripe/stripe-js'
    ]
  }
})
```

### **2. Environment Variables**
```bash
# .env.local
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_APP_ENV=development
```

```typescript
// src/config/env.ts
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
  },
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  },
  app: {
    env: import.meta.env.VITE_APP_ENV
  }
}
```

### **3. Build Optimization**
```typescript
// vite.config.ts - Build optimizations
export default defineConfig({
  build: {
    // Enable gzip compression
    reportCompressedSize: true,
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react'
            if (id.includes('supabase')) return 'supabase'
            if (id.includes('stripe')) return 'stripe'
            return 'vendor'
          }
        }
      }
    }
  }
})
```

## ⚛️ **React Best Practices**

### **1. Component Structure**
```typescript
// src/components/registration/EventRegistration.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { TicketSelector } from './TicketSelector'
import { PaymentForm } from './PaymentForm'
import { OrderConfirmation } from './OrderConfirmation'
import { useRegistration } from '@/hooks/useRegistration'

interface EventRegistrationProps {
  eventId: string
}

export const EventRegistration: React.FC<EventRegistrationProps> = ({ eventId }) => {
  const [currentStep, setCurrentStep] = useState<'tickets' | 'payment' | 'confirmation'>('tickets')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { 
    selectedTickets, 
    setSelectedTickets, 
    userInfo, 
    setUserInfo,
    order,
    createOrder 
  } = useRegistration(eventId)

  const handleTicketSelection = useCallback((tickets: TicketSelection[]) => {
    setSelectedTickets(tickets)
    setCurrentStep('payment')
  }, [setSelectedTickets])

  const handlePaymentSuccess = useCallback(async (paymentIntent: PaymentIntent) => {
    setIsLoading(true)
    try {
      const orderData = await createOrder(paymentIntent)
      setOrder(orderData)
      setCurrentStep('confirmation')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }, [createOrder, setOrder])

  if (error) {
    return <ErrorBoundary error={error} onRetry={() => setError(null)} />
  }

  return (
    <div className="min-h-screen bg-background">
      <RegistrationHeader currentStep={currentStep} />
      
      <main className="container mx-auto px-4 py-8">
        {currentStep === 'tickets' && (
          <TicketSelector
            eventId={eventId}
            onSelectionChange={handleTicketSelection}
            selectedTickets={selectedTickets}
          />
        )}
        
        {currentStep === 'payment' && (
          <PaymentForm
            selectedTickets={selectedTickets}
            userInfo={userInfo}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={() => setCurrentStep('tickets')}
            isLoading={isLoading}
          />
        )}
        
        {currentStep === 'confirmation' && order && (
          <OrderConfirmation
            order={order}
            eventId={eventId}
          />
        )}
      </main>
    </div>
  )
}
```

### **2. Custom Hooks**
```typescript
// src/hooks/useRegistration.ts
import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export const useRegistration = (eventId: string) => {
  const { user } = useAuth()
  const [selectedTickets, setSelectedTickets] = useState<TicketSelection[]>([])
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [order, setOrder] = useState<Order | null>(null)

  const createOrder = useCallback(async (paymentIntent: PaymentIntent) => {
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        event_id: eventId,
        payment_intent_id: paymentIntent.id,
        tickets: selectedTickets,
        total_amount: selectedTickets.reduce((sum, ticket) => sum + ticket.totalPrice, 0),
        status: 'confirmed'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }, [user, eventId, selectedTickets])

  return {
    selectedTickets,
    setSelectedTickets,
    userInfo,
    setUserInfo,
    order,
    setOrder,
    createOrder
  }
}
```

### **3. Error Boundaries**
```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              We're sorry, but something unexpected happened.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

### **4. Form Validation**
```typescript
// src/utils/validation.ts
import { z } from 'zod'

export const ticketSelectionSchema = z.object({
  ticketTierId: z.string().min(1, 'Please select a ticket type'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(10, 'Maximum 10 tickets per order'),
  pricePerTicket: z.number().positive('Invalid price'),
  totalPrice: z.number().positive('Invalid total price')
})

export const paymentSchema = z.object({
  cardNumber: z.string()
    .min(13, 'Card number too short')
    .max(19, 'Card number too long')
    .regex(/^\d+$/, 'Card number must contain only digits'),
  expiryDate: z.string()
    .regex(/^\d{2}\/\d{2}$/, 'Invalid expiry date format'),
  cvv: z.string()
    .min(3, 'CVV too short')
    .max(4, 'CVV too long')
    .regex(/^\d+$/, 'CVV must contain only digits'),
  billingAddress: z.object({
    line1: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required')
  })
})

export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new Error(result.error.errors[0].message)
  }
  return result.data
}
```

## 🗄️ **Supabase Best Practices**

### **1. Client Configuration**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { config } from '@/config/env'

export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
)
```

### **2. Database Schema**
```sql
-- orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  payment_intent_id TEXT NOT NULL,
  tickets JSONB NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can only see their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update orders (for status changes)
CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);
```

### **3. Real-time Subscriptions**
```typescript
// src/hooks/useOrderUpdates.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export const useOrderUpdates = (orderId: string) => {
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || !orderId) return

    // Initial fetch
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Error fetching order:', error)
        return
      }

      setOrder(data)
      setIsLoading(false)
    }

    fetchOrder()

    // Real-time subscription
    const subscription = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          setOrder(payload.new as Order)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user, orderId])

  return { order, isLoading }
}
```

### **4. Error Handling**
```typescript
// src/utils/supabaseErrorHandler.ts
import { PostgrestError } from '@supabase/supabase-js'

export const handleSupabaseError = (error: PostgrestError): string => {
  switch (error.code) {
    case '23505':
      return 'This order already exists'
    case '23503':
      return 'Invalid event or user reference'
    case '42501':
      return 'Permission denied'
    case '42P01':
      return 'Database table not found'
    default:
      return error.message || 'An unexpected error occurred'
  }
}

export const isSupabaseError = (error: unknown): error is PostgrestError => {
  return error !== null && typeof error === 'object' && 'code' in error
}
```

## 🔒 **Security Best Practices**

### **1. Input Sanitization**
```typescript
// src/utils/sanitize.ts
import DOMPurify from 'dompurify'

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim())
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/
  return phoneRegex.test(phone)
}
```

### **2. Rate Limiting**
```typescript
// src/utils/rateLimit.ts
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export const checkRateLimit = (key: string, limit: number, windowMs: number): boolean => {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}
```

### **3. CSRF Protection**
```typescript
// src/utils/csrf.ts
export const generateCSRFToken = (): string => {
  return crypto.randomUUID()
}

export const validateCSRFToken = (token: string, sessionToken: string): boolean => {
  return token === sessionToken
}
```

## 📊 **Performance Best Practices**

### **1. Code Splitting**
```typescript
// src/pages/EventRegistration.tsx
import { lazy, Suspense } from 'react'

const PaymentForm = lazy(() => import('@/components/registration/PaymentForm'))
const OrderConfirmation = lazy(() => import('@/components/registration/OrderConfirmation'))

export const EventRegistration = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PaymentForm />
      <OrderConfirmation />
    </Suspense>
  )
}
```

### **2. Memoization**
```typescript
// src/components/registration/TicketSelector.tsx
import React, { memo, useMemo } from 'react'

export const TicketSelector = memo(({ eventId, onSelectionChange, selectedTickets }) => {
  const ticketTiers = useMemo(() => {
    // Expensive computation
    return calculateTicketTiers(eventId)
  }, [eventId])

  const totalPrice = useMemo(() => {
    return selectedTickets.reduce((sum, ticket) => sum + ticket.totalPrice, 0)
  }, [selectedTickets])

  return (
    <div>
      {/* Component content */}
    </div>
  )
})
```

### **3. Virtual Scrolling**
```typescript
// src/components/registration/TicketList.tsx
import { FixedSizeList as List } from 'react-window'

export const TicketList = ({ tickets }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <TicketItem ticket={tickets[index]} />
    </div>
  )

  return (
    <List
      height={600}
      itemCount={tickets.length}
      itemSize={120}
    >
      {Row}
    </List>
  )
}
```

## 🧪 **Testing Best Practices**

### **1. Component Testing**
```typescript
// src/components/__tests__/EventRegistration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EventRegistration } from '../EventRegistration'
import { supabase } from '@/lib/supabase'

jest.mock('@/lib/supabase')
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'test-user-id' } })
}))

describe('EventRegistration', () => {
  it('renders ticket selection step initially', () => {
    render(<EventRegistration eventId="test-event-id" />)
    expect(screen.getByText('Select Your Tickets')).toBeInTheDocument()
  })

  it('proceeds to payment step after ticket selection', async () => {
    render(<EventRegistration eventId="test-event-id" />)
    
    fireEvent.click(screen.getByText('Continue to Payment'))
    
    await waitFor(() => {
      expect(screen.getByText('Payment Information')).toBeInTheDocument()
    })
  })
})
```

### **2. Integration Testing**
```typescript
// src/__tests__/registration-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EventRegistration } from '@/pages/EventRegistration'

describe('Registration Flow Integration', () => {
  it('completes full registration flow', async () => {
    const user = userEvent.setup()
    render(<EventRegistration eventId="test-event-id" />)
    
    // Select tickets
    await user.click(screen.getByLabelText('Early Bird Ticket'))
    await user.type(screen.getByLabelText('Quantity'), '2')
    await user.click(screen.getByText('Continue to Payment'))
    
    // Fill payment form
    await user.type(screen.getByLabelText('Card Number'), '4242424242424242')
    await user.type(screen.getByLabelText('Expiry Date'), '12/25')
    await user.type(screen.getByLabelText('CVV'), '123')
    
    // Submit payment
    await user.click(screen.getByText('Complete Registration'))
    
    // Verify confirmation
    await waitFor(() => {
      expect(screen.getByText('Registration Confirmed')).toBeInTheDocument()
    })
  })
})
```

These best practices ensure a robust, secure, and performant event registration system that follows industry standards and provides excellent user experience.
