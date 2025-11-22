# useAsyncView Hook

A custom React hook that manages asynchronous data loading with automatic view rendering based on the current loading state.

## Features

- 🔄 Automatic state management for async operations
- 🎨 Declarative view rendering based on loading status
- 🔁 Manual reload functionality
- 📦 TypeScript support with full type inference
- ⚡ Automatic or manual loading modes
- 🎯 Custom error handling components

## Installation

```bash
npm install
```

## Usage

### Basic Example

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

### API Reference

#### Options

The `useAsyncView` hook accepts a single options object with the following properties:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `loadFn` | `() => Promise<T>` | Yes | - | Async function that loads and returns the data |
| `Fallback` | `ComponentType` | Yes | - | Component to render in idle state (before loading starts) |
| `Loading` | `ComponentType` | Yes | - | Component to render while loading |
| `Success` | `ComponentType<{ data: T }>` | Yes | - | Component to render on success, receives loaded data as prop |
| `Error` | `ComponentType` | No | `ErrorView` | Component to render on error (uses default ErrorView if not provided) |
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

### Advanced Examples

#### Manual Loading Mode

```tsx
const { RenderedView, reload, status } = useAsyncView({
  loadFn: fetchUserData,
  Fallback: () => <button onClick={reload}>Load User Data</button>,
  Loading: () => <Spinner />,
  Success: ({ data }) => <UserProfile user={data} />,
  auto: false, // Don't load automatically
});
```

#### Custom Error Handling

```tsx
const { RenderedView } = useAsyncView({
  loadFn: fetchData,
  Fallback: () => <div>Ready to load</div>,
  Loading: () => <div>Loading...</div>,
  Success: ({ data }) => <div>{data.content}</div>,
  Error: () => <div className="error">Something went wrong!</div>,
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
