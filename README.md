# useAsyncView Hook

A custom React hook that manages asynchronous data loading with automatic view rendering based on the current loading state.

## Features

- Automatic state management for async operations
- Declarative view rendering based on loading status
- Manual reload functionality
- TypeScript support with full type inference
- Automatic or manual loading modes
- Custom error handling components
- **React Native support** - Works seamlessly in both React web and React Native

## Installation

```bash
npm install
```

## Usage

### Basic Example (React Web)

```tsx
import { useAsyncView } from './hooks/useAsyncView';

function App() {
  const { RenderedView, reload, status } = useAsyncView({
    loadFn: async () => {
      const response = await fetch('/api/data');
      return response.json();
    },
    Fallback: () => <div>Click load to start</div>,
    Loading: () => <div>Loading...</div>,
    Success: ({ data }) => <div>Data: {data.name}</div>,
    auto: true, // Start loading automatically on mount
  });

  return (
    <div>
      <h1>My App</h1>
      <p>Status: {status}</p>
      {RenderedView}
      <button onClick={reload}>Reload</button>
    </div>
  );
}
```

### Basic Example (React Native)

```tsx
import { useAsyncView } from './hooks/useAsyncView.native';
import { NativeLoadingView } from './components/NativeLoadingView';
import { View, Text, TouchableOpacity } from 'react-native';

function App() {
  const { RenderedView, reload, status } = useAsyncView({
    loadFn: async () => {
      const response = await fetch('/api/data');
      return response.json();
    },
    Fallback: () => (
      <View>
        <Text>Click load to start</Text>
      </View>
    ),
    Loading: NativeLoadingView, // Uses ActivityIndicator
    Success: ({ data }) => (
      <View>
        <Text>Data: {data.name}</Text>
      </View>
    ),
    auto: true,
  });

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>My App</Text>
      <Text>Status: {status}</Text>
      {RenderedView}
      <TouchableOpacity onPress={reload}>
        <Text>Reload</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### API Reference

#### Options

The `useAsyncView` hook accepts a single options object with the following properties:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `loadFn` | `() => Promise<T>` | Yes | - | Async function that loads and returns the data |
| `Fallback` | `ComponentType` | Yes | - | Component to render in idle state (before loading starts) |
| `Loading` | `ComponentType` | Yes | - | Component to render while loading |
| `Success` | `ComponentType<{ data: T }>` | Yes | - | Component to render on success, receives loaded data as prop |
| `Error` | `ComponentType` | No | `ErrorView` (web) / `NativeErrorView` (native) | Component to render on error (uses default error view if not provided) |
| `auto` | `boolean` | No | `true` | Whether to automatically trigger the load on mount |

#### Return Value

The hook returns an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `RenderedView` | `ReactElement` | The rendered view component based on current status |
| `status` | `'idle' \| 'loading' \| 'success' \| 'error'` | Current loading status |
| `data` | `T \| null` | The loaded data, or null if not yet loaded |
| `error` | `unknown` | The error object if loading failed, or null |
| `reload` | `() => void` | Function to manually trigger a reload of the data |

## React Native Components

The hook comes with pre-built React Native components that use native UI elements:

### NativeLoadingView

Uses `ActivityIndicator` from React Native with customizable options:

```tsx
import { NativeLoadingView } from './components/NativeLoadingView';

// Use with custom props
<NativeLoadingView 
  text="Loading data..." 
  color="#007AFF" 
  size="large" 
/>
```

**Props:**
- `text?: string` - Loading text to display (default: "Loading...")
- `showLoader?: boolean` - Whether to show the activity indicator (default: true)
- `loader?: ReactNode` - Custom loader component
- `color?: string` - Color of the ActivityIndicator (default: "#007AFF")
- `size?: 'small' | 'large'` - Size of the ActivityIndicator (default: "large")

### NativeErrorView

Provides a native-styled error view with collapsible error details:

```tsx
import { NativeErrorView } from './components/NativeErrorView';

<NativeErrorView 
  message="Failed to load data"
  error={error}
  runFunction={reload}
  buttonText="Try Again"
/>
```

**Props:**
- `message: string` - Error message to display
- `error?: Error` - Error object (optional, can show details)
- `runFunction?: () => void` - Function to call when retry button is pressed
- `buttonText?: string` - Text for retry button (default: "Try again")

## Platform-Specific Usage

### For React Web Projects

Import from `useAsyncView.tsx`:
```tsx
import { useAsyncView } from './hooks/useAsyncView';
import { LoadingView, ErrorView } from './components';
```

### For React Native Projects

Import from `useAsyncView.native.tsx`:
```tsx
import { useAsyncView } from './hooks/useAsyncView.native';
import { NativeLoadingView, NativeErrorView } from './components';
```

### Advanced Examples

#### Manual Loading Mode (Web)

```tsx
const { RenderedView, reload, status } = useAsyncView({
  loadFn: fetchUserData,
  Fallback: () => <button onClick={reload}>Load User Data</button>,
  Loading: () => <Spinner />,
  Success: ({ data }) => <UserProfile user={data} />,
  auto: false, // Don't load automatically
});
```

#### Manual Loading Mode (React Native)

```tsx
import { useAsyncView } from './hooks/useAsyncView.native';
import { TouchableOpacity, Text } from 'react-native';

const { RenderedView, reload } = useAsyncView({
  loadFn: fetchUserData,
  Fallback: () => (
    <TouchableOpacity onPress={reload}>
      <Text>Load User Data</Text>
    </TouchableOpacity>
  ),
  Loading: () => <NativeLoadingView />,
  Success: ({ data }) => <UserProfile user={data} />,
  auto: false,
});
```

#### Custom Error Handling (Web)

```tsx
const { RenderedView } = useAsyncView({
  loadFn: fetchData,
  Fallback: () => <div>Ready to load</div>,
  Loading: () => <div>Loading...</div>,
  Success: ({ data }) => <div>{data.content}</div>,
  Error: () => <div className="error">Something went wrong!</div>,
});
```

#### Custom Error Handling (React Native)

```tsx
import { View, Text } from 'react-native';

const { RenderedView } = useAsyncView({
  loadFn: fetchData,
  Fallback: () => <View><Text>Ready to load</Text></View>,
  Loading: () => <NativeLoadingView text="Fetching..." />,
  Success: ({ data }) => <View><Text>{data.content}</Text></View>,
  Error: () => (
    <View style={{ padding: 20 }}>
      <Text style={{ color: 'red' }}>Something went wrong!</Text>
    </View>
  ),
});
```

#### Using Status and Data Separately

```tsx
const { RenderedView, status, data, error, reload } = useAsyncView({
  loadFn: fetchData,
  Fallback: () => <div>Not loaded</div>,
  Loading: () => <div>Loading...</div>,
  Success: ({ data }) => <div>{data}</div>,
});

// You can use status, data, and error for additional logic
if (status === 'error') {
  console.error('Failed to load:', error);
}

return (
  <div>
    {status === 'success' && data && <p>Loaded at: {new Date().toLocaleString()}</p>}
    {RenderedView}
    <button onClick={reload} disabled={status === 'loading'}>
      Reload
    </button>
  </div>
);
```

## Status Flow

The hook manages four distinct states:

1. **idle**: Initial state before loading starts (only when `auto: false`)
2. **loading**: Data is being fetched
3. **success**: Data loaded successfully
4. **error**: An error occurred during loading

## Development

This project uses React + TypeScript + Vite.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
