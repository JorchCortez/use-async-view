import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface NativeErrorViewProps {
    message: string;
    error?: Error;
    runFunction?: () => void;
    buttonText?: string;
}

export const NativeErrorView: React.FC<NativeErrorViewProps> = ({ 
    message, 
    error, 
    runFunction,
    buttonText = 'Try again' 
}) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Error</Text>
            <Text style={styles.message}>{message}</Text>
            
            {error && (
                <View style={styles.detailsContainer}>
                    <TouchableOpacity 
                        onPress={() => setShowDetails(!showDetails)}
                        style={styles.detailsButton}
                    >
                        <Text style={styles.detailsButtonText}>
                            {showDetails ? '▼' : '▶'} Details
                        </Text>
                    </TouchableOpacity>
                    
                    {showDetails && (
                        <View style={styles.errorDetails}>
                            <Text style={styles.errorText}>{error.message}</Text>
                            {error.stack && (
                                <Text style={styles.stackText}>{error.stack}</Text>
                            )}
                        </View>
                    )}
                </View>
            )}
            
            {runFunction && (
                <TouchableOpacity 
                    onPress={runFunction}
                    style={styles.retryButton}
                >
                    <Text style={styles.retryButtonText}>{buttonText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        color: '#d32f2f',
        textAlign: 'center',
        marginBottom: 16,
    },
    detailsContainer: {
        width: '100%',
        marginBottom: 16,
    },
    detailsButton: {
        padding: 8,
    },
    detailsButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    errorDetails: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    errorText: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'monospace',
    },
    stackText: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'monospace',
        marginTop: 8,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default NativeErrorView;
