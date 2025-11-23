/**
 * React Native entry point for use-async-view
 * Import from 'use-async-view/native' in React Native projects
 */

// Export the React Native hook
export { useAsyncView } from './hooks/useAsyncView.native';

// Export React Native components
export { NativeLoadingView } from './components/NativeLoadingView';
export { NativeErrorView } from './components/NativeErrorView';

// Export types
export { AsyncViewStatus } from './types/types';
export type { StatusType, UseAsyncViewOptionsType } from './types/types';
