/**
 * SkipLink Component
 * 
 * Accessibility component that allows keyboard users to skip directly to main content
 * Meets WCAG 2.1 Level A requirement for bypass blocks
 */

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-white focus:text-[var(--color-primary)] focus:rounded-lg focus:shadow-2xl focus:font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 transition-all"
      style={{ 
        /* Ensure it's above everything when focused */
        position: 'fixed'
      }}
    >
      Skip to main content
    </a>
  );
}

/**
 * Screen Reader Only utility component
 * For hiding content visually while keeping it accessible to screen readers
 */
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

/**
 * VisuallyHidden component with toggle
 * Can be shown on focus for keyboard navigation
 */
export function VisuallyHidden({ 
  children, 
  showOnFocus = false 
}: { 
  children: React.ReactNode;
  showOnFocus?: boolean;
}) {
  return (
    <span className={showOnFocus ? 'sr-only focus-within:not-sr-only' : 'sr-only'}>
      {children}
    </span>
  );
}
