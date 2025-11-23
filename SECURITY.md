# Security Policy

## Overview

This document outlines the security measures implemented in the LawnTech Dynamics web application to protect against common web vulnerabilities and ensure data integrity.

## Table of Contents

- [Input Validation & Sanitization](#input-validation--sanitization)
- [XSS Prevention](#xss-prevention)
- [Rate Limiting](#rate-limiting)
- [Form Security](#form-security)
- [API Security](#api-security)
- [Reporting Security Issues](#reporting-security-issues)
- [Security Best Practices](#security-best-practices)

## Input Validation & Sanitization

### Validation Framework

We use [Zod](https://github.com/colinhacks/zod) for runtime type checking and schema validation. All user inputs are validated before processing.

**Location:** `/utils/validation.ts`

### Validation Schemas

#### 1. Invest Form Validation

The investment inquiry form validates:

- **Name Field**
  - Minimum length: 2 characters
  - Maximum length: 100 characters
  - Allowed characters: Letters, spaces, hyphens, apostrophes
  - Regex pattern: `/^[a-zA-Z\s'-]+$/`

- **Email Field**
  - Format: Valid email address
  - Maximum length: 255 characters
  - Automatically converted to lowercase
  - Trimmed of whitespace

- **Interest Level**
  - Enum validation (Potential Investor, Founding Member, Technology Partner)

- **Message Field**
  - Minimum length: 10 characters
  - Maximum length: 1000 characters
  - HTML tags removed
  - Script content sanitized

#### 2. Chat Input Validation

The AI chat input validates:

- **Message Length**
  - Minimum length: 1 character
  - Maximum length: 500 characters

- **Content Validation**
  - Non-empty after trimming
  - HTML tags removed
  - Script content sanitized

### Sanitization Functions

```typescript
// Remove HTML tags and potentially dangerous content
sanitizeInput(input: string): string

// Sanitize HTML for safe display
sanitizeHTML(html: string): string

// Validate and normalize email addresses
sanitizeEmail(email: string): string

// Check for malicious patterns
containsMaliciousContent(input: string): boolean
```

## XSS Prevention

### Protection Measures

1. **Input Sanitization**
   - All user inputs are sanitized before storage or display
   - HTML tags are stripped from text inputs
   - Script tags and event handlers are removed
   - JavaScript protocol URLs are blocked

2. **Dangerous Pattern Detection**

   The following patterns are detected and blocked:
   - `<script>` tags
   - `javascript:` protocol
   - Event handlers (`onclick`, `onerror`, etc.)
   - `<iframe>`, `<embed>`, `<object>` tags
   - Data URIs with HTML content

3. **React's Built-in XSS Protection**
   - React automatically escapes text content
   - JSX prevents injection attacks by default
   - We never use `dangerouslySetInnerHTML` without sanitization

### Implementation Example

```typescript
// Before submission, all inputs go through sanitization
export function sanitizeInput(input: string): string {
  if (!input) return '';

  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');

  // Remove script tags and content
  sanitized = sanitized.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ''
  );

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  return sanitized.trim();
}
```

## Rate Limiting

### Client-Side Rate Limiting

We implement client-side rate limiting to prevent spam and abuse:

**Location:** `RateLimiter` class in `/utils/validation.ts`

#### Invest Form

- **Cooldown Period:** 3 seconds
- **Mechanism:** Prevents form resubmission before cooldown expires
- **User Feedback:** Displays remaining cooldown time

#### AI Chat

- **Cooldown Period:** 1 second
- **Mechanism:** Prevents rapid-fire message sending
- **User Feedback:** Shows error message with remaining time

### Rate Limiter API

```typescript
const rateLimiter = new RateLimiter(3000); // 3 second cooldown

// Check if submission is allowed
if (rateLimiter.canSubmit()) {
  // Process submission
  rateLimiter.recordSubmission();
} else {
  // Show error with remaining time
  const remaining = rateLimiter.getRemainingCooldown();
}
```

## Form Security

### Invest Form Security Features

1. **Real-Time Validation**
   - Fields are validated as users type
   - Immediate feedback on validation errors
   - Error messages guide users to fix issues

2. **Visual Error Indicators**
   - Red borders on invalid fields
   - Icon indicators for errors
   - Accessible error messages with ARIA attributes

3. **Submit Protection**
   - Button disabled during submission
   - Rate limiting prevents spam
   - Success/error state management

4. **Data Sanitization**
   - All fields sanitized before submission
   - Email addresses normalized
   - HTML tags stripped from text inputs

### AI Chat Security Features

1. **Input Validation**
   - Message length limits enforced
   - Empty messages rejected
   - Malicious content detected and blocked

2. **Error Handling**
   - Graceful API error recovery
   - User-friendly error messages
   - State management prevents corruption

3. **Rate Limiting**
   - Prevents chat spam
   - Protects API from abuse
   - Clear user feedback

## API Security

### Environment Variables

Sensitive configuration is stored in environment variables:

- **API Keys:** Stored in `.env` (not committed to version control)
- **`.env.example`:** Template for required environment variables
- **Validation:** Environment variables validated at runtime

### Best Practices

1. **Never commit `.env` files**
2. **Use environment-specific configurations**
3. **Validate all environment variables on startup**
4. **Rotate API keys regularly**

### Gemini API Integration

- API keys stored securely in environment variables
- Error handling prevents information leakage
- User messages sanitized before sending to API
- API responses validated before display

## Reporting Security Issues

### Vulnerability Disclosure

If you discover a security vulnerability, please follow these steps:

1. **Do Not** create a public GitHub issue
2. Email security concerns to: [Your Security Email]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

### Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial Assessment:** Within 1 week
- **Resolution Plan:** Within 2 weeks
- **Fix Deployment:** As soon as safely possible

## Security Best Practices

### For Developers

1. **Always validate user input**
   - Use Zod schemas for all forms
   - Sanitize before storage and display
   - Never trust client-side validation alone

2. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

3. **Use TypeScript strictly**
   - Enable strict mode in `tsconfig.json`
   - Avoid `any` types
   - Validate external data at runtime

4. **Test security features**
   - Unit tests for validation functions
   - Integration tests for forms
   - Manual testing with malicious inputs

5. **Code Review**
   - Review all PRs for security issues
   - Check for XSS vulnerabilities
   - Verify input validation

### For Users

1. **Use strong, unique passwords** (when authentication is implemented)
2. **Keep browsers updated** for latest security patches
3. **Report suspicious behavior** immediately
4. **Verify you're on the correct domain** before entering information

## Security Checklist

- [x] Input validation with Zod schemas
- [x] XSS prevention through sanitization
- [x] Rate limiting on forms and chat
- [x] Environment variable protection
- [x] Error handling without information leakage
- [x] ARIA attributes for accessibility
- [x] TypeScript strict mode
- [x] Dependency security audits
- [ ] HTTPS enforcement (production)
- [ ] Content Security Policy headers (production)
- [ ] CSRF protection (when backend is added)
- [ ] Authentication & Authorization (future feature)

## Validation Examples

### Testing Form Validation

```typescript
// Valid submission
const validData = {
  name: "John Doe",
  email: "john@example.com",
  interestLevel: "Potential Investor",
  message: "I'm interested in learning more about the facility."
};

// This will pass validation
const result = validateInvestForm(validData);
// result.success === true

// Invalid submission (XSS attempt)
const maliciousData = {
  name: "<script>alert('xss')</script>",
  email: "test@test.com",
  interestLevel: "Potential Investor",
  message: "Normal message"
};

// This will fail validation and sanitize the name
const result2 = validateInvestForm(maliciousData);
// result2.success === false
// Error: "Name can only contain letters, spaces, hyphens, and apostrophes"
```

### Testing Chat Validation

```typescript
// Valid message
const validMessage = "What features does the facility have?";
const result = validateChatInput(validMessage);
// result.success === true
// result.data === sanitized message

// Invalid message (too long)
const tooLongMessage = "a".repeat(501);
const result2 = validateChatInput(tooLongMessage);
// result2.success === false
// result2.error === "Message must be less than 500 characters"

// Invalid message (XSS attempt)
const xssMessage = "<img src=x onerror=alert('xss')>";
const result3 = validateChatInput(xssMessage);
// result3.success === true (passes validation)
// result3.data === "" (sanitized to empty, which then fails validation)
```

## Security Updates

### Version History

- **v1.0.0** (Current)
  - Initial security implementation
  - Zod validation for all forms
  - XSS prevention measures
  - Rate limiting
  - Input sanitization

### Planned Security Enhancements

- [ ] Server-side validation (when backend is implemented)
- [ ] CSRF token protection
- [ ] Content Security Policy (CSP) headers
- [ ] Subresource Integrity (SRI) for CDN resources
- [ ] Security headers (HSTS, X-Frame-Options, etc.)
- [ ] Regular security audits
- [ ] Automated vulnerability scanning in CI/CD

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Zod Documentation](https://zod.dev/)
- [React Security Best Practices](https://react.dev/learn/writing-markup-with-jsx#xss)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## Contact

For security-related questions or concerns, contact: [Your Contact Information]

---

**Last Updated:** 2025-11-23
**Version:** 1.0.0
