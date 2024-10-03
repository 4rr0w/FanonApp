import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import IconLabel from './IconLabel';
import { doc, updateDoc, increment } from 'firebase/firestore';
import db from '../config/firebase';

const iconColor = '#6c5ce7';

const ItemCard = ({ info, setActiveImage, setOverlayVisible }) => {
  const {id, name, subtitle, content, poster, type } = info;
  const [likes, setLikes] = useState(info.likes);
  const [views, setViews] = useState(info.views);
  const navigation = useNavigation(); 

  const incrementViewCount = async (postId) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        views: increment(1),
      });
      console.log(`Updated view count for post ID: ${postId}`);
    } catch (error) {
      console.error('Error updating view count:', error.message);
    }
  };

  const incrementLikesCount = async (postId) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: increment(1),
      });
      console.log(`Updated likes count for post ID: ${postId}`);
    } catch (error) {
      console.error('Error updating likes count:', error.message);
    }
  };

  const handleImageClick = async () => {
    if (type === 'img') {
      incrementViewCount(id); 
      setViews((prev) => prev + 1);
      setActiveImage([{ url: content }]);
      setOverlayVisible(true);
    } else if (type === 'video') {
      navigation.navigate('Explore', {
        selectedVideo: info, 
      });
    }
  };

  const handleDoubleClick = async () => {
    incrementLikesCount(id);
    setLikes((prev) => prev + 1);
  };

  const deviceWidth = Dimensions.get('window').width;
  const cardWidth = Math.min(Math.max(deviceWidth - 40, 200), 400);

  return (
    <View style={styles.container}>
      <View style={[styles.cardContainer, { width: cardWidth }]}>
        <TouchableOpacity onPress={handleImageClick} onLongPress={handleDoubleClick}>
          <Image style={styles.imageStyle} source={{ uri: poster }} />
          <AntDesign name={type === 'img' ? "picture" : "playcircleo"} color="white" style={styles.iconStyle} />
        </TouchableOpacity>
        <View style={styles.infoStyle}>
          <Text style={styles.titleStyle}>{name}</Text>
          <Text style={styles.categoryStyle}>{subtitle}</Text>

          <View style={styles.iconLabelStyle}>
            <IconLabel name="eye" label={views} color={iconColor} />
            <TouchableOpacity onPress={handleDoubleClick}>
              <IconLabel name="heart" label={likes} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const offset = 20;
const radius = 10;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 7.5,
  },
  cardContainer: {
    backgroundColor: '#faff00',
    height: 220,
    borderRadius: radius,
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 9,
    position: 'relative',
  },
  imageStyle: {
    height: 150,
    width: "100%",
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
    opacity: 0.9,
    alignContent: 'center',
    alignSelf: 'center',
  },
  titleStyle: {
    fontSize: 14,
    fontWeight: '800',
  },
  categoryStyle: {
    fontWeight: '200',
  },
  infoStyle: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  iconLabelStyle: {
    flexDirection: 'row',
    marginTop: 2,
    justifyContent: "space-between",
  },
  iconStyle: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    borderRadius: 4,
    fontSize: 16,
    padding: 2,
  },
});

export default ItemCard;
