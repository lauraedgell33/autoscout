'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu as MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { FocusTrap } from '../common/FocusTrap';
import { useEffect } from 'react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  children: React.ReactNode;
}

/**
 * MobileNav Component
 * 
 * Mobile navigation drawer with slide-in animation
 * Features:
 * - Smooth slide animation from left
 * - Backdrop blur
 * - Focus trap when open
 * - Keyboard navigation (Escape to close)
 * - Touch-friendly tap targets (44x44px minimum)
 * - Body scroll lock when open
 * 
 * @param isOpen - Whether the mobile nav is visible
 * @param onClose - Callback to close the nav
 * @param onToggle - Callback to toggle the nav
 * @param children - Navigation content (links, etc.)
 */
export function MobileNav({ isOpen, onClose, onToggle, children }: MobileNavProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={onToggle}
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-nav"
      >
        {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[var(--z-modal-backdrop)] md:hidden"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.nav
              id="mobile-nav"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl z-[var(--z-modal)] overflow-y-auto md:hidden"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <FocusTrap active={isOpen} onEscape={onClose}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-lg font-bold text-[var(--color-primary)]">
                      AutoScout24
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Navigation Content */}
                <div className="p-4">
                  {children}
                </div>
              </FocusTrap>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * MobileNavLink Component
 * Touch-friendly navigation link for mobile menu
 */
export function MobileNavLink({
  href,
  children,
  onClick,
  active = false
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg font-medium
        min-h-[44px] transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2
        ${active 
          ? 'bg-[var(--color-primary)] text-white shadow-md' 
          : 'text-gray-700 hover:bg-gray-100 active:scale-[0.98]'
        }
      `}
    >
      {children}
    </Link>
  );
}

/**
 * MobileNavSection Component
 * Section divider for mobile navigation
 */
export function MobileNavSection({
  title,
  children
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      {title && (
        <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

/**
 * MobileNavDivider Component
 * Visual divider for mobile navigation sections
 */
export function MobileNavDivider() {
  return <hr className="my-4 border-gray-200" aria-hidden="true" />;
}
