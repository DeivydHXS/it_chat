import { Link } from 'expo-router';
import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, NativeScrollEvent, NativeSyntheticEvent, Pressable } from 'react-native';

const { width } = Dimensions.get('window');

const DATA = [
    { key: '1', text: 'Bem-vindo ao nosso app!' },
    { key: '2', text: 'Converse com facilidade.' },
    { key: '3', text: 'Sua privacidade é nossa prioridade.' },
];

const WellcomeCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={DATA}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <View style={{
                            height: '70%',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={styles.text}>
                                {item.text}
                            </Text>
                        </View>
                        {item.key === '3' &&
                            <Link href="/login" style={styles.button_container}>
                                <Link.Trigger>
                                    <Text style={{
                                        color: '#F8F9FE',
                                        textAlign: 'center',
                                        fontWeight: 'bold'
                                    }}>Finalizar</Text>
                                </Link.Trigger>
                            </Link>}
                    </View>
                )}
                keyExtractor={item => item.key}
            />
            <View style={styles.dotsContainer}>
                {DATA.map((_, idx) => (
                    <View
                        key={idx}
                        style={[
                            styles.dot,
                            currentIndex === idx && styles.activeDot,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '80%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    slide: {
        width,
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 24,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        color: '#333'
    },
    dotsContainer: {
        flexDirection: 'row',
        marginTop: 16,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#333',
    },
    button_container: {
        width: 150,
        height: 40,
        alignItems: 'center',
        backgroundColor: '#1F2024',
        padding: 8,
        borderRadius: 30,
    },
});

export default WellcomeCarousel;