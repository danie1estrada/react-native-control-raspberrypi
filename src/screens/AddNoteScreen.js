import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { NotesContext } from '../providers/NotesProvider';

import { Colors } from '../../Colors';
import { SocketContext } from '../providers/SocketProvider';

const AddNoteScreen = () => {
    const socket = useContext(SocketContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [notes, setNote] = useContext(NotesContext);
    
    const createNote = async () => {
        const body = new FormData();
        body.append('title', title);
        body.append('description', description);
        try {
            const resp = await fetch('http://35.232.34.239:80/api/notes', {
                method: 'post', body
            });
            const json = await resp.json();
            const newNote = { id: json.data[0]['_id']['$oid'], title: json.data[0].title, description: json.data[0].descrition }
            console.log(newNote);
            socket.emit('add note', newNote);
            setNote(notes => [newNote, ...notes]);
            setTitle('');
            setDescription('');
            setIsVisible(true);
        } catch(ex) {
            Alert.alert('Error', 'Ocurrió un error al crear la nota');
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 16 }}>
                <Text>Título</Text>
                <TextInput
                    value={title}
                    placeholder='Título'
                    onChangeText={setTitle}
                    style={styles.textInput} />
                <View style={{ height: 16 }} />

                <Text>Descripción</Text>
                <TextInput
                    value={description}
                    multiline
                    numberOfLines={4}
                    placeholder='Descripción'
                    textAlignVertical='top'
                    style={styles.textInput}
                    onChangeText={setDescription} />
                <View style={{ height: 24 }} />

                <Button
                    title='Crear'
                    onPress={createNote} />
            </View>

            <Snackbar 
                visible={isVisible}
                style={{ backgroundColor: Colors.primary }}
                onDismiss={() => setIsVisible(false)}>Se creó una nueva nota</Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    textInput: {
        padding: 8,
        marginTop: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.35)'
    }
});

export default AddNoteScreen;
