# 04 - Suggested New Claude Skills & Sub-Agents

**Date**: 2025-10-19
**Project**: EventOS
**Purpose**: Identify workflow gaps and suggest automation improvements

---

## 📊 **Analysis Summary**

After analyzing the EventOS codebase, documentation, and existing Claude infrastructure, I've identified **8 high-impact skills** and **3 specialized agents** that would significantly improve development efficiency and automation.

### **Current State**
✅ **Existing Skills** (4): frontend-dashboard, db-schema-analyzer, playwright-e2e-skill, supabase-react-best-practices
✅ **Existing Agents** (4): supabase-mcp, task-checker, task-executor, task-orchestrator
✅ **Documentation**: Comprehensive MVP docs, architecture guides
✅ **Infrastructure**: Task Master, MCP servers, automation scripts

### **Identified Gaps**
❌ No deployment automation skill
❌ No migration management assistance
❌ No Stripe/payment integration skill
❌ No email template generation
❌ No performance monitoring integration
❌ No error tracking/debugging specialist
❌ No content generation for events
❌ No Vercel deployment optimization

---

## 🎯 **Suggested New Skills & Sub-Agents**

| Name | Type | Purpose | Priority | Impact |
|------|------|---------|----------|--------|
| vercel-deployment-optimizer | Skill | Automate Vercel deployments with optimization | 🔴 High | ⭐⭐⭐⭐⭐ |
| migration-manager | Skill | Generate, validate, test Supabase migrations | 🔴 High | ⭐⭐⭐⭐⭐ |
| stripe-integration-expert | Skill | Payment flow implementation & testing | 🟡 Medium | ⭐⭐⭐⭐ |
| email-template-generator | Skill | Create transactional email templates | 🟡 Medium | ⭐⭐⭐ |
| event-content-generator | Skill | AI-powered event descriptions & marketing | 🟡 Medium | ⭐⭐⭐⭐ |
| performance-monitor | Agent | Monitor Core Web Vitals & optimize | 🔴 High | ⭐⭐⭐⭐⭐ |
| error-detective | Agent | Debug errors with full context tracking | 🔴 High | ⭐⭐⭐⭐ |
| api-integration-specialist | Skill | External API integration patterns | 🟢 Low | ⭐⭐⭐ |
| component-library-builder | Skill | Generate shadcn/ui component patterns | 🟢 Low | ⭐⭐⭐ |
| analytics-dashboard-builder | Skill | Create analytics dashboards with Recharts | 🟡 Medium | ⭐⭐⭐⭐ |
| security-auditor | Agent | Comprehensive security scanning & fixes | 🔴 High | ⭐⭐⭐⭐⭐ |

---

## 🚀 **Priority 1: Critical Skills (Implement First)**

### 1. **vercel-deployment-optimizer**
**Type**: Skill
**Category**: DevOps / Deployment

#### **Purpose**
Automate and optimize Vercel deployments with environment management, build configuration, and performance optimization.

#### **Why It's Useful**
- EventOS deploys to Vercel (event-studio-rho.vercel.app)
- Manual deployment prone to errors
- No automated environment variable validation
- Missing deployment smoke tests
- Build optimization opportunities

#### **Capabilities**
```markdown
1. Pre-deployment validation
   - Check environment variables
   - Validate build configuration
   - Run type checking
   - Execute critical tests

2. Deployment execution
   - Deploy with proper environment
   - Configure redirects and rewrites
   - Set up edge functions
   - Optimize build settings

3. Post-deployment verification
   - Run smoke tests on deployed URL
   - Validate Core Web Vitals
   - Check for broken links
   - Monitor deployment health

4. Rollback assistance
   - Quick rollback to previous version
   - Preserve environment state
   - Notify team of issues
```

#### **Example Prompt**
```
"Deploy EventOS to production with the following:
- Validate all required environment variables
- Run type checking and build
- Deploy to Vercel production
- Run smoke tests on deployed URL
- Report Core Web Vitals scores"
```

#### **Implementation File**
```bash
.claude/skills/vercel-deployment-optimizer/
├── SKILL.md                    # Main skill definition
├── resources/
│   ├── deployment-checklist.md
│   ├── vercel-config.json
│   ├── smoke-tests.ts
│   └── rollback-guide.md
└── scripts/
    ├── validate-env.sh
    ├── pre-deploy.sh
    └── post-deploy.sh
```

---

### 2. **migration-manager**
**Type**: Skill
**Category**: Database / DevOps

#### **Purpose**
Streamline Supabase migration creation, validation, and testing with automatic RLS policy generation and rollback support.

#### **Why It's Useful**
- 30 tables with complex relationships
- RLS security critical (as proven by recent vulnerability)
- Manual migration prone to errors
- Need automated testing
- Schema changes require careful coordination

#### **Capabilities**
```markdown
1. Migration generation
   - Create migration files with proper naming
   - Generate RLS policies automatically
   - Add indexes for foreign keys
   - Include rollback SQL

2. Migration validation
   - Check for breaking changes
   - Validate RLS policy coverage
   - Ensure proper constraints
   - Test foreign key integrity

3. Testing automation
   - Generate test data for migrations
   - Run migration in test environment
   - Validate data integrity
   - Test rollback scenarios

4. Documentation
   - Auto-generate migration docs
   - Update schema documentation
   - Create ERD diagrams
   - Track schema evolution
```

#### **Example Prompt**
```
"Create a migration to add a 'promo_codes' table with:
- UUID primary key
- Discount percentage/amount fields
- Usage limits and expiration
- Event relationship (foreign key)
- Proper RLS policies
- Indexes for performance
- Rollback SQL"
```

#### **Implementation File**
```bash
.claude/skills/migration-manager/
├── SKILL.md
├── resources/
│   ├── migration-template.sql
│   ├── rls-patterns.sql
│   ├── index-patterns.sql
│   ├── rollback-template.sql
│   └── testing-guide.md
└── scripts/
    ├── generate-migration.sh
    ├── validate-migration.sh
    └── test-migration.sh
```

---

### 3. **security-auditor**
**Type**: Agent
**Category**: Security / Quality Assurance

#### **Purpose**
Proactively scan code for security vulnerabilities, validate RLS policies, check for exposed secrets, and ensure OWASP compliance.

#### **Why It's Useful**
- Recent RLS vulnerability discovered (PUBLIC access exposure)
- Payment processing requires PCI compliance
- User data privacy critical (GDPR)
- Need automated security scanning
- Environment variables must be protected

#### **Capabilities**
```markdown
1. RLS Policy Auditing
   - Verify all tables have RLS enabled
   - Check policy coverage (SELECT, INSERT, UPDATE, DELETE)
   - Validate auth.uid() usage
   - Detect overly permissive policies (USING (true))
   - Test policy effectiveness

2. Secret Scanning
   - Detect hardcoded API keys
   - Find exposed tokens
   - Check for leaked credentials
   - Validate environment variable usage
   - Scan git history for secrets

3. Code Security Analysis
   - SQL injection vulnerability detection
   - XSS prevention validation
   - CSRF token verification
   - Input sanitization checks
   - Output encoding validation

4. Compliance Validation
   - OWASP Top 10 compliance
   - PCI DSS for payments
   - GDPR data protection
   - Rate limiting implementation
   - Security headers validation

5. Dependency Scanning
   - Check for vulnerable packages
   - Validate dependency versions
   - Review security advisories
   - Suggest security updates
```

#### **Example Prompt**
```
"Run a comprehensive security audit on EventOS:
- Scan all RLS policies for vulnerabilities
- Check for exposed secrets in code and env files
- Validate payment integration security
- Review authentication implementation
- Generate security report with fixes"
```

#### **Agent Definition**
```markdown
---
name: security-auditor
description: Comprehensive security scanning and vulnerability detection. Use PROACTIVELY before production deployments, after adding payment features, when modifying RLS policies, or when implementing authentication.
model: sonnet
color: red
---

You are an elite security specialist focused on preventing vulnerabilities in the EventOS platform...
```

---

## ⚡ **Priority 2: High-Value Skills**

### 4. **stripe-integration-expert**
**Type**: Skill
**Category**: Payments / E-commerce

#### **Purpose**
Implement and test Stripe payment flows with webhook handling, subscription management, and Canadian tax calculations.

#### **Why It's Useful**
- Booking system requires payment processing
- Stripe integration mentioned in architecture
- Webhook handling complex
- Tax calculations for Canadian events (GST/PST/HST)
- Need refund and dispute handling

#### **Capabilities**
- Payment intent creation
- Webhook event handling
- Subscription management
- Tax calculation utilities
- Refund processing
- Receipt generation
- PCI compliance validation

#### **Example Prompt**
```
"Implement Stripe checkout for event tickets:
- Create payment intent for order
- Handle webhook for payment confirmation
- Calculate Canadian taxes (Province: ON)
- Generate receipt email
- Handle failed payments with retry logic"
```

---

### 5. **performance-monitor**
**Type**: Agent
**Category**: Performance / Monitoring

#### **Purpose**
Monitor application performance, track Core Web Vitals, identify bottlenecks, and suggest optimizations.

#### **Why It's Useful**
- Dashboard must load < 2s (per architecture docs)
- Real-time updates impact performance
- Large component tree (shadcn/ui)
- Need Lighthouse score optimization
- Bundle size optimization critical

#### **Capabilities**
- Core Web Vitals tracking (LCP, FID, CLS)
- Bundle size analysis
- Lighthouse audit automation
- Performance regression detection
- Database query optimization
- React rendering optimization
- Cache strategy validation

#### **Example Prompt**
```
"Analyze EventOS performance:
- Run Lighthouse audit
- Check Core Web Vitals
- Identify slow database queries
- Analyze bundle sizes
- Suggest optimizations with code examples"
```

---

### 6. **event-content-generator**
**Type**: Skill
**Category**: AI / Content

#### **Purpose**
Generate event descriptions, marketing copy, social media posts, and SEO-optimized content using AI.

#### **Why It's Useful**
- Event wizard needs AI-powered content (per docs)
- Marketing stage requires compelling copy
- SEO optimization critical for discovery
- Social media promotion automation
- Multi-language support needed

#### **Capabilities**
- Event description generation
- Marketing copy creation
- Social media post templates
- SEO meta tags generation
- Email marketing content
- Multi-language translation
- A/B testing copy variations

#### **Example Prompt**
```
"Generate content for a tech conference:
Title: 'AI Summit 2025'
Type: Conference
Audience: Developers and CTOs
Duration: 3 days

Create:
1. Compelling event description (200 words)
2. Short marketing tagline
3. SEO meta description (160 chars)
4. Twitter announcement
5. LinkedIn post
6. Email invitation subject lines (3 variations)"
```

---

## 🔧 **Priority 3: Productivity Enhancements**

### 7. **error-detective**
**Type**: Agent
**Category**: Debugging / Error Tracking

#### **Purpose**
Analyze errors with full context, suggest fixes, track error patterns, and integrate with monitoring tools.

#### **Why It's Useful**
- Complex error scenarios in React
- Supabase RLS errors cryptic
- TypeScript errors overwhelming
- Need context-aware debugging
- Error patterns need tracking

#### **Capabilities**
- Parse error stack traces
- Identify root causes
- Suggest specific fixes
- Track error patterns
- Integration with Sentry/LogRocket
- Generate reproduction steps
- Create unit tests for bugs

---

### 8. **email-template-generator**
**Type**: Skill
**Category**: Email / Communications

#### **Purpose**
Create responsive, branded email templates for transactional and marketing emails with proper rendering across clients.

#### **Why It's Useful**
- Booking confirmations need emails
- Event reminders automated
- Marketing campaigns planned
- Multi-client rendering complex
- Brand consistency required

---

### 9. **analytics-dashboard-builder**
**Type**: Skill
**Category**: Data Visualization / Analytics

#### **Purpose**
Generate analytics dashboards with Recharts, implement data tracking, and create KPI visualizations.

#### **Why It's Useful**
- Analytics & Reporting is core feature (per docs)
- Recharts already in dependencies
- Complex data aggregation needed
- KPI visualization patterns
- Real-time chart updates

---

### 10. **component-library-builder**
**Type**: Skill
**Category**: UI / Frontend

#### **Purpose**
Generate shadcn/ui component patterns, create reusable components, and maintain design system consistency.

#### **Why It's Useful**
- 40+ shadcn/ui components installed
- Component patterns need standardization
- Accessibility compliance required
- Theming consistency critical
- Storybook integration potential

---

### 11. **api-integration-specialist**
**Type**: Skill
**Category**: Integration / APIs

#### **Purpose**
Implement third-party API integrations with proper error handling, rate limiting, and retry logic.

#### **Why It's Useful**
- External services mentioned (email, analytics)
- Webhook handling common
- OAuth integrations needed
- API client patterns standardization
- Error handling best practices

---

## 📋 **Implementation Priority Matrix**

### **Phase 1: Security & Stability (Week 1)**
1. ✅ security-auditor (Fix RLS vulnerability first!)
2. ✅ migration-manager (Prevent future schema issues)
3. ✅ vercel-deployment-optimizer (Safe deployments)

### **Phase 2: Core Features (Week 2)**
4. ✅ stripe-integration-expert (Enable payments)
5. ✅ performance-monitor (Meet performance goals)
6. ✅ error-detective (Faster debugging)

### **Phase 3: Productivity (Week 3)**
7. ✅ event-content-generator (AI features)
8. ✅ email-template-generator (Communication automation)
9. ✅ analytics-dashboard-builder (Data visualization)

### **Phase 4: Polish (Week 4)**
10. ✅ component-library-builder (UI consistency)
11. ✅ api-integration-specialist (External services)

---

## 🎯 **Top 2 Most Impactful Recommendations**

### **#1: security-auditor Agent** ⭐⭐⭐⭐⭐
**Why**: The recent RLS vulnerability demonstrates critical need for automated security scanning. This agent would have caught the issue before deployment.

**Immediate Value**:
- Prevent data breaches
- Ensure PCI compliance for payments
- Automate security testing
- Catch vulnerabilities early

**ROI**: Prevents potential $100K+ breach costs

---

### **#2: vercel-deployment-optimizer Skill** ⭐⭐⭐⭐⭐
**Why**: Deployments are frequent, error-prone, and lack validation. This skill ensures every deployment is optimized and validated.

**Immediate Value**:
- Zero-downtime deployments
- Automated smoke testing
- Environment validation
- Performance optimization

**ROI**: Saves 2+ hours per deployment, prevents deployment failures

---

## 🛠️ **Quick Start Implementation**

### **Step 1: Create security-auditor Agent**
```bash
# Create agent file
touch .claude/agents/security-auditor.md

# Add to .claude/skills directory
mkdir -p .claude/skills/security-auditor/resources
```

### **Step 2: Create vercel-deployment-optimizer Skill**
```bash
# Create skill structure
mkdir -p .claude/skills/vercel-deployment-optimizer/{resources,scripts}
touch .claude/skills/vercel-deployment-optimizer/SKILL.md
```

### **Step 3: Test and Iterate**
```bash
# Test security-auditor
claude-code "Run security audit on EventOS"

# Test deployment optimizer
claude-code "Deploy to staging with verification"
```

---

## 📊 **Expected Impact**

### **Development Velocity**
- **Before**: Manual deployments, ad-hoc testing, reactive debugging
- **After**: Automated workflows, proactive monitoring, AI-assisted development
- **Time Savings**: 10-15 hours per week

### **Code Quality**
- **Security**: 100% RLS coverage validation, zero exposed secrets
- **Performance**: Core Web Vitals monitoring, automated optimization
- **Reliability**: Comprehensive testing, deployment validation

### **Team Productivity**
- **Reduced Context Switching**: AI handles routine tasks
- **Faster Debugging**: Error detective provides instant context
- **Better Code Review**: Security auditor catches issues early

---

## ✅ **Success Metrics**

After implementing these skills/agents, track:

1. **Security Incidents**: Should decrease to zero
2. **Deployment Time**: Should reduce by 50%
3. **Bug Resolution Time**: Should reduce by 40%
4. **Code Review Time**: Should reduce by 30%
5. **Developer Satisfaction**: Should increase significantly

---

## 🎓 **Learning Resources**

For implementing these skills, reference:
- `.claude/docs/03-skills.md` - Skill creation guide
- `.claude/agents/` - Agent pattern examples
- `docs/mvp/` - Project architecture and features
- `AGENT-TESTING-REPORT.md` - Testing methodology

---

## 🚦 **Next Steps**

### **Immediate (This Week)**
1. ✅ Create `security-auditor` agent
2. ✅ Fix RLS vulnerability it would have caught
3. ✅ Document security audit process

### **Short-term (Next 2 Weeks)**
4. ✅ Implement `vercel-deployment-optimizer`
5. ✅ Create `migration-manager` skill
6. ✅ Set up automated deployment pipeline

### **Medium-term (Next Month)**
7. ✅ Add remaining Priority 1 & 2 skills
8. ✅ Integrate with CI/CD pipeline
9. ✅ Train team on new workflows

---

## 📝 **Appendix: Skill Template**

### **Template for New Skills**
```markdown
---
name: skill-name
description: Brief description. Use when [trigger conditions]. Use PROACTIVELY for [scenarios].
---

# Skill Name

## What This Skill Does
[Clear explanation of capabilities]

## When to Use This Skill
[Specific trigger conditions]

## Quick Start Examples
[3-5 concrete examples]

## Resources
- `resources/` folder content

## Best Practices
[Guidelines and tips]
```

---

**Summary**: 11 new skills and agents identified. **Top 2 priorities**: security-auditor (prevent vulnerabilities) and vercel-deployment-optimizer (safe deployments). Implementing these would save 10-15 hours/week and prevent critical security issues.

**Recommendation**: Start with security-auditor immediately to fix and prevent RLS vulnerabilities, then add deployment optimizer to streamline releases.

---

**Document Created**: 2025-10-19
**Next Review**: After implementing Phase 1 (1 week)
**Status**: Ready for Implementation
