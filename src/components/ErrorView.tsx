import React from 'react';

interface ErrorViewProps {
    message: string;
    error?: Error;
    runFunction?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ message, error, runFunction }) => {
    return (
        <div style={{ padding: '20px', color: '#d32f2f' }}>
            <h2>Error</h2>
            <p>{message}</p>
            {error && (
                <details>
                    <summary>Details</summary>
                    <pre>{error.message}</pre>
                </details>
            )}
            {runFunction && (
                <button onClick={runFunction}>Try again</button>
            )}
        </div>
    );
};