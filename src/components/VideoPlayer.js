import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Video from 'react-native-video';
import IconLabel from './IconLabel';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { doc, updateDoc, increment } from 'firebase/firestore';
import db from '../config/firebase';

const VideoPlayer = ({
  videoUri,
  shouldPlay,
  poster,
  videoId,
  name = "",
  subtitle,
  likes = 0,
  views = 0,
  liked = false,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(liked);
  const [likesCount, setLikesCount] = useState(likes);
  const [viewsCount, setViewsCount] = useState(views);
  const videoRef = useRef(null);

  useEffect(() => {
    if (shouldPlay) {
      videoRef.current?.playAsync(); // If using ref for autoplay
    } else {
      videoRef.current?.pauseAsync();
    }
    return () => {
      videoRef.current?.pauseAsync();
    };
  }, [shouldPlay]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleLike = async () => {
    const videoRef = doc(db, 'posts', videoId);
    await updateDoc(videoRef, {
      likes: increment(1),
    });
    setLikesCount((prev) => prev + 1);
    setIsLiked(true);
  };

  const handleLongPress = () => {
    videoRef.current?.pauseAsync();
  };

  const handlePressOut = () => {
    videoRef.current?.playAsync();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={toggleMute}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.touchableArea}
      >
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          style={styles.video}
          resizeMode="cover"
          muted={isMuted}
          repeat
          paused={!shouldPlay}
          poster={poster}
          posterResizeMode="cover"
        />
        <MaterialIcons
          name={isMuted ? 'volume-off' : 'volume-up'}
          size={12}
          color="white"
          style={styles.muteButton}
        />
      </TouchableOpacity>

      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {name}
            </Text>
            <Text style={styles.caption} numberOfLines={1} ellipsizeMode="tail">
              {subtitle}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLike} style={styles.button}>
            <IconLabel
              size={20}
              name={isLiked ? 'heart' : 'hearto'}
              label={likesCount}
              color={isLiked ? 'red' : 'white'}
              textColor="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 60,
    top: 0,
  },
  touchableArea: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 10,
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
  },
  muteButton: {
    position: 'absolute',
    top: 30,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    overflow: 'hidden',
    color: 'white',
  },
  caption: {
    fontSize: 12,
    color: 'gray',
    overflow: 'hidden',
  },
});

export default VideoPlayer;
