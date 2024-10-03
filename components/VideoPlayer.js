import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import IconLabel from './IconLabel';
import { MaterialIcons } from '@expo/vector-icons';
import { doc, updateDoc, increment } from 'firebase/firestore';
import db from '../config/firebase';

const VideoPlayer = ({
  videoUri,
  shouldPlay,
  poster,
  videoId,
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
      videoRef.current.playAsync();
    } else {
      videoRef.current.pauseAsync();
    }
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: videoUri }}
        resizeMode={ResizeMode.COVER}
        shouldPlay={shouldPlay}
        volume={1.0}
        isLooping
        isMuted={isMuted}
        onTouchEnd={toggleMute}
        posterSource={poster}
      />
      <MaterialIcons
        name={isMuted ? 'volume-off' : 'volume-up'}
        size={12}
        color="white"
        style={styles.muteButton}
      />

      <View style={styles.overlay}>
        <Text style={styles.text}>Video Title</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={toggleMute} style={styles.button}>
            <IconLabel
              size={20}
              name="eye"
              label={viewsCount}
              color={'white'}
              textColor="white"
            />
          </TouchableOpacity>
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
  text: {
    color: '#fff',
    fontSize: 18,
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
});

export default VideoPlayer;
