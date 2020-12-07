import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { FAB, Snackbar } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';

import { NotesContext } from '../providers/NotesProvider';
import ListItem from '../components/ListItem';
import { Colors } from '../../Colors';
import { SocketContext } from '../providers/SocketProvider';

const NotesScreen = ({ navigation }) => {
    const [notes, setNotes] = useContext(NotesContext);
    const [isVisible, setIsVisible] = useState(false);
    const socket = useContext(SocketContext);

    const deleteItem = (id) => {
        Alert.alert(`¿Desea eliminar esta nota?`, '', [
            { 'text': 'CANCELAR', style: 'cancel' },
            { 'text': 'ELIMINAR', style: 'destructive', onPress: () => deleteNote(id) }
        ], { cancelable: true });
    }
    
    const deleteNote = async id => {
        try {
            const resp = await fetch(`http://35.232.34.239:80/api/notes?id=${id}`, {
                method: 'delete'
            });
            const json = resp.json();
            console.log(json);
            setNotes(notes.filter(note => note.id != id));
            socket.emit('delete note', id);
            setIsVisible(true);
        } catch(ex) {
            Alert.alert('Error', 'Ocurrió un error al crear la nota');
        }
    };

    const fetchNotes = async () => {
        const resp = await fetch('http://35.232.34.239:80/api/notes');
        const json = await resp.json();
        const fetchedNotes = json.data.map(note => ({ id: note['_id']['$oid'], title: note.title, description: note.descrition }));
        setNotes(fetchedNotes);
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={notes}
                keyExtractor={note => note.id}
                renderItem={({ item }) => <ListItem {...item} handleDeleteItem={deleteItem} />} />

            <FAB
                icon='plus'
                color='white'
                style={styles.fab}
                onPress={() => navigation.navigate('Add Note')} />

            <Snackbar 
                duration={2000}
                visible={isVisible}
                style={{ backgroundColor: Colors.primary }}
                onDismiss={() => setIsVisible(false)}>Nota eliminada</Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    fab: {
        backgroundColor: Colors.primary,
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0
    }
});

export default NotesScreen;
