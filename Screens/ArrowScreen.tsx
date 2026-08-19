import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

function Object3D() {
    const groupRef = useRef<THREE.Group>(null);
    useEffect(() => { // If this is meant to update every frame, it's useFrame, not useEffect
        groupRef.current?.rotation.set(200, 100, 100); // Rotation of the arrow in radians (x, y, z)
    }, []);
    return (
        <group ref={groupRef}>
            <mesh position={[0, -0.3, 0]}>
                <sphereGeometry args={[0.5, 32, 16]} /> {/* Each Shape Has It's Own Args */}
                <meshStandardMaterial color="#5339e6" />
            </mesh>
        </group>
    );
}

const ArrowScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Canvas camera={{ position: [0, 0, 3] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 2, 2]} intensity={1} />
                <Object3D />
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
});

export default ArrowScreen;
