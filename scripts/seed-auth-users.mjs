import { createClient } from '@supabase/supabase-js'

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nAdd to .env file:')
  console.error('SUPABASE_URL=https://asrzdtpyrdgyggqdfwwl.supabase.co')
  console.error('SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>')
  console.error('\nGet service role key from: Project Settings → API → service_role\n')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const users = [
  {
    email: 'sofia.martinez@toronto-events.local',
    name: 'Sofía Martínez',
    company: 'Toronto Tech Summit',
    phone: '+1-416-555-0101'
  },
  {
    email: 'carlos.lopez@toronto-events.local',
    name: 'Carlos López',
    company: 'Innovation Network',
    phone: '+1-416-555-0102'
  },
  {
    email: 'ana.rodriguez@toronto-events.local',
    name: 'Ana Rodríguez',
    company: 'Business Connect TO',
    phone: '+1-416-555-0103'
  },
  {
    email: 'diego.sanchez@toronto-events.local',
    name: 'Diego Sánchez',
    company: 'Startup Hub Toronto',
    phone: '+1-416-555-0104'
  },
  {
    email: 'maria.garcia@toronto-events.local',
    name: 'María García',
    company: 'Professional Events Co',
    phone: '+1-416-555-0105'
  },
]

async function main() {
  console.log('👤 Seeding EventOS auth users via Supabase Admin API...\n')
  console.log(`📍 Target: ${SUPABASE_URL}\n`)

  let created = 0
  let existing = 0

  for (const u of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: 'EventOS2025!',
      email_confirm: true, // Bypasses email confirmation
      user_metadata: {
        full_name: u.name,
        company: u.company,
        phone: u.phone
      },
    })

    if (error) {
      // 422 = already exists; treat as ok for idempotent seeds
      if (error.status === 422) {
        console.log(`↺ User already exists: ${u.email}`)
        existing++
        continue
      }
      console.error(`❌ Failed for ${u.email}:`, error.message)
      process.exit(1)
    }

    console.log(`✅ Created: ${u.email}`)
    console.log(`   - ID: ${data.user.id}`)
    console.log(`   - Name: ${u.name}`)
    console.log(`   - Company: ${u.company}`)
    console.log(`   - Phone: ${u.phone}\n`)
    created++
  }

  console.log('\n📊 Summary:')
  console.log(`   - Created: ${created}`)
  console.log(`   - Already existed: ${existing}`)
  console.log(`   - Total: ${created + existing}`)
  console.log('\n✅ Auth user seeding complete!\n')
  console.log('🔍 Verify in Supabase Dashboard → Authentication → Users')
  console.log('🔍 Or run: node scripts/test-db-connection.js\n')
}

main().catch((e) => {
  console.error('❌ Seed error:', e)
  process.exit(1)
})
