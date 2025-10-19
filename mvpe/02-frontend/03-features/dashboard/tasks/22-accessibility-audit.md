# Task 22: Week 4 - Accessibility Audit (WCAG 2.1 AA)
**Phase:** Week 4
**Priority:** 🔴 CRITICAL
**Time:** 4 hours
**Status:** 🔴 NOT STARTED
**Dependencies:** Task 21

---

## 🎯 Objective

Ensure dashboard meets WCAG 2.1 Level AA accessibility standards.

---

## ✅ Success Criteria

- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets standards
- [ ] Forms properly labeled
- [ ] ARIA attributes correct
- [ ] Focus management working

---

## 📋 Implementation

### 1. Run Automated Accessibility Tests (1 hour)

```bash
# Install tools
npm install -D axe-core @axe-core/react
npm install -D eslint-plugin-jsx-a11y

# Add to .eslintrc
{
  "extends": ["plugin:jsx-a11y/recommended"],
  "plugins": ["jsx-a11y"]
}

# Run tests
npm run lint
```

**Fix all automated issues:**
- [ ] Missing alt text on images
- [ ] Missing form labels
- [ ] Insufficient color contrast
- [ ] Missing ARIA attributes
- [ ] Keyboard trap issues

---

### 2. Test Keyboard Navigation (1 hour)

**Test on each page (Tab, Shift+Tab, Enter, Space, Esc):**

```markdown
| Page | Tab Order | Focus Visible | Enter Works | Esc Works | Status |
|------|-----------|---------------|-------------|-----------|--------|
| Dashboard | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| Events | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| Bookings | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| Settings | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| ... all pages
```

**Fix keyboard issues:**
```typescript
// Add focus management
const firstInputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  if (dialogOpen) {
    firstInputRef.current?.focus();
  }
}, [dialogOpen]);

// Add keyboard handlers
onKeyDown={(e) => {
  if (e.key === 'Escape') {
    onClose();
  }
}}
```

---

### 3. Test Screen Reader (1 hour)

**Test with screen reader (NVDA/JAWS/VoiceOver):**

- [ ] Page titles announced
- [ ] Headings properly structured (h1 → h2 → h3)
- [ ] Links have descriptive text
- [ ] Buttons have clear labels
- [ ] Form fields have labels
- [ ] Error messages announced
- [ ] Loading states announced
- [ ] Dynamic content changes announced

**Fix screen reader issues:**
```typescript
// Add ARIA labels
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>

// Add ARIA live regions
<div role="status" aria-live="polite" aria-atomic="true">
  {isLoading && <span className="sr-only">Loading events...</span>}
</div>

// Add skip links
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

---

### 4. Check Color Contrast (30 min)

```bash
# Use browser DevTools or online tools
# Check all text against backgrounds
# Target: 4.5:1 for normal text, 3:1 for large text
```

- [ ] Body text contrast ≥ 4.5:1
- [ ] Large text contrast ≥ 3:1
- [ ] Button text contrast ≥ 4.5:1
- [ ] Link text contrast ≥ 4.5:1
- [ ] Placeholder text contrast ≥ 4.5:1

**Fix contrast issues:**
```typescript
// Adjust colors in theme
colors: {
  primary: {
    DEFAULT: 'hsl(280 65% 60%)', // Ensure good contrast
  },
  muted: {
    foreground: 'hsl(240 5% 40%)', // Darken for better contrast
  },
}
```

---

### 5. Audit Forms (30 min)

**Check all forms:**
- [ ] Labels associated with inputs
- [ ] Required fields marked
- [ ] Error messages descriptive
- [ ] Success messages announced
- [ ] Validation clear

```typescript
// Proper form labels
<label htmlFor="email">Email Address</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
{errors.email && (
  <span id="email-error" role="alert">
    {errors.email}
  </span>
)}
```

---

## ✅ Testing Checklist

### WCAG 2.1 AA Requirements

**Perceivable:**
- [ ] 1.1.1 Non-text Content (Alt text)
- [ ] 1.3.1 Info and Relationships (Semantic HTML)
- [ ] 1.4.3 Contrast (Minimum 4.5:1)
- [ ] 1.4.11 Non-text Contrast (UI components 3:1)

**Operable:**
- [ ] 2.1.1 Keyboard (All functionality keyboard accessible)
- [ ] 2.1.2 No Keyboard Trap
- [ ] 2.4.3 Focus Order (Logical tab order)
- [ ] 2.4.7 Focus Visible

**Understandable:**
- [ ] 3.2.1 On Focus (No unexpected changes)
- [ ] 3.2.2 On Input (Predictable)
- [ ] 3.3.1 Error Identification
- [ ] 3.3.2 Labels or Instructions

**Robust:**
- [ ] 4.1.2 Name, Role, Value (ARIA)
- [ ] 4.1.3 Status Messages

---

## 🎯 Next: Task 23 - E2E Testing

**Time Spent:** _____ hours
**Completed:** ___________________
