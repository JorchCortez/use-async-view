/**
 * A custom React hook that manages asynchronous data loading with automatic view rendering.
 * 
 * @template T - The type of data returned by the async load function
 * 
 * @param {UseAsyncViewOptions<T>} options - Configuration options for the async view
 * @param {() => Promise<T>} options.loadFn - Async function that loads the data
 * @param {ComponentType} options.Fallback - Component to render in idle state
 * @param {ComponentType} options.Loading - Component to render while loading
 * @param {ComponentType<{ data: T }>} options.Success - Component to render on success, receives loaded data
 * @param {ComponentType} [options.Error] - Optional component to render on error
 * @param {boolean} [options.auto=true] - Whether to automatically trigger the load on mount
 * 
 * @returns {Object} Hook return value
 * @returns {ReactElement} returns.view - The rendered view component based on current status
 * @returns {Status} returns.status - Current loading status ('idle' | 'loading' | 'success' | 'error')
 * @returns {T | null} returns.data - The loaded data, or null if not yet loaded
 * @returns {unknown} returns.error - The error object if loading failed, or null
 * @returns {() => void} returns.reload - Function to manually trigger a reload of the data
 * 
 * @example
 * ```tsx
 * const { view, reload, status } = useAsyncView({
 *   loadFn: () => fetch('/api/data').then(r => r.json()),
 *   Fallback: () => <div>Not loaded yet</div>,
 *   Loading: () => <div>Loading...</div>,
 *   Success: ({ data }) => <div>{data.name}</div>,
 *   auto: true
 * });
 * 
 * return <div>{view}</div>;
 * ```
 */
import { 
    type ComponentType, 
    type ReactElement, 
    useEffect, 
    useRef, 
    useState, 
    useCallback 
} from "react";
import { ErrorView } from "../components/ErrorView";

type Status = "idle" | "loading" | "success" | "error";

export const enum AsyncViewStatus {
    Idle = "idle",
    Loading = "loading",
    Success = "success",
    Error = "error",
}

interface UseAsyncViewOptions<T> {
    loadFn: () => Promise<T>;
    Fallback: ComponentType;
    Loading: ComponentType;
    Success: ComponentType<{ data: T }>;
    Error?: ComponentType;
    auto?: boolean;
}


export const useAsyncView = <T,>({
    loadFn,
    Fallback,
    Loading,
    Success,
    Error,
    auto = true,
}: UseAsyncViewOptions<T>) => {
    const [status, setStatus] = useState<Status>("idle");
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<unknown>(null);
    const hasRunRef = useRef(false);
    const loadFnRef = useRef(loadFn);

    const run = useCallback(async () => {
        setStatus("loading");
        setError(null);

        try {
            const result = await loadFnRef.current();
            setData(result);
            setStatus("success");
        } catch (err) {
            setError(err);
            setStatus("error");
        }
    }, []);

    const reload = useCallback(() => {
        run();
    }, [run]);

    useEffect(() => {
        if (!auto || hasRunRef.current) return;
        hasRunRef.current = true;
        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auto]);

    useEffect(() => {
        loadFnRef.current = loadFn;
    }, [loadFn]);

    let RenderedView: ReactElement;

    if (status === "loading" || status === "idle") {
        RenderedView = status === "idle" ? <Fallback /> : <Loading />;
    } else if (status === "success" && data !== null) {
        RenderedView = <Success data={data} />;
    } else {
        RenderedView = Error ? 
            <Error /> :
            <ErrorView message="Failed to load data." error={error as Error} runFunction={reload} />;
    }

    return {
        RenderedView,
        status,
        data,
        error,
        reload,
    };
};
