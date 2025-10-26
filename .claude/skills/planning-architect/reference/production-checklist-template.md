# Production Checklist Template

Comprehensive pre-deployment validation checklist.

---

## 🎯 Overview

This checklist ensures production readiness before deploying features. **ALL items must be checked** before deployment.

---

## 1. Code Quality ✅

### TypeScript
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] All types properly defined (no `any` types)
- [ ] Strict mode enabled in tsconfig.json
- [ ] All imports resolve correctly
- [ ] Database types generated and up-to-date

### Linting
- [ ] ESLint passes with zero errors (`npm run lint`)
- [ ] No ESLint warnings in production code
- [ ] Prettier formatting applied (`npm run format`)
- [ ] No console.log statements (use proper logging)
- [ ] No commented-out code blocks

### Code Review
- [ ] Code reviewed by at least one other developer
- [ ] All review comments addressed
- [ ] Naming conventions followed
- [ ] Code is DRY (Don't Repeat Yourself)
- [ ] Functions are small and focused

---

## 2. Testing ✅

### Unit Tests
- [ ] All unit tests pass (`npm test`)
- [ ] Test coverage > 80% for new code
- [ ] No skipped tests (.skip or .only)
- [ ] All edge cases tested
- [ ] Error handling tested

### Integration Tests
- [ ] API integration tests pass
- [ ] Database queries tested
- [ ] Authentication flows tested
- [ ] Edge Functions tested locally
- [ ] RLS policies validated

### E2E Tests
- [ ] Critical user flows tested with Playwright MCP
- [ ] All E2E tests pass
- [ ] Screenshots captured for documentation
- [ ] Network requests validated
- [ ] Error scenarios tested

### Manual Testing
- [ ] Feature tested locally
- [ ] Feature tested in staging environment
- [ ] Tested on Chrome, Firefox, Safari, Edge
- [ ] Tested on mobile devices (iOS, Android)
- [ ] Tested on different screen sizes
- [ ] Tested with slow network (Slow 3G)
- [ ] Tested offline behavior

---

## 3. Performance ✅

### Build Optimization
- [ ] Production build succeeds (`npm run build`)
- [ ] Bundle size analyzed and optimized
- [ ] No unused dependencies
- [ ] Code splitting implemented
- [ ] Images optimized (WebP, compression)
- [ ] Fonts optimized (subset, WOFF2)

### Lighthouse Audit
- [ ] Performance score > 90
- [ ] Accessibility score > 95
- [ ] Best Practices score > 90
- [ ] SEO score > 90
- [ ] No layout shifts (CLS < 0.1)

### API Performance
- [ ] API response times < 200ms (p95)
- [ ] Database queries optimized
- [ ] Indexes created for common queries
- [ ] N+1 queries eliminated
- [ ] Caching strategy implemented

### Frontend Performance
- [ ] Initial page load < 2s
- [ ] Time to Interactive < 3s
- [ ] Largest Contentful Paint < 2.5s
- [ ] First Input Delay < 100ms
- [ ] No unnecessary re-renders

---

## 4. Security ✅

### Authentication
- [ ] PKCE flow implemented correctly
- [ ] Session management working
- [ ] Logout functionality tested
- [ ] Token refresh working
- [ ] Protected routes enforced

### Authorization
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] RLS policies tested with different user roles
- [ ] Users can only access their own data
- [ ] Admin roles work correctly
- [ ] Public access restricted appropriately

### Input Validation
- [ ] All user input validated (client + server)
- [ ] Zod schemas defined for all forms
- [ ] SQL injection prevention verified
- [ ] XSS prevention implemented
- [ ] CSRF protection enabled

### Data Security
- [ ] No sensitive data in logs
- [ ] No API keys in frontend code
- [ ] Environment variables properly set
- [ ] Secrets stored in secure vault
- [ ] Database credentials rotated

### Security Headers
- [ ] Content-Security-Policy set
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] Strict-Transport-Security enabled
- [ ] Referrer-Policy set

### Dependency Security
- [ ] `npm audit` shows no critical vulnerabilities
- [ ] All dependencies up-to-date
- [ ] No deprecated packages
- [ ] License compliance verified

---

## 5. Database ✅

### Migrations
- [ ] All migrations tested locally
- [ ] Migrations are idempotent (can run multiple times)
- [ ] Rollback scripts created
- [ ] Migrations tested on staging
- [ ] Migration order documented
- [ ] No destructive migrations without backup

### Data Integrity
- [ ] Foreign key constraints defined
- [ ] Unique constraints defined
- [ ] NOT NULL constraints appropriate
- [ ] Check constraints implemented
- [ ] Default values set

### Indexes
- [ ] Indexes created for common queries
- [ ] Composite indexes for multi-column queries
- [ ] Index usage verified with EXPLAIN ANALYZE
- [ ] No redundant indexes

### RLS Policies
- [ ] All tables have RLS enabled
- [ ] Policies tested with different users
- [ ] No policy bypasses in application code
- [ ] Policies documented

### Backup & Recovery
- [ ] Automated backups enabled
- [ ] Backup restoration tested
- [ ] Point-in-time recovery configured
- [ ] Disaster recovery plan documented

---

## 6. Edge Functions ✅

### Deployment
- [ ] Functions deploy successfully
- [ ] Function logs are clean (no errors)
- [ ] Environment variables set
- [ ] Secrets configured
- [ ] Function permissions correct

### Testing
- [ ] Functions tested locally with `supabase functions serve`
- [ ] Functions tested in staging
- [ ] Error handling works
- [ ] Timeout scenarios handled
- [ ] Rate limiting tested

### Monitoring
- [ ] Function logs reviewed
- [ ] Error tracking configured
- [ ] Performance metrics collected
- [ ] Alerts configured

---

## 7. Frontend ✅

### Build
- [ ] Production build succeeds
- [ ] Build output analyzed
- [ ] No build warnings
- [ ] Environment variables set correctly
- [ ] Source maps generated (for debugging)

### Deployment
- [ ] Deployed to staging first
- [ ] Staging tested thoroughly
- [ ] DNS configured correctly
- [ ] SSL certificate valid
- [ ] CDN configured (if applicable)

### Error Handling
- [ ] Error boundaries implemented
- [ ] User-friendly error messages
- [ ] Fallback UI for errors
- [ ] 404 page exists
- [ ] 500 page exists

### Loading States
- [ ] Loading spinners for async operations
- [ ] Skeleton screens implemented
- [ ] Progress indicators for long operations
- [ ] Empty states designed
- [ ] No "flash of unstyled content"

---

## 8. Accessibility ✅

### WCAG Compliance
- [ ] WCAG 2.1 Level AA compliance
- [ ] Color contrast ratio > 4.5:1
- [ ] Focus indicators visible
- [ ] No keyboard traps
- [ ] Skip navigation links

### Screen Reader Support
- [ ] All images have alt text
- [ ] ARIA labels on interactive elements
- [ ] ARIA live regions for dynamic content
- [ ] Semantic HTML used
- [ ] Headings in logical order

### Keyboard Navigation
- [ ] All interactive elements keyboard accessible
- [ ] Tab order logical
- [ ] Escape key closes modals
- [ ] Enter key submits forms
- [ ] Arrow keys navigate lists

### Testing
- [ ] Tested with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Tested keyboard-only navigation
- [ ] Tested with browser zoom (200%)
- [ ] Tested with high contrast mode
- [ ] axe DevTools scan passes

---

## 9. Documentation ✅

### Code Documentation
- [ ] JSDoc comments on all exported functions
- [ ] Complex logic explained with comments
- [ ] README updated
- [ ] API endpoints documented
- [ ] Database schema documented

### User Documentation
- [ ] Feature documentation written
- [ ] User guide updated
- [ ] FAQ updated (if applicable)
- [ ] Help tooltips added
- [ ] Video tutorial (if applicable)

### Developer Documentation
- [ ] Setup instructions updated
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Troubleshooting guide updated
- [ ] Architecture diagrams current

---

## 10. Monitoring & Observability ✅

### Error Tracking
- [ ] Sentry (or similar) integrated
- [ ] Error alerts configured
- [ ] Source maps uploaded
- [ ] User context captured
- [ ] Error boundaries report to Sentry

### Analytics
- [ ] Analytics events implemented
- [ ] User flows tracked
- [ ] Conversion funnels defined
- [ ] Performance metrics tracked
- [ ] Privacy compliance verified

### Logging
- [ ] Structured logging implemented
- [ ] Log levels appropriate
- [ ] No sensitive data in logs
- [ ] Log aggregation configured
- [ ] Log retention policy set

### Alerts
- [ ] Error rate alerts configured
- [ ] Performance degradation alerts
- [ ] Database connection alerts
- [ ] Security incident alerts
- [ ] On-call rotation defined

---

## 11. Compliance ✅

### Legal
- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] Cookie consent implemented (if applicable)
- [ ] GDPR compliance verified (if applicable)
- [ ] CCPA compliance verified (if applicable)

### Data Handling
- [ ] Data retention policy followed
- [ ] User data deletion working
- [ ] Data export functionality (if required)
- [ ] PII handling compliant
- [ ] Data processing agreements signed

---

## 12. Rollback Plan ✅

### Preparation
- [ ] Rollback procedure documented
- [ ] Previous version tagged in git
- [ ] Database rollback scripts ready
- [ ] Communication plan prepared
- [ ] Team notified of deployment

### Verification
- [ ] Rollback tested in staging
- [ ] Rollback time estimated
- [ ] Dependencies identified
- [ ] Downtime window communicated

---

## 13. Post-Deployment ✅

### Verification
- [ ] Health check endpoints responding
- [ ] Critical user flows tested in production
- [ ] Database migrations applied successfully
- [ ] Edge Functions deployed successfully
- [ ] No console errors in production

### Monitoring (First 24 Hours)
- [ ] Error rates normal
- [ ] Performance metrics normal
- [ ] User feedback collected
- [ ] Analytics data flowing
- [ ] No security incidents

### Communication
- [ ] Stakeholders notified of deployment
- [ ] Release notes published
- [ ] Team debriefed
- [ ] Known issues documented
- [ ] Success criteria met

---

## 🎉 Deployment Sign-Off

**Feature Name**: ___________________________
**Deployed By**: ___________________________
**Date**: ___________________________
**Version/Tag**: ___________________________

### Approvals

- [ ] Engineering Lead: ___________________________
- [ ] Product Manager: ___________________________
- [ ] QA Lead: ___________________________
- [ ] Security Review: ___________________________

### Deployment Status

- [ ] **ALL checklist items completed**
- [ ] **All tests passing**
- [ ] **No critical bugs**
- [ ] **Performance requirements met**
- [ ] **Security requirements met**

### Post-Deployment Notes

```
[Space for notes about deployment, issues encountered, lessons learned]
```

---

## 📊 Metrics to Track

### Performance
- Initial page load time
- API response times (p50, p95, p99)
- Database query times
- Error rate
- Uptime

### Usage
- Daily active users
- Feature adoption rate
- Conversion rate
- User satisfaction score
- Support tickets

### Business
- Revenue impact
- Cost savings
- Time savings
- User engagement
- Retention rate

---

**Checklist Version**: 1.0
**Last Updated**: 2025-10-23

**Remember**: Production is not a testing environment. All issues must be caught before deployment!
