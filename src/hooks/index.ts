/**
 * Platform-agnostic export for useAsyncView hook
 * Automatically exports the correct version based on the platform
 */

// Re-export web version by default
export { useAsyncView, AsyncViewStatus } from './useAsyncView';
