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
                <meshStandardMaterial color="#5339e6" />
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
    container: { flex: 1 },
});

export default ArrowScreen;
