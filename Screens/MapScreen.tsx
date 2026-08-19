import React from 'react';
import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
 
const MapScreen: React.FC = () => {
    return (
        <MapView style={styles.map}>
        </MapView>
    );
} 

const styles = StyleSheet.create({
    map: { flex: 1 },
});

export default MapScreen;