/**
 * Main entry point for use-async-view (Web version)
 * For React Native, use: import from 'use-async-view/native'
 */

// Export the web hook
export { useAsyncView } from './hooks/useAsyncView';

// Export web components
export { LoadingView } from './components/LoadingView';
export { ErrorView } from './components/ErrorView';

// Export types
export { AsyncViewStatus } from './types/types';
export type { StatusType, UseAsyncViewOptionsType } from './types/types';
