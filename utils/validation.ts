import { z } from 'zod';

/**
 * Input sanitization utility to prevent XSS attacks
 * Removes potentially dangerous HTML tags and script content
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');

  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove on* event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Sanitize HTML content for display
 * More aggressive sanitization for rich text content
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';

  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

/**
 * Validate and sanitize email format
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// ============================================
// VALIDATION SCHEMAS
// ============================================

/**
 * Interest level options for the invest form
 */
export const InterestLevel = z.enum([
  'Potential Investor',
  'Founding Member',
  'Technology Partner',
]);

export type InterestLevelType = z.infer<typeof InterestLevel>;

/**
 * Invest form validation schema
 * Validates name, email, interest level, and message fields
 */
export const InvestFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
    .transform(sanitizeInput),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .transform(sanitizeEmail),

  interestLevel: InterestLevel,

  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .transform(sanitizeInput),
});

export type InvestFormData = z.infer<typeof InvestFormSchema>;

/**
 * Chat input validation schema
 * Validates user chat messages with length and content restrictions
 */
export const ChatInputSchema = z
  .string()
  .min(1, 'Message cannot be empty')
  .max(500, 'Message must be less than 500 characters')
  .transform(sanitizeInput)
  .refine(
    (val) => val.trim().length > 0,
    'Message cannot contain only whitespace'
  );

export type ChatInputData = z.infer<typeof ChatInputSchema>;

/**
 * Partial validation for real-time field validation
 * Allows validating individual fields without requiring the entire form
 */
export const InvestFormPartialSchema = {
  name: InvestFormSchema.shape.name,
  email: InvestFormSchema.shape.email,
  interestLevel: InvestFormSchema.shape.interestLevel,
  message: InvestFormSchema.shape.message,
};

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validation result type for better type safety
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Validate invest form data
 * Returns a typed result with sanitized data or error message
 */
export function validateInvestForm(
  data: unknown
): ValidationResult<InvestFormData> {
  try {
    const validated = InvestFormSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return the first error message
      const firstError = error.errors[0];
      return { success: false, error: firstError.message };
    }
    return { success: false, error: 'Validation failed' };
  }
}

/**
 * Validate a single field from the invest form
 * Useful for real-time validation
 */
export function validateInvestFormField(
  field: keyof typeof InvestFormPartialSchema,
  value: unknown
): ValidationResult<unknown> {
  try {
    const schema = InvestFormPartialSchema[field];
    const validated = schema.parse(value);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { success: false, error: firstError.message };
    }
    return { success: false, error: 'Validation failed' };
  }
}

/**
 * Validate chat input
 * Returns a typed result with sanitized data or error message
 */
export function validateChatInput(input: unknown): ValidationResult<string> {
  try {
    const validated = ChatInputSchema.parse(input);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { success: false, error: firstError.message };
    }
    return { success: false, error: 'Validation failed' };
  }
}

/**
 * Check if a string contains potentially malicious content
 */
export function containsMaliciousContent(input: string): boolean {
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<embed/i,
    /<object/i,
    /data:text\/html/i,
  ];

  return maliciousPatterns.some((pattern) => pattern.test(input));
}

/**
 * Rate limiting helper for form submissions
 * Prevents spam by tracking submission timestamps
 */
export class RateLimiter {
  private lastSubmission: number = 0;
  private readonly cooldown: number;

  constructor(cooldownMs: number = 3000) {
    this.cooldown = cooldownMs;
  }

  canSubmit(): boolean {
    const now = Date.now();
    return now - this.lastSubmission >= this.cooldown;
  }

  recordSubmission(): void {
    this.lastSubmission = Date.now();
  }

  getRemainingCooldown(): number {
    const elapsed = Date.now() - this.lastSubmission;
    const remaining = this.cooldown - elapsed;
    return Math.max(0, remaining);
  }
}
