import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, TouchableHighlight, View, Image, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import { Colors } from '../../Colors';
import { SocketContext } from '../providers/SocketProvider';
import ImagePicker from 'react-native-image-picker';
import { FAB } from 'react-native-paper';

const ImageItem = ({ uri, selected, onPress }) => {
  return (
    <TouchableHighlight onPress={onPress}>
      <View>
        <Image
          resizeMode='cover'
          style={{ height: 140, width: 198 }}
          source={{ uri }} />
        
        {selected && <View style={styles.iconContainer}>
          <Icon
            size={12}
            name='check'
            color='white' />
        </View>}
      </View>
    </TouchableHighlight>
  );
};

const ImagesScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const socket = useContext(SocketContext);

  const [uris, setUris] = useState([
    { id: 0, uri: 'https://i.pinimg.com/originals/dc/2d/14/dc2d14bf8591b7ebe65203b02d0a4d45.jpg' },
    { id: 1, uri: 'https://wallpaperaccess.com/full/16082.jpg' },
    { id: 2, uri: 'https://wallpaperscave.com/images/thumbs/wp-preview/800x500/18/10-17/artistic-landscape-92474.jpg' },
    { id: 3, uri: 'https://hdwallpaperup.com/wp-content/uploads/2020/07/Minimal-Landscape-Sunrise-4k-Wallpaper-scaled.jpg' },
    { id: 4, uri: 'https://i.pinimg.com/originals/0d/af/33/0daf3386718fda4f8e89c3270650d801.jpg' }
  ]);

  const handleImagePress = index => {
    setSelectedIndex(index);
    socket.emit('present image', uris[index].uri);
  };

  const pickImage = () => {
    const options = {
      title: 'Seleccionar imagen',
      storageOptions: { skipBackup: true, path: 'images' }
    }

    ImagePicker.showImagePicker(options, response => {
      if (response.error) {
        Alert.alert('Ha ocurrido un error al seleccionar la imagen', response.error);
      } else {
        const source = { uri: response.uri, type: response.type, name: response.fileName };
        upload(source);
      }
    });
  };

  const upload = image => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'us0lbtgh');
    formData.append('cloud_name', 'djahzglr9');

    fetch('https://api.cloudinary.com/v1_1/djahzglr9/upload', {
      method: 'post',
      body: formData
    }).then(res => res.json().then(data => {
      console.log(data);
      setUris(prev => [...prev, { id: data.public_id, uri: data.secure_url }])
    }).catch(err => {
      Alert.alert('Ha ocurrido un error al subir la imagen', err.toString());
    }));
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={uris}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => <ImageItem
          uri={item.uri}
          selected={item.id == selectedIndex}
          onPress={() => handleImagePress(index)} />} />

      <FAB
        icon='file-upload'
        color='white'
        style={styles.fab}
        onPress={pickImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 8,
    padding: 2,
    borderRadius: 8,
    backgroundColor: Colors.primary
  },
  fab: {
    backgroundColor: Colors.primary,
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0
  }
});

export default ImagesScreen;
