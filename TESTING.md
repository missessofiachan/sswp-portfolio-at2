# Testing Guide

This document outlines the testing strategy and practices for Sofia's Shop Portfolio application.

## Table of Contents
1. [Testing Philosophy](#testing-philosophy)
2. [Test Structure](#test-structure)
3. [Running Tests](#running-tests)
4. [Backend Testing](#backend-testing)
5. [Frontend Testing](#frontend-testing)
6. [Coverage Requirements](#coverage-requirements)
7. [Best Practices](#best-practices)

## Testing Philosophy

We follow the **Testing Trophy** approach:
- **Static Analysis** (TypeScript, ESLint): Catch errors at compile time
- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test how multiple units work together
- **End-to-End Tests**: Test complete user workflows (limited, focused on critical paths)

### Test Coverage Goals
- **Unit Tests**: 80%+ coverage for utilities and pure functions
- **Integration Tests**: Cover all critical API endpoints
- **E2E Tests**: Cover essential user journeys (auth, checkout, etc.)

## Test Structure

```
server/
├── tests/
│   ├── unit/           # Unit tests for utilities, services
│   ├── integration/    # API endpoint tests
│   └── setup.ts        # Test configuration
client/
├── tests/
│   ├── components/     # React component tests
│   ├── hooks/          # Custom hook tests
│   ├── utils/          # Utility function tests
│   └── setup.ts        # Test configuration
```

## Running Tests

### Backend (Jest)

```bash
# Run all tests
cd server && npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- fileValidation.test.ts

# Run integration tests only
npm test -- --testPathPattern=integration
```

### Frontend (Vitest)

```bash
# Run all tests
cd client && npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- Modal.test.tsx

# Run tests with UI
npm run test:ui
```

## Backend Testing

### Unit Tests

Test individual functions, utilities, and services in isolation.

**Example: File Validation Tests**

```typescript
// server/tests/unit/fileValidation.test.ts
import { validateFileSize, validateImageContent } from '../../src/utils/fileValidation';

describe('validateFileSize', () => {
  it('should accept files within size limit', () => {
    expect(validateFileSize(2 * 1024 * 1024, 5)).toBe(true);
  });

  it('should reject files exceeding limit', () => {
    expect(validateFileSize(10 * 1024 * 1024, 5)).toBe(false);
  });
});
```

### Integration Tests

Test API endpoints with real HTTP requests.

**Example: Authentication Tests**

```typescript
// server/tests/integration/auth.test.ts
import request from 'supertest';
import { app } from '../../src/app';

describe('POST /api/v1/auth/login', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });

  it('should reject invalid credentials', async () => {
    await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' })
      .expect(401);
  });
});
```

### Mocking External Services

Use mocks for external dependencies (Firestore, SendGrid, Cloudinary).

```typescript
// Mock Firestore
jest.mock('../../src/config/firebase', () => ({
  getDb: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ exists: true, data: () => ({}) })),
        set: jest.fn(() => Promise.resolve()),
      })),
    })),
  })),
}));

// Mock SendGrid
jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn(() => Promise.resolve()),
}));
```

### Testing Middleware

```typescript
describe('requireAuth middleware', () => {
  it('should allow authenticated requests', async () => {
    const token = generateTestToken({ id: 'user-123', role: 'user' });
    
    await request(app)
      .get('/api/v1/protected-route')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('should reject requests without token', async () => {
    await request(app)
      .get('/api/v1/protected-route')
      .expect(401);
  });
});
```

## Frontend Testing

### Component Tests

Test React components with user interactions.

**Example: Modal Component**

```typescript
// client/tests/components/Modal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../../src/components/ui/Modal';

describe('Modal', () => {
  const mockOnClose = vi.fn();

  it('should render when open', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        <p>Content</p>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should call onClose when escape is pressed', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test">
        <p>Content</p>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });
});
```

### Hook Tests

Test custom React hooks.

**Example: useDebounce Hook**

```typescript
// client/tests/hooks/useDebounce.test.ts
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../../src/lib/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.restoreAllMocks());

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');

    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toBe('updated');
  });
});
```

### Testing with Context/Providers

Wrap components with necessary providers.

```typescript
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/contexts/AuthContext';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  );
}

describe('Protected Component', () => {
  it('should redirect when not authenticated', () => {
    renderWithProviders(<ProtectedPage />);
    expect(screen.getByText('Please log in')).toBeInTheDocument();
  });
});
```

### Testing Async Data Fetching

```typescript
import { waitFor } from '@testing-library/react';

describe('ProductList', () => {
  it('should load and display products', async () => {
    // Mock API call
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ products: [{ id: '1', name: 'Test' }] }),
      })
    );

    render(<ProductList />);

    // Initially shows loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  it('should handle errors gracefully', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

### Accessibility Testing

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<MyComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Coverage Requirements

### What to Test

**✅ High Priority**
- Business logic and utilities
- Authentication and authorization
- Data validation and sanitization
- Critical user flows (checkout, payment)
- Security-related code
- Error handling

**⚠️ Medium Priority**
- UI components with complex interactions
- Custom hooks
- State management
- Form validation

**❌ Low Priority / Skip**
- Simple presentational components
- Third-party library wrappers
- Configuration files
- Type definitions

### Coverage Thresholds

Configure in `jest.config.js` (backend) or `vitest.config.ts` (frontend):

```javascript
module.exports = {
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
    // Stricter for critical modules
    './src/services/auth.service.ts': {
      statements: 95,
      branches: 90,
      functions: 95,
      lines: 95,
    },
  },
};
```

## Best Practices

### 1. Write Testable Code

**❌ Bad: Hard to test**
```typescript
function processUser() {
  const db = getDb();
  const user = db.collection('users').doc('123').get();
  // ... complex logic ...
}
```

**✅ Good: Testable with dependency injection**
```typescript
function processUser(userId: string, db: FirebaseFirestore.Firestore) {
  const user = db.collection('users').doc(userId).get();
  // ... complex logic ...
}
```

### 2. Follow AAA Pattern

```typescript
it('should calculate total price correctly', () => {
  // Arrange
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 1 },
  ];

  // Act
  const total = calculateTotal(items);

  // Assert
  expect(total).toBe(25);
});
```

### 3. Use Descriptive Test Names

```typescript
// ❌ Bad
it('works', () => { ... });

// ✅ Good
it('should calculate discount correctly for premium members', () => { ... });
```

### 4. One Assertion Per Test (When Reasonable)

```typescript
// ✅ Good: Single logical assertion
it('should return user with correct properties', () => {
  const user = createUser({ email: 'test@example.com', name: 'Test' });
  expect(user).toEqual({
    email: 'test@example.com',
    name: 'Test',
    role: 'user',
  });
});
```

### 5. Test Edge Cases

```typescript
describe('validateAge', () => {
  it('should accept valid ages', () => {
    expect(validateAge(25)).toBe(true);
  });

  it('should reject negative ages', () => {
    expect(validateAge(-5)).toBe(false);
  });

  it('should reject age 0', () => {
    expect(validateAge(0)).toBe(false);
  });

  it('should reject ages over 150', () => {
    expect(validateAge(200)).toBe(false);
  });

  it('should handle decimal ages', () => {
    expect(validateAge(25.5)).toBe(true);
  });
});
```

### 6. Clean Up After Tests

```typescript
describe('Database operations', () => {
  let testUser: User;

  beforeEach(async () => {
    testUser = await createTestUser();
  });

  afterEach(async () => {
    await deleteTestUser(testUser.id);
  });

  it('should update user', async () => {
    // Test using testUser
  });
});
```

### 7. Don't Test Implementation Details

```typescript
// ❌ Bad: Testing internal state
it('should set isLoading to true', () => {
  const { result } = renderHook(() => useProducts());
  expect(result.current.isLoading).toBe(true);
});

// ✅ Good: Testing behavior
it('should show loading spinner while fetching', () => {
  render(<ProductList />);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});
```

## Continuous Integration

Tests run automatically on every commit via GitHub Actions.

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

## Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Vitest Documentation](https://vitest.dev/guide/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Tools
- **Jest**: Backend test runner
- **Vitest**: Frontend test runner (faster, Vite-native)
- **Supertest**: HTTP assertions for API tests
- **React Testing Library**: React component testing
- **jest-axe**: Accessibility testing

---

**Last Updated**: October 2025  
**Maintained By**: Sofia's Shop Development Team

