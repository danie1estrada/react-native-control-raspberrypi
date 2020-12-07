import React from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { IconButton } from 'react-native-paper'

const ListItem = ({ id, title, description, handleDeleteItem }) => {
    return (
        <View style={styles.listItem}>
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                <Text numberOfLines={1}>{description}</Text>
            </View>

            <TouchableHighlight style={{ borderRadius: 24 }} onPress={() => handleDeleteItem(id)}>
                <IconButton
                    icon='delete'
                    size={24}
                    name='delete' />
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    listItem: {
        flex: 1,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    container: {
        flexShrink: 1,
        flexGrow: 1
    },
    title: {
        fontSize: 18
    }
});

export default ListItem;
