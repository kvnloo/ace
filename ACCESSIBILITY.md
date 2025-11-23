# Accessibility Guide

## Overview

LawnTech Dynamics is committed to providing an accessible experience for all users. This document outlines the accessibility features implemented in our application and provides guidelines for maintaining and improving accessibility.

## WCAG 2.1 Compliance

Our application strives to meet **WCAG 2.1 Level AA** standards for accessibility. Key areas of compliance include:

- **Perceivable**: Content is presented in ways all users can perceive
- **Operable**: All functionality is accessible via keyboard
- **Understandable**: Information and operation of the interface are clear
- **Robust**: Content works with current and future assistive technologies

## Keyboard Navigation

### Overview

All interactive elements in the application are fully keyboard accessible. Users can navigate the entire site without a mouse using standard keyboard controls.

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Move focus to next interactive element |
| `Shift + Tab` | Move focus to previous interactive element |
| `Enter` / `Space` | Activate buttons and links |
| `Escape` | Close modals and menus |
| `Arrow Keys` | Navigate within 3D scene (when focused) |

### Skip to Content Link

A "Skip to main content" link appears at the top of the page when using keyboard navigation. Press `Tab` from the page load to activate it and jump directly to the main content, bypassing navigation.

**Location**: First focusable element on the page
**Implementation**: `/home/user/ace/App.tsx` (lines 53-56)

### Focus Management

#### Visible Focus Indicators

All interactive elements display a **bright yellow outline** (`#DFFF4F`) when focused via keyboard. This ensures users always know where they are on the page.

**Styling**:
- Standard elements: 3px solid outline with 3px offset
- Buttons/links: 3px outline with 6px shadow glow
- Form inputs: 2px outline with 2px offset

**Implementation**: `/home/user/ace/index.html` (lines 249-276)

#### Focus Trapping in Modals

The AI Chat modal implements focus trapping to ensure keyboard users cannot tab out of the modal while it's open.

**Features**:
- Focus automatically moves to input field when modal opens
- Tab cycling stays within modal boundaries
- Escape key closes modal and returns focus to trigger button
- Focus returns to trigger button when modal closes

**Implementation**:
- Utility: `/home/user/ace/utils/focusTrap.ts`
- Usage: `/home/user/ace/components/AIChat.tsx`

### Tab Order

Tab order follows a logical, left-to-right, top-to-bottom flow:

1. Skip to content link
2. Logo/home button
3. Navigation menu items (Vision, Specs, 3D Map, Amenities, Invest)
4. Join Waiting List button
5. Main content interactive elements
6. AI Chat button

On mobile, the hamburger menu button becomes part of the tab order, and the mobile menu can be closed with the Escape key.

## Screen Reader Support

### ARIA Labels

All interactive elements have descriptive ARIA labels:

#### Navigation
```tsx
<nav role="navigation" aria-label="Main navigation">
  <button aria-label="Navigate to Vision page" aria-current="page">Vision</button>
</nav>
```

#### Buttons
```tsx
<button aria-label="Explore interactive 3D facility demo">
  Explore 3D Demo
</button>
```

#### Forms
```tsx
<form aria-label="Investment inquiry form">
  <label htmlFor="email">Email Address</label>
  <input id="email" aria-required="true" />
</form>
```

### ARIA Roles

- `role="navigation"` - Main navigation bar
- `role="main"` - Main content area
- `role="dialog"` - AI Chat modal
- `role="log"` - Chat message container
- `role="status"` - Loading indicators
- `role="article"` - Individual content sections

### Live Regions

The AI Chat uses `aria-live="polite"` to announce new messages to screen reader users without interrupting their current task.

```tsx
<div role="log" aria-live="polite" aria-atomic="false">
  {/* Chat messages */}
</div>
```

## Form Accessibility

### Labels and IDs

All form inputs have associated `<label>` elements with proper `htmlFor` attributes:

```tsx
<label htmlFor="full-name">Full Name</label>
<input id="full-name" type="text" aria-required="true" />
```

### Required Fields

Required fields are marked with `aria-required="true"` to inform screen reader users.

### Error Handling

Form validation errors are announced to screen readers and displayed visually. Error messages are associated with their inputs using `aria-describedby`.

## Color and Contrast

### Color Contrast Ratios

All text meets WCAG AA contrast requirements:

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio

### Primary Colors

- **Tennis Yellow** (`#DFFF4F`): Used for focus indicators and accents
- **Tennis Green** (`#2C5F2D`): Used for secondary accents
- **Dark Background** (`#0f172a`): Primary background
- **White Text** (`#ffffff`): Primary text color

### No Color-Only Information

We never rely on color alone to convey information. All color-coded elements also have:
- Text labels
- Icons
- Patterns or textures

## Responsive Design

The application is fully responsive and accessible on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

Touch targets on mobile are minimum **44x44px** to meet WCAG AA standards.

## Component-Specific Accessibility

### NavBar Component

**File**: `/home/user/ace/components/NavBar.tsx`

**Features**:
- All navigation items are keyboard accessible
- Current page is indicated with `aria-current="page"`
- Mobile menu can be opened/closed with keyboard
- Escape key closes mobile menu
- Descriptive ARIA labels for all actions

**Keyboard Shortcuts**:
- `Tab`: Navigate through menu items
- `Enter`: Activate menu item
- `Escape`: Close mobile menu (mobile only)

### AIChat Component

**File**: `/home/user/ace/components/AIChat.tsx`

**Features**:
- Modal dialog with `role="dialog"` and `aria-modal="true"`
- Focus trapped within modal when open
- Input field auto-focused on open
- Chat messages announced to screen readers via `aria-live`
- Loading states clearly indicated
- Form input with proper labels

**Keyboard Shortcuts**:
- `Tab`: Navigate between input and send button
- `Enter`: Send message
- `Escape`: Close chat modal

### ThreeScene Component

**File**: `/home/user/ace/components/ThreeScene.tsx`

**Features**:
- 3D scene is marked as decorative with `aria-hidden="true"` where appropriate
- Interactive elements within the scene are keyboard accessible
- Feature selection can be navigated with keyboard

### Forms (Invest View)

**Features**:
- All inputs have associated labels
- Required fields marked with `aria-required`
- Submit button clearly labeled
- Form has descriptive `aria-label`

## Testing Accessibility

### Manual Testing

#### Keyboard Navigation Test
1. Load the page
2. Press `Tab` - should focus "Skip to content" link
3. Press `Tab` repeatedly - should cycle through all interactive elements in logical order
4. Press `Shift + Tab` - should reverse through elements
5. Press `Enter` on various buttons - should activate them
6. Open AI Chat - press `Escape` - should close modal
7. Open mobile menu - press `Escape` - should close menu

#### Screen Reader Test
Test with:
- **NVDA** (Windows) - Free and open source
- **JAWS** (Windows) - Industry standard
- **VoiceOver** (macOS/iOS) - Built-in
- **TalkBack** (Android) - Built-in

Verify:
- All interactive elements are announced
- Images have alt text or are marked decorative
- Form labels are read correctly
- Live regions announce updates
- Navigation structure is clear

### Automated Testing

Run automated accessibility tests:

```bash
# Install dependencies
npm install --save-dev @axe-core/playwright

# Run accessibility tests
npm run test:accessibility
```

### Browser Extensions

Recommended tools for manual testing:
- **axe DevTools** - Comprehensive accessibility scanner
- **WAVE** - Web Accessibility Evaluation Tool
- **Lighthouse** - Built into Chrome DevTools

## Known Issues and Roadmap

### Current Limitations

1. **3D Scene Navigation**: The Three.js 3D scene has limited keyboard navigation. We're exploring solutions for better keyboard control of the 3D camera.

2. **Animation Preferences**: We don't currently respect `prefers-reduced-motion`. This is planned for a future update.

### Future Improvements

- [ ] Add keyboard controls for 3D scene camera
- [ ] Respect `prefers-reduced-motion` system preference
- [ ] Add high contrast mode
- [ ] Implement more keyboard shortcuts for power users
- [ ] Add voice control support
- [ ] Improve mobile screen reader experience

## Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [React Accessibility](https://react.dev/learn/accessibility)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [NVDA Screen Reader](https://www.nvaccess.org/download/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Standards
- [Section 508](https://www.section508.gov/)
- [ADA Compliance](https://www.ada.gov/)
- [EN 301 549](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf)

## Reporting Accessibility Issues

If you encounter any accessibility barriers while using our application, please contact us:

**Email**: accessibility@lawntech-dynamics.com
**Subject**: Accessibility Issue Report

Please include:
- Description of the issue
- Steps to reproduce
- Assistive technology being used (if applicable)
- Browser and operating system
- Screenshots or recordings (if helpful)

We're committed to addressing accessibility issues promptly and improving the experience for all users.

## Maintenance Guidelines

### For Developers

When adding new features or components:

1. **Keyboard Accessibility**
   - Ensure all interactive elements can be reached via Tab
   - Implement proper focus management
   - Test with keyboard only (no mouse)

2. **ARIA Attributes**
   - Add `aria-label` for icon-only buttons
   - Use `aria-current` for navigation states
   - Implement `aria-live` for dynamic content
   - Add `role` attributes for semantic clarity

3. **Forms**
   - Associate labels with inputs using `htmlFor` and `id`
   - Mark required fields with `aria-required`
   - Provide error messages with `aria-describedby`

4. **Color Contrast**
   - Test all text against backgrounds
   - Ensure 4.5:1 minimum for normal text
   - Don't rely on color alone

5. **Testing**
   - Run automated tests before committing
   - Test with keyboard
   - Test with screen reader
   - Verify in DevTools Lighthouse

### Code Review Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] ARIA labels are descriptive
- [ ] Form inputs have associated labels
- [ ] Color contrast meets requirements
- [ ] No information conveyed by color alone
- [ ] Screen reader testing completed
- [ ] Automated tests pass

---

**Last Updated**: 2025-11-23
**Version**: 1.0.0
**Maintained by**: LawnTech Dynamics Development Team
