import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Modal, PanResponder } from 'react-native';
import { Surface } from 'react-native-paper';
import { SharedElement } from 'react-navigation-shared-element';
import Icons, { icons } from './Icons';
import { doc, updateDoc, increment } from 'firebase/firestore';
import db from '../config/firebase';

const iconColor = '#6c5ce7';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ItemCard = ({ item, navigation, numColumns }) => {
  const { id, name, poster, caption, likes, views, type } = item;
  const [likeCount, setLikeCount] = useState(likes);
  const [viewCount, setViewCount] = useState(views);
  const [isFullScreenVisible, setIsFullScreenVisible] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        setImagePosition({
          x: gestureState.moveX - screenWidth / 2,
          y: gestureState.moveY - screenHeight / 2,
        });
      },
      onPanResponderRelease: () => {
        setImagePosition({ x: 0, y: 0 });
      },
    })
  ).current;

  const incrementLikesCount = async (postId) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, { likes: increment(1) });
      setLikeCount((prev) => prev + 1);
    } catch (error) {
      console.error('Error updating likes count:', error.message);
    }
  };

  const incrementViewCount = async (postId) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, { views: increment(1) });
      console.log(`Updated view count for post ID: ${postId}`);
    } catch (error) {
      console.error('Error updating view count:', error.message);
    }
  };

  const handleLongPress = async () => {
    await incrementViewCount(id);
    setViewCount((prev) => prev + 1);
    setIsFullScreenVisible(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreenVisible(false);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleImageClick = () => {
    if (type === 'video') {
      navigation.navigate('Explore', {
        selectedVideo: item,
      });
    }
  };

  return (
    <Surface style={[styles.item, { width: Math.min(screenWidth / numColumns - 40, 300) }]}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {name}
          </Text>
          <Text style={styles.caption} numberOfLines={1} ellipsizeMode="tail">
            {caption}
          </Text>
        </View>
        <View style={{ position: 'absolute', top: 16, right: 0 }}>
          <Icons icon={icons.Entypo} name="dots-three-vertical" size={18} />
        </View>
      </View>

      <TouchableWithoutFeedback
        onLongPress={handleLongPress}
        onPress={handleImageClick}
      >
        <SharedElement id={`item.${poster}.image`}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: poster }}
              resizeMode="contain"
            />
            {type === 'video' && (
              <View style={styles.playButtonContainer}>
                <Icons icon={icons.MaterialIcons} name="play-circle-outline" size={60} color="#FFFFFF" />
              </View>
            )}
          </View>
        </SharedElement>
      </TouchableWithoutFeedback>

      <View style={styles.bottomView}>
        <TouchableOpacity style={styles.icon} onPress={() => incrementLikesCount(id)}>
          <Icons icon={icons.AntDesign} name="heart" color={iconColor} />
          <Text style={styles.iconLabel}>{likeCount}</Text>
        </TouchableOpacity>
        <View style={styles.icon}>
          <Icons icon={icons.Ionicons} name="chatbubble-outline" />
        </View>
        <View style={styles.icon}>
          <Icons icon={icons.Feather} name="send" />
        </View>
      </View>

      <Modal
        transparent={true}
        visible={isFullScreenVisible}
        animationType="fade"
      >
        <TouchableWithoutFeedback onPress={handleCloseFullScreen}>
          <View style={styles.fullScreenOverlay}>
            <View
              style={[
                styles.draggableImageContainer,
                { transform: [{ translateX: imagePosition.x }, { translateY: imagePosition.y }] }
              ]}
              {...panResponder.panHandlers}
            >
              <Image
                style={styles.fullScreenImage}
                source={{ uri: poster }}
                resizeMode="contain"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Surface>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 15,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    overflow: 'hidden',
  },
  caption: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    height: '100%',
    width: '100%',
    aspectRatio: 1,
  },
  playButtonContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  bottomView: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-around',
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLabel: {
    marginLeft: 4,
    color: 'gray',
  },
  fullScreenOverlay: {
    padding: 10,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  draggableImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
});

export default ItemCard;
