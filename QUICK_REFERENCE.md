# Quick Reference Guide - New Features

Quick reference for developers using the new features and components added to Sofia's Shop Portfolio.

## 📚 Table of Contents
- [Backend Features](#backend-features)
- [Frontend Components](#frontend-components)
- [Hooks](#hooks)
- [Testing](#testing)
- [Accessibility](#accessibility)

---

## Backend Features

### Rate Limiting

```typescript
import { rateLimit, authRateLimit, expensiveOperationRateLimit } from './api/middleware/rateLimit';

// Use predefined limits
router.post('/login', authRateLimit, loginHandler);
router.post('/upload', expensiveOperationRateLimit, uploadHandler);

// Custom rate limit
router.post('/custom', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests',
}), handler);
```

### Email Service

```typescript
import { emailService } from './services/email.service';

// Send password reset email
await emailService.sendPasswordReset(user.email, resetUrl);

// Send order confirmation
await emailService.sendOrderConfirmation(order);
```

### Token Revocation

```typescript
import { tokenRevocationService } from './services/tokenRevocation.service';

// Revoke all tokens for a user
await tokenRevocationService.revokeAllTokens(userId, 'password_change');

// Check if token is revoked
const isRevoked = await tokenRevocationService.isTokenRevoked(userId, tokenIssuedAt);
```

### Security Logging

```typescript
import { logAuthFailure, logSuspiciousActivity } from './utils/securityLogger';

// Log authentication failure
logAuthFailure({
  email: 'user@example.com',
  reason: 'invalid_credentials',
  ip: req.ip,
  correlationId: getCorrelationId(req),
});

// Log suspicious activity
logSuspiciousActivity({
  type: 'rate_limit_hit',
  userId: user.id,
  path: req.path,
  ip: req.ip,
});
```

### File Validation

```typescript
import { validateImageContent, sanitizeFilename, validateFileSize } from './utils/fileValidation';

// Validate file size
if (!validateFileSize(file.size, 5)) {
  throw new Error('File too large');
}

// Validate image content (magic numbers)
const buffer = Buffer.from(file.data);
if (!validateImageContent(buffer)) {
  throw new Error('Invalid image file');
}

// Sanitize filename
const safeFilename = sanitizeFilename(file.name);
```

---

## Frontend Components

### Modal

```tsx
import { Modal } from '@/components/ui/Modal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Confirmation"
      size="medium"
      footer={
        <>
          <button onClick={() => setIsOpen(false)}>Cancel</button>
          <button onClick={handleConfirm}>Confirm</button>
        </>
      }
    >
      <p>Are you sure you want to continue?</p>
    </Modal>
  );
}
```

### ImageUploader

```tsx
import { ImageUploader } from '@/components/ui/ImageUploader';

function ProductForm() {
  const handleUpload = async (files: File[]) => {
    const urls = await uploadImages(files);
    setImageUrls(urls);
  };

  return (
    <ImageUploader
      onUpload={handleUpload}
      maxFiles={5}
      maxSizeMB={5}
      accept="image/*"
    />
  );
}
```

### Skeleton Loaders

```tsx
import { ProductSkeleton, TextSkeleton, CardSkeleton } from '@/components/ui/Skeleton';

function ProductList() {
  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return <div>{/* Products */}</div>;
}
```

### Virtual List

```tsx
import { VirtualList } from '@/components/ui/VirtualList';

function LargeProductList({ products }) {
  return (
    <VirtualList
      items={products}
      itemHeight={200}
      containerHeight={600}
      renderItem={(product) => <ProductCard product={product} />}
    />
  );
}
```

### Form Components

```tsx
import { FormField, FormTextarea, FormActions } from '@/components/forms';

function MyForm() {
  const { register, formState: { errors } } = useForm();

  return (
    <form>
      <FormField
        label="Email"
        id="email"
        error={errors.email?.message}
        required
      >
        <input {...register('email')} />
      </FormField>

      <FormTextarea
        label="Description"
        id="description"
        error={errors.description?.message}
      >
        <textarea {...register('description')} />
      </FormTextarea>

      <FormActions>
        <button type="button">Cancel</button>
        <button type="submit">Save</button>
      </FormActions>
    </form>
  );
}
```

### Error Boundaries

```tsx
import { FeatureErrorBoundary } from '@/components/errors/FeatureErrorBoundary';

function App() {
  return (
    <FeatureErrorBoundary
      fallback={<div>Something went wrong in this section</div>}
      onError={(error) => console.error(error)}
    >
      <FeatureComponent />
    </FeatureErrorBoundary>
  );
}
```

---

## Hooks

### useDebounce

```tsx
import { useDebounce } from '@/lib/hooks/useDebounce';

function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### useA11yAnnounce

```tsx
import { useA11yAnnounce } from '@/lib/hooks/useA11yAnnounce';

function ShoppingCart() {
  const announce = useA11yAnnounce();

  const handleAddToCart = (product) => {
    addToCart(product);
    announce(`${product.name} added to cart`, 'polite');
  };

  return <button onClick={() => handleAddToCart(product)}>Add to Cart</button>;
}
```

### useFocusTrap

```tsx
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';

function CustomModal({ isOpen, onClose }) {
  const trapRef = useFocusTrap<HTMLDivElement>(isOpen);

  if (!isOpen) return null;

  return (
    <div ref={trapRef} role="dialog" aria-modal="true">
      <h2>Modal Title</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

### useKeyboardNav

```tsx
import { useKeyboardNav } from '@/lib/hooks/useKeyboardNav';

function Dropdown() {
  const navRef = useKeyboardNav({
    orientation: 'vertical',
    loop: true,
    onSelect: (index) => handleSelect(index),
  });

  return (
    <ul ref={navRef} role="menu">
      {items.map((item, i) => (
        <li key={i} role="menuitem" tabIndex={i === 0 ? 0 : -1}>
          {item}
        </li>
      ))}
    </ul>
  );
}
```

---

## Testing

### Backend Unit Tests

```typescript
// server/tests/unit/myService.test.ts
import { describe, it, expect } from '@jest/globals';
import { myService } from '../../src/services/myService';

describe('MyService', () => {
  it('should process data correctly', () => {
    const result = myService.process({ foo: 'bar' });
    expect(result).toEqual({ processed: true });
  });
});
```

### Backend Integration Tests

```typescript
// server/tests/integration/api.test.ts
import request from 'supertest';
import { app } from '../../src/app';

describe('POST /api/v1/resource', () => {
  it('should create resource', async () => {
    const response = await request(app)
      .post('/api/v1/resource')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
  });
});
```

### Frontend Component Tests

```tsx
// client/tests/components/MyComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MyComponent } from '../../src/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle click', () => {
    const onClick = vi.fn();
    render(<MyComponent onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Frontend Hook Tests

```tsx
// client/tests/hooks/useMyHook.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMyHook } from '../../src/lib/hooks/useMyHook';

describe('useMyHook', () => {
  it('should update value', () => {
    const { result } = renderHook(() => useMyHook());
    
    act(() => {
      result.current.setValue('new value');
    });
    
    expect(result.current.value).toBe('new value');
  });
});
```

---

## Accessibility

### ARIA Attributes

```tsx
// Dialog
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Dialog Title</h2>
</div>

// Live Region
<div role="status" aria-live="polite" aria-atomic="true">
  Loading...
</div>

// Form Field
<label htmlFor="email">Email</label>
<input 
  id="email" 
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="email-error"
/>
```

### Keyboard Navigation

```tsx
// Handle Escape key
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };
  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [onClose]);

// Tab navigation with roving tabindex
<ul role="menu">
  {items.map((item, i) => (
    <li role="menuitem" tabIndex={i === activeIndex ? 0 : -1}>
      {item}
    </li>
  ))}
</ul>
```

### Visually Hidden Content

```tsx
import { VisuallyHidden } from '@/lib/hooks/useA11yAnnounce';

<button>
  <EditIcon aria-hidden="true" />
  <VisuallyHidden>Edit product</VisuallyHidden>
</button>
```

---

## Environment Variables

### Backend

```bash
# Email Service
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourapp.com

# Error Monitoring
SENTRY_DSN=https://your-sentry-dsn

# CORS (Production)
CORS_ORIGIN=https://yourapp.com,https://www.yourapp.com

# File Uploads
UPLOAD_MAX_MB=5
```

### Frontend

```bash
# API Base URL
VITE_API_BASE_URL=http://localhost:3001

# Sentry (Optional)
VITE_SENTRY_DSN=https://your-sentry-dsn
```

---

## Common Patterns

### Error Handling

```tsx
try {
  await riskyOperation();
} catch (error) {
  // Log to monitoring
  monitoring.captureException(error, {
    userId: user?.id,
    correlationId: getCorrelationId(req),
  });
  
  // Log security event if needed
  logSuspiciousActivity({
    type: 'unauthorized_access',
    userId: user?.id,
    path: req.path,
  });
  
  // Return user-friendly error
  res.status(500).json({
    error: { message: 'Something went wrong' }
  });
}
```

### Async State Management

```tsx
const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
const [data, setData] = useState(null);
const [error, setError] = useState(null);

useEffect(() => {
  setStatus('loading');
  fetchData()
    .then((result) => {
      setData(result);
      setStatus('success');
    })
    .catch((err) => {
      setError(err);
      setStatus('error');
    });
}, []);

if (status === 'loading') return <Skeleton />;
if (status === 'error') return <ErrorMessage error={error} />;
return <DataDisplay data={data} />;
```

---

## Performance Tips

1. **Use Virtual Lists** for lists with 100+ items
2. **Debounce** search inputs with 300ms delay
3. **Lazy Load** routes with React.lazy()
4. **Memoize** expensive computations with useMemo
5. **Optimize Images** with proper formats and sizes
6. **Code Split** large dependencies

## Security Checklist

- [ ] Set CORS_ORIGIN in production
- [ ] Configure rate limits appropriately
- [ ] Enable HTTPS in production
- [ ] Validate all file uploads
- [ ] Use environment variables for secrets
- [ ] Enable Sentry error monitoring
- [ ] Review security logs weekly
- [ ] Test authentication flows

---

**For more details, see:**
- [TESTING.md](./TESTING.md) - Comprehensive testing guide
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) - Accessibility guidelines
- [DEPLOYMENT.md](./server/DEPLOYMENT.md) - Deployment checklist

