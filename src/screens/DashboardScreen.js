import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Switch } from 'react-native-paper';
import { Colors } from '../../Colors';
import { SocketContext } from '../providers/SocketProvider';

const DashboardScreen = () => {
    const socket = useContext(SocketContext);
    const [humidity, setHumidity] = useState(0);
    const [temperature, setTemperature] = useState(0);
    const [isEnabled, setIsEnabled] = useState(false);
    const [isTunrnedOn, setIsTurnedOn] = useState(false);

    const handleAlarmState = () => {
        setIsEnabled(state => !state);
    };

    const handleLightState = () => {
        setIsTurnedOn(state => !state);
        socket.emit('toggle light', isTunrnedOn ? 0 : 1)
    }

    useEffect(() => {
        socket.on('temperature', ({ temperature, humidity }) => {
            setTemperature(temperature);
            setHumidity(humidity);
        });
        return () => socket.disconnect();
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <View style={styles.labelGroup}>
                    <Text style={styles.temperature}>{temperature}°C</Text>
                    <Text>Temperatura</Text>
                </View>
                <View style={styles.labelGroup}>
                    <Text style={styles.temperature}>{humidity}%</Text>
                    <Text>Humedad</Text>
                </View>
            </View>

            <View style={styles.controlsRow}>
                <Text>Alarma</Text>
                <Switch
                    trackColor={{ true: Colors.primaryDark, false: 'gray' }}
                    thumbColor={ isEnabled ? Colors.primary : 'black' }
                    onValueChange={handleAlarmState}
                    value={isEnabled} />
            </View>

            <View style={styles.controlsRow}>
                <Text>Luces</Text>
                <Switch
                    trackColor={{ true: Colors.primaryDark, false: 'gray' }}
                    thumbColor={ isTunrnedOn ? Colors.primary : 'black' }
                    onValueChange={handleLightState}
                    value={isTunrnedOn} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    labelContainer: {
        flexDirection: 'row',
        marginVertical: 32
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 8,
        justifyContent: 'space-between'
    },
    labelGroup: {
        flex: 1,
        flexGrow: 1,
        alignItems: 'center',
    },
    temperature: {
        fontSize: 64
    }
});

export default DashboardScreen;
