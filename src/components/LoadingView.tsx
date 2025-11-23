import React, {type FunctionComponent, type ReactNode} from 'react';

interface LoadingViewProps {
    text?: string;
    showLoader?: boolean;
    loader?: ReactNode;
}

const DefaultLoader: FunctionComponent = () => (
    <div className="default-loader">
        <div className="spinner" />
    </div>
);

export const LoadingView: FunctionComponent<LoadingViewProps> = ({
    text = 'Loading...',
    showLoader,
    loader,
}) => {
    const shouldShowLoader = loader !== undefined || showLoader;

    return (
        <div className="loading-view">
            {shouldShowLoader && (loader || <DefaultLoader />)}
            {text && <p className="loading-text">{text}</p>}
        </div>
    );
};

export default LoadingView;