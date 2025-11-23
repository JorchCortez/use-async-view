# useAsyncView Hook

[![npm version](https://badge.fury.io/js/use-async-view.svg)](https://www.npmjs.com/package/use-async-view)
[![npm downloads](https://img.shields.io/npm/dm/use-async-view.svg)](https://www.npmjs.com/package/use-async-view)
[![CI](https://github.com/JorchCortez/use-async-view/actions/workflows/ci.yml/badge.svg)](https://github.com/JorchCortez/use-async-view/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
npm install use-async-view
```

or with yarn:

```bash
yarn add use-async-view
```

or with pnpm:

```bash
pnpm add use-async-view
```

## Usage

### Basic Example (React Web)

```tsx
import { useAsyncView } from 'use-async-view';

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
import { useAsyncView } from 'use-async-view/native';
import { NativeLoadingView } from 'use-async-view/native';
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

## Reusable Components

The library includes pre-built, customizable components for both React Web and React Native that you can use with the hook or independently in your application.

| Component | Platform | Purpose | Key Features |
|-----------|----------|---------|--------------|
| `LoadingView` | Web | Loading state | Default spinner, customizable text & loader |
| `ErrorView` | Web | Error state | Error message, expandable details, retry button |
| `NativeLoadingView` | React Native | Loading state | ActivityIndicator, customizable color & size |
| `NativeErrorView` | React Native | Error state | Native styling, collapsible details, TouchableOpacity button |

### Web Components

#### LoadingView

A flexible loading component with a default spinner and customizable text.

```tsx
import { LoadingView } from 'use-async-view';

// Basic usage
<LoadingView />

// With custom text
<LoadingView text="Loading your data..." />

// With custom loader
<LoadingView 
  text="Please wait..."
  loader={<MyCustomSpinner />}
/>

// Show loader explicitly
<LoadingView showLoader={true} text="Loading..." />
```

**Props:**
- `text?: string` - Loading text to display (default: "Loading...")
- `showLoader?: boolean` - Whether to show the default spinner
- `loader?: ReactNode` - Custom loader component to replace the default spinner

**Styling:**
The component uses the following CSS classes that you can style:
- `.loading-view` - Container div
- `.default-loader` - Default spinner container
- `.spinner` - Spinner element
- `.loading-text` - Text paragraph

#### ErrorView

A comprehensive error display component with expandable error details and retry functionality.

```tsx
import { ErrorView } from 'use-async-view';

// Basic usage
<ErrorView message="Failed to load data" />

// With error details
<ErrorView 
  message="Failed to load data"
  error={error}
/>

// With retry function
<ErrorView 
  message="Failed to load data"
  error={error}
  runFunction={handleRetry}
/>
```

**Props:**
- `message: string` - Error message to display (required)
- `error?: Error` - Error object (shows expandable details if provided)
- `runFunction?: () => void` - Function to call when "Try again" button is clicked

**Features:**
- Displays error message prominently
- Collapsible `<details>` element showing error stack trace
- Optional "Try again" button for retry functionality
- Red color scheme for visual error indication

### React Native Components

#### NativeLoadingView

Uses React Native's `ActivityIndicator` with customizable styling and text.

```tsx
import { NativeLoadingView } from 'use-async-view/native';

// Basic usage
<NativeLoadingView />

// With custom text and color
<NativeLoadingView 
  text="Loading data..." 
  color="#007AFF" 
  size="large" 
/>

// With custom loader
<NativeLoadingView 
  text="Please wait..."
  loader={<MyCustomLoader />}
/>
```

**Props:**
- `text?: string` - Loading text to display (default: "Loading...")
- `showLoader?: boolean` - Whether to show the activity indicator (default: true)
- `loader?: ReactNode` - Custom loader component to replace ActivityIndicator
- `color?: string` - Color of the ActivityIndicator (default: "#007AFF")
- `size?: 'small' | 'large'` - Size of the ActivityIndicator (default: "large")

**Styling:**
The component uses React Native `StyleSheet` with the following styles:
- Centered flex layout
- 20px padding
- Activity indicator with 12px bottom margin
- Gray text color (#666)

#### NativeErrorView

A native-styled error component with collapsible error details and TouchableOpacity retry button.

```tsx
import { NativeErrorView } from 'use-async-view/native';

// Basic usage
<NativeErrorView message="Failed to load data" />

// With error details and retry
<NativeErrorView 
  message="Failed to load data"
  error={error}
  runFunction={reload}
/>

// With custom button text
<NativeErrorView 
  message="Network error"
  error={error}
  runFunction={reload}
  buttonText="Retry Now"
/>
```

**Props:**
- `message: string` - Error message to display (required)
- `error?: Error` - Error object (shows expandable details with stack trace)
- `runFunction?: () => void` - Function to call when retry button is pressed
- `buttonText?: string` - Text for retry button (default: "Try again")

**Features:**
- Red error title and message (#d32f2f)
- Expandable error details with toggle button
- Monospace font for error details
- Native-styled blue retry button (#007AFF)
- Touchable details toggle for better UX

### Using Components Independently

All components can be used independently outside of the `useAsyncView` hook:

**Web Example:**
```tsx
import { LoadingView, ErrorView } from 'use-async-view';

function MyComponent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  if (loading) return <LoadingView text="Fetching data..." />;
  if (error) return <ErrorView message="Failed to load" error={error} runFunction={retry} />;
  
  return <div>Content loaded!</div>;
}
```

**React Native Example:**
```tsx
import { NativeLoadingView, NativeErrorView } from 'use-async-view/native';

function MyComponent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  if (loading) return <NativeLoadingView text="Fetching data..." color="#FF6B6B" />;
  if (error) return <NativeErrorView message="Failed to load" error={error} runFunction={retry} />;
  
  return <View><Text>Content loaded!</Text></View>;
}
```

## Platform-Specific Usage

### For React Web Projects

```tsx
import { useAsyncView, LoadingView, ErrorView } from 'use-async-view';
```

### For React Native Projects

```tsx
import { useAsyncView, NativeLoadingView, NativeErrorView } from 'use-async-view/native';
```

Or use explicit imports:

```tsx
// Web
import { useAsyncView } from 'use-async-view/web';

// Native
import { useAsyncView } from 'use-async-view/native';
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
import { useAsyncView } from 'use-async-view/native';
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

### Example Files

- `App.tsx` - Web React example
- `App.native.example.txt` - React Native example (rename to `.tsx` in your React Native project)
- `REACT_NATIVE_SUPPORT.md` - Detailed React Native implementation guide

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
## Contributing

Contributions are welcome! This project uses GitHub Actions for CI/CD.

### Publishing

This package uses automated publishing via GitHub Actions. See [CI_CD_GUIDE.md](./CI_CD_GUIDE.md) for details on the automated workflow.

For manual publishing instructions, see [PUBLISHING.md](./PUBLISHING.md).

## License

MIT © [JorchCortez](https://github.com/JorchCortez)
