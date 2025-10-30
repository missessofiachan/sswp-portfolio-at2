# Accessibility (A11y) Guidelines & Implementation

This document outlines the accessibility features and best practices implemented in Sofia's Shop Portfolio application.

## Table of Contents
1. [Overview](#overview)
2. [WCAG Compliance](#wcag-compliance)
3. [Implemented Features](#implemented-features)
4. [Testing Tools](#testing-tools)
5. [Common Patterns](#common-patterns)
6. [Checklist](#checklist)

## Overview

This application follows **WCAG 2.1 Level AA** accessibility guidelines to ensure the application is usable by everyone, including people using assistive technologies.

### Key Principles (POUR)
- **Perceivable**: Information must be presentable in ways users can perceive
- **Operable**: UI components must be operable by all users
- **Understandable**: Information and UI operation must be understandable
- **Robust**: Content must work with current and future assistive technologies

## WCAG Compliance

### Level AA Requirements Met

#### 1. Perceivable
- ✅ **Text Alternatives** (1.1.1): All images have alt text
- ✅ **Color Contrast** (1.4.3): Minimum 4.5:1 contrast ratio for normal text
- ✅ **Resize Text** (1.4.4): Text can be resized up to 200% without loss of functionality
- ✅ **Focus Visible** (2.4.7): Keyboard focus is clearly visible

#### 2. Operable
- ✅ **Keyboard Accessible** (2.1.1): All functionality available via keyboard
- ✅ **No Keyboard Trap** (2.1.2): Keyboard focus can move away from any component
- ✅ **Skip Links** (2.4.1): Skip navigation available (see Navigation.tsx)
- ✅ **Page Titled** (2.4.2): Pages have descriptive titles
- ✅ **Focus Order** (2.4.3): Focus order is logical and meaningful
- ✅ **Link Purpose** (2.4.4): Link text clearly describes purpose

#### 3. Understandable
- ✅ **Language** (3.1.1): Page language is identified (lang="en")
- ✅ **On Focus** (3.2.1): Components don't change context on focus
- ✅ **Labels** (3.3.2): Form fields have clear labels
- ✅ **Error Identification** (3.3.1): Errors are clearly identified
- ✅ **Error Suggestions** (3.3.3): Suggestions provided for input errors

#### 4. Robust
- ✅ **Valid HTML** (4.1.1): HTML is valid and well-formed
- ✅ **Name, Role, Value** (4.1.2): All components have accessible names and roles

## Implemented Features

### 1. Semantic HTML
```tsx
// ✅ Good: Semantic elements
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<main>
  <h1>Page Title</h1>
  <article>...</article>
</main>

// ❌ Bad: Div soup
<div class="nav">
  <div class="link">Home</div>
</div>
```

### 2. ARIA Attributes

#### Live Regions
```tsx
// Toast notifications
<div role="status" aria-live="polite" aria-atomic="true">
  Item added to cart
</div>

// Error messages (more urgent)
<div role="alert" aria-live="assertive">
  Form submission failed
</div>
```

#### Modal Dialogs
```tsx
<div 
  role="dialog" 
  aria-modal="true" 
  aria-labelledby="dialog-title"
>
  <h2 id="dialog-title">Delete Confirmation</h2>
  <p>Are you sure?</p>
</div>
```

#### Form Fields
```tsx
<label htmlFor="email">Email Address</label>
<input 
  id="email" 
  type="email" 
  aria-required="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  Please enter a valid email
</span>
```

### 3. Keyboard Navigation

All interactive elements are keyboard accessible:

- **Tab**: Move forward through interactive elements
- **Shift + Tab**: Move backward
- **Enter/Space**: Activate buttons and links
- **Escape**: Close modals and dropdowns
- **Arrow Keys**: Navigate within menus and lists

### 4. Focus Management

#### Focus Trapping (Modals)
```tsx
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';

function Modal({ isOpen }) {
  const trapRef = useFocusTrap(isOpen);
  
  return (
    <div ref={trapRef} role="dialog" aria-modal="true">
      {/* Modal content */}
    </div>
  );
}
```

#### Focus Restoration
When modals close, focus returns to the element that opened them.

#### Skip Links
```tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

### 5. Screen Reader Announcements

#### Using Live Regions
```tsx
import { useA11yAnnounce } from '@/lib/hooks/useA11yAnnounce';

function ProductList() {
  const announce = useA11yAnnounce();
  
  function handleAddToCart(product) {
    addToCart(product);
    announce(`${product.name} added to cart`, 'polite');
  }
}
```

#### Visually Hidden Content
```tsx
import { VisuallyHidden } from '@/lib/hooks/useA11yAnnounce';

<button onClick={handleEdit}>
  <EditIcon aria-hidden="true" />
  <VisuallyHidden>Edit product</VisuallyHidden>
</button>
```

### 6. Forms Accessibility

#### Label Association
```tsx
// ✅ Good: Explicit label association
<label htmlFor="username">Username</label>
<input id="username" name="username" />

// ✅ Good: Implicit association
<label>
  Username
  <input name="username" />
</label>
```

#### Error Messages
```tsx
<FormField
  label="Email"
  id="email"
  error={errors.email?.message}
  required
>
  <input 
    id="email"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined}
  />
</FormField>
{errors.email && (
  <span id="email-error" role="alert">
    {errors.email.message}
  </span>
)}
```

#### Required Fields
```tsx
<label htmlFor="email">
  Email <abbr title="required" aria-label="required">*</abbr>
</label>
<input 
  id="email" 
  type="email" 
  required 
  aria-required="true"
/>
```

### 7. Color & Contrast

#### Minimum Contrast Ratios
- Normal text: **4.5:1**
- Large text (18pt+): **3:1**
- UI components: **3:1**

#### Don't Rely on Color Alone
```tsx
// ✅ Good: Icon + color
<button className="error">
  <ErrorIcon /> Delete
</button>

// ❌ Bad: Color only
<button className="red-button">Delete</button>
```

### 8. Images & Media

#### Decorative Images
```tsx
<img src="decoration.png" alt="" role="presentation" />
```

#### Informative Images
```tsx
<img src="product.jpg" alt="Blue cotton t-shirt with crew neck" />
```

#### Complex Images (charts, graphs)
```tsx
<img 
  src="sales-chart.png" 
  alt="Sales chart showing 20% increase in Q4" 
  aria-describedby="chart-description"
/>
<div id="chart-description">
  Detailed description of the sales data...
</div>
```

## Testing Tools

### Automated Testing
1. **axe DevTools** (Browser Extension)
   - Scans for WCAG violations
   - Provides fix suggestions

2. **Lighthouse** (Chrome DevTools)
   - Accessibility audit score
   - Best practices recommendations

3. **WAVE** (WebAIM)
   - Visual feedback for accessibility issues

### Manual Testing
1. **Keyboard Navigation**
   - Unplug mouse, navigate entire site with keyboard
   - Ensure all interactive elements are reachable
   - Check focus visibility

2. **Screen Reader Testing**
   - **Windows**: NVDA (free) or JAWS
   - **macOS**: VoiceOver (built-in)
   - **Mobile**: TalkBack (Android), VoiceOver (iOS)

3. **Zoom Testing**
   - Test at 200% zoom
   - Ensure no content is cut off
   - Check text doesn't overflow containers

4. **Color Contrast**
   - Use browser color picker to check contrast ratios
   - Test with color blindness simulators

## Common Patterns

### Loading States
```tsx
// ✅ With aria-busy and screen reader announcement
<div aria-busy={isLoading} aria-live="polite">
  {isLoading ? (
    <div>
      <Spinner aria-hidden="true" />
      <VisuallyHidden>Loading products...</VisuallyHidden>
    </div>
  ) : (
    <ProductList items={products} />
  )}
</div>
```

### Pagination
```tsx
<nav aria-label="Pagination">
  <ul>
    <li>
      <a href="?page=1" aria-label="Go to page 1">1</a>
    </li>
    <li>
      <a href="?page=2" aria-current="page" aria-label="Page 2, current page">2</a>
    </li>
  </ul>
</nav>
```

### Sortable Tables
```tsx
<table>
  <thead>
    <tr>
      <th>
        <button 
          aria-label="Sort by name" 
          aria-pressed={sortBy === 'name'}
        >
          Name
          <SortIcon aria-hidden="true" />
        </button>
      </th>
    </tr>
  </thead>
</table>
```

### Accordions
```tsx
<div>
  <h3>
    <button 
      aria-expanded={isExpanded}
      aria-controls="section-1"
      onClick={toggle}
    >
      Section Title
    </button>
  </h3>
  <div id="section-1" hidden={!isExpanded}>
    Section content
  </div>
</div>
```

## Checklist

Use this checklist when implementing new features:

### General
- [ ] Semantic HTML elements used
- [ ] Page has descriptive `<title>`
- [ ] Main landmark identified (`<main>` or `role="main"`)
- [ ] Skip link provided for keyboard users
- [ ] Language attribute set on `<html>` tag

### Keyboard
- [ ] All interactive elements keyboard accessible
- [ ] Focus order is logical
- [ ] Focus visible for all elements
- [ ] No keyboard traps
- [ ] Escape key closes modals/dropdowns

### Screen Readers
- [ ] Images have appropriate alt text
- [ ] Form inputs have labels
- [ ] Buttons/links have descriptive text
- [ ] ARIA roles used correctly
- [ ] Live regions for dynamic updates

### Forms
- [ ] All inputs have labels
- [ ] Required fields marked with `aria-required`
- [ ] Errors clearly identified
- [ ] Error messages associated with inputs
- [ ] Submit button clearly labeled

### Color & Contrast
- [ ] Sufficient color contrast (4.5:1 minimum)
- [ ] Information not conveyed by color alone
- [ ] Focus indicators visible

### Testing
- [ ] Tested with keyboard only
- [ ] Tested with screen reader
- [ ] Tested at 200% zoom
- [ ] Ran automated accessibility audit (axe/Lighthouse)

## Resources

### Guidelines
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [NVDA Screen Reader](https://www.nvaccess.org/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Learning
- [WebAIM Articles](https://webaim.org/articles/)
- [The A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

**Last Updated**: October 2025  
**Maintained By**: Sofia's Shop Development Team

