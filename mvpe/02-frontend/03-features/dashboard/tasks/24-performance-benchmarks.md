# Task 24: Week 4 - Performance Benchmarks & Optimization
**Phase:** Week 4
**Priority:** 🟡 HIGH
**Time:** 2 hours
**Status:** 🔴 NOT STARTED
**Dependencies:** Task 23

---

## 🎯 Objective

Run comprehensive performance benchmarks and validate all optimization targets are met.

---

## ✅ Success Criteria

- [ ] Lighthouse score > 90
- [ ] Page load < 2 seconds
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Bundle size < 500KB
- [ ] Query response < 500ms
- [ ] Performance report created

---

## 📋 Benchmarking

### 1. Lighthouse Audit (30 min)

```bash
# Run production build
npm run build
npm run preview

# Run Lighthouse on all pages
npx lighthouse http://localhost:4173/dashboard \
  --output=html \
  --output-path=./reports/lighthouse-dashboard.html \
  --view

npx lighthouse http://localhost:4173/dashboard/events \
  --output=html \
  --output-path=./reports/lighthouse-events.html

# Repeat for all 11 pages
```

**Target Scores (each page):**
- [ ] Performance: > 90
- [ ] Accessibility: > 95
- [ ] Best Practices: > 90
- [ ] SEO: > 85

**Create report:**
```markdown
| Page | Performance | Accessibility | Best Practices | SEO | Status |
|------|-------------|---------------|----------------|-----|--------|
| Dashboard | ___ | ___ | ___ | ___ | ✅/❌ |
| Events | ___ | ___ | ___ | ___ | ✅/❌ |
| Bookings | ___ | ___ | ___ | ___ | ✅/❌ |
| ... all pages
```

---

### 2. Web Vitals Measurement (30 min)

```typescript
// Add web-vitals tracking
// src/main.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  console.log(metric);
  // Send to your analytics
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

**Measure on all pages:**
```bash
# Open each page
# Record metrics
```

**Target Metrics:**
- [ ] LCP (Largest Contentful Paint): < 2.5s
- [ ] FID (First Input Delay): < 100ms
- [ ] CLS (Cumulative Layout Shift): < 0.1
- [ ] FCP (First Contentful Paint): < 1.5s
- [ ] TTFB (Time to First Byte): < 600ms

---

### 3. Bundle Size Analysis (30 min)

```bash
# Analyze bundle
npm run build -- --analyze

# Check sizes
du -sh dist/assets/*

# Target: < 500KB total
```

**Bundle Report:**
```markdown
| Chunk | Size | Gzipped | Status |
|-------|------|---------|--------|
| index | ___KB | ___KB | ✅/❌ |
| vendor | ___KB | ___KB | ✅/❌ |
| dashboard | ___KB | ___KB | ✅/❌ |
| events | ___KB | ___KB | ✅/❌ |

Total: ___KB (Target: < 500KB)
```

**If over limit, optimize:**
- [ ] Tree-shake unused code
- [ ] Lazy load heavy components
- [ ] Use dynamic imports
- [ ] Remove duplicate dependencies

---

### 4. Database Query Performance (30 min)

```typescript
// Measure query times
async function benchmarkQueries() {
  const queries = [
    { name: 'Events', fn: () => supabase.from('events').select('*') },
    { name: 'Orders', fn: () => supabase.from('orders').select('*') },
    { name: 'Dashboard Stats', fn: async () => {
      await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
      ]);
    }},
  ];

  for (const query of queries) {
    const start = performance.now();
    await query.fn();
    const end = performance.now();
    console.log(`${query.name}: ${(end - start).toFixed(2)}ms`);
  }
}
```

**Target Response Times:**
- [ ] Events query: < 500ms
- [ ] Orders query: < 500ms
- [ ] Dashboard stats: < 800ms
- [ ] Analytics query: < 1000ms

---

## 📊 Performance Report Template

```markdown
# Dashboard Performance Benchmark Report
**Date:** ___________________
**Environment:** Production Build

## Lighthouse Scores

| Page | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| Dashboard | ___ | ___ | ___ | ___ |
| [All 11 pages...]

**Average:**
- Performance: ___
- Accessibility: ___
- Best Practices: ___
- SEO: ___

## Web Vitals

| Metric | Dashboard | Events | Bookings | ... | Target | Status |
|--------|-----------|--------|----------|-----|--------|--------|
| LCP | ___s | ___s | ___s | | < 2.5s | ✅/❌ |
| FID | ___ms | ___ms | ___ms | | < 100ms | ✅/❌ |
| CLS | ___ | ___ | ___ | | < 0.1 | ✅/❌ |
| FCP | ___s | ___s | ___s | | < 1.5s | ✅/❌ |
| TTFB | ___ms | ___ms | ___ms | | < 600ms | ✅/❌ |

## Bundle Size

| Chunk | Size | Gzipped | % of Total |
|-------|------|---------|------------|
| index.js | ___KB | ___KB | ___% |
| vendor.js | ___KB | ___KB | ___% |
| ... | | | |
| **Total** | **___KB** | **___KB** | **100%** |

**Status:** ✅ Under 500KB / ❌ Over 500KB

## Query Performance

| Query | Response Time | Target | Status |
|-------|---------------|--------|--------|
| Events | ___ms | < 500ms | ✅/❌ |
| Orders | ___ms | < 500ms | ✅/❌ |
| Stats | ___ms | < 800ms | ✅/❌ |
| Revenue | ___ms | < 1000ms | ✅/❌ |

## Recommendations

### Critical Issues:
-

### Improvements:
-

### Next Steps:
-

## Sign-off

**Benchmarks Run By:** ___________________
**Date:** ___________________
**Production Ready:** YES / NO
```

---

## ✅ Validation

**All targets met:**
- [ ] Lighthouse > 90 on all pages
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Bundle < 500KB
- [ ] Queries < 500ms

**If any targets missed:**
1. Document in report
2. Create optimization tasks
3. Re-test after fixes

---

## 🎯 Next: Task 25 - Production Deployment

**Time Spent:** _____ hours
**Completed:** ___________________
