import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

function Arrow() {
    const groupRef = useRef<THREE.Group>(null);
    return (
        <group ref={groupRef}>
            <mesh position={[0, -0.3, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
                <meshStandardMaterial color="#e63946" />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
                <coneGeometry args={[0.3, 0.6, 16]} />
                <meshStandardMaterial color="#e63946" />
            </mesh>
        </group>
    );
}

const ArrowScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Canvas camera={{ position: [0, 0, 3] }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[2, 2, 2]} intensity={1} />
                <Arrow />
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#111' },
});

export default ArrowScreen;
