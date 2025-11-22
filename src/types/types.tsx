import { type ComponentType } from "react";

export type StatusType = "idle" | "loading" | "success" | "error";

export const enum AsyncViewStatus {
    Idle = "idle",
    Loading = "loading",
    Success = "success",
    Error = "error",
}

export interface UseAsyncViewOptionsType<T> {
    loadFn: () => Promise<T>;
    Fallback: ComponentType;
    Loading: ComponentType;
    Success: ComponentType<{ data: T }>;
    Error?: ComponentType;
    auto?: boolean;
}