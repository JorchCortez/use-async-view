import {type FunctionComponent, type ReactNode} from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface NativeLoadingViewProps {
    text?: string;
    showLoader?: boolean;
    loader?: ReactNode;
    color?: string;
    size?: 'small' | 'large';
}

const DefaultLoader: FunctionComponent<{ color?: string; size?: 'small' | 'large' }> = ({ 
    color = '#007AFF', 
    size = 'large' 
}) => (
    <View style={styles.defaultLoader}>
        <ActivityIndicator size={size} color={color} />
    </View>
);

export const NativeLoadingView: FunctionComponent<NativeLoadingViewProps> = ({
    text = 'Loading...',
    showLoader = true,
    loader,
    color,
    size,
}) => {
    const shouldShowLoader = loader !== undefined || showLoader;

    return (
        <View style={styles.loadingView}>
            {shouldShowLoader && (loader || <DefaultLoader color={color} size={size} />)}
            {text && <Text style={styles.loadingText}>{text}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    defaultLoader: {
        marginBottom: 12,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});

export default NativeLoadingView;
