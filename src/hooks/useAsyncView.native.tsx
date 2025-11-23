/**
 * A custom React Native hook that manages asynchronous data loading with automatic view rendering.
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
 * @returns {ReactElement} returns.RenderedView - The rendered view component based on current status
 * @returns {Status} returns.status - Current loading status ('idle' | 'loading' | 'success' | 'error')
 * @returns {T | null} returns.data - The loaded data, or null if not yet loaded
 * @returns {unknown} returns.error - The error object if loading failed, or null
 * @returns {() => void} returns.reload - Function to manually trigger a reload of the data
 * 
 * @example
 * ```tsx
 * import { useAsyncView } from './hooks/useAsyncView.native';
 * import { NativeLoadingView } from './components/NativeLoadingView';
 * import { View, Text } from 'react-native';
 * 
 * const { RenderedView, reload, status } = useAsyncView({
 *   loadFn: () => fetch('/api/data').then(r => r.json()),
 *   Fallback: () => <View><Text>Not loaded yet</Text></View>,
 *   Loading: NativeLoadingView,
 *   Success: ({ data }) => <View><Text>{data.name}</Text></View>,
 *   auto: true
 * });
 * 
 * return <View>{RenderedView}</View>;
 * ```
 */
import React, { 
    type ReactElement, 
    useEffect, 
    useRef, 
    useState, 
    useCallback, 
    useMemo
} from "react";
import { NativeErrorView } from "../components/NativeErrorView";
import { NativeLoadingView } from "../components/NativeLoadingView";
import { type StatusType, type UseAsyncViewOptionsType, AsyncViewStatus } from "../types/types";

export const useAsyncView = <T,>({
    loadFn,
    Fallback,
    Loading,
    Success,
    Error,
    auto = true,
}: UseAsyncViewOptionsType<T>) => {
    const [status, setStatus] = useState<StatusType>("idle");
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
            setStatus(AsyncViewStatus.Success);
        } catch (err) {
            setError(err);
            setStatus(AsyncViewStatus.Error);
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

    const LoadingComponent = useMemo(() => Loading ?? NativeLoadingView, [Loading]);
    const FallbackComponent = useMemo(() => Fallback ?? NativeLoadingView, [Fallback]);
    let RenderedView: ReactElement;



    if (status === AsyncViewStatus.Loading || status === AsyncViewStatus.Idle) {
        RenderedView = status === AsyncViewStatus.Idle ? <FallbackComponent /> : <LoadingComponent />;
    } else if (status === AsyncViewStatus.Success && data !== null) {
        RenderedView = <Success data={data} />;
    } else {
        RenderedView = Error ? 
            <Error /> :
            <NativeErrorView message="Failed to load data." error={error as Error} runFunction={reload} />;
    }

    return {
        RenderedView,
        status,
        data,
        error,
        reload,
    };
};
