/**
 * Performance utilities for mobile optimization
 */

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Check if device has reduced motion preference
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration based on device
 * Returns shorter duration on mobile for better performance
 */
export function getAnimationDuration(baseDuration: number = 0.5): number {
  if (isMobile()) {
    return baseDuration * 0.5; // Half duration on mobile
  }
  return baseDuration;
}

/**
 * Should use reduced animations
 */
export function shouldReduceAnimations(): boolean {
  return isMobile() || prefersReducedMotion();
}

/**
 * Get image quality based on device
 */
export function getImageQuality(): number {
  if (isMobile()) {
    return 20; // Much lower quality on mobile for faster loading
  }
  return 40;
}

/**
 * Intersection Observer options optimized for mobile
 */
export function getIntersectionObserverOptions(): IntersectionObserverInit {
  return {
    rootMargin: isMobile() ? '50px' : '200px', // Smaller margin on mobile
    threshold: isMobile() ? 0.1 : 0.2,
  };
}

