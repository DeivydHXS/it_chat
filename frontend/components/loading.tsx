import { Colors } from "@/constants/theme";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export function Loading() {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const spin = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            })
        );
        spin.start();

        return () => spin.stop();
    }, [spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.box, { transform: [{ rotate: spin }] }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100
    },
    box: {
        width: 40,
        height: 40,
        borderRadius: 100,
        borderTopWidth: 4,
        borderLeftWidth: 2,
        borderColor: Colors.red
    },
});