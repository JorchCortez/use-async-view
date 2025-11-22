import { useAsyncView } from './hooks/useAsyncView';
import { ErrorView } from './components/ErrorView';

function App() {
  const loadSomething = async () => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("Data loaded");
      }, 2000);
    });
  }

  const { RenderedView, reload, status } = useAsyncView({
    loadFn: loadSomething,
    Fallback: () => <div>Not loaded yet</div>,
    Loading: () => <div>Loading...</div>,
    Success: ({ data }) => <div>{data}</div>,
    auto: true,
  });

  return (
    <>
      <h1>UseAsyncView Test</h1>
      <div className="card">
        <p>Status: {status}</p>
        {RenderedView}
        <button onClick={reload}>
          Reload
        </button>

        <ErrorView message="This is a test error view." runFunction={reload} />
      </div> 
    </>
  )
}

export default App
