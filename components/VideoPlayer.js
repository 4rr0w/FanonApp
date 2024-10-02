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

const VideoPlayer = ({
  videoUri,
  shouldPlay,
  likes = 1,
  views = 1,
  liked = false,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(liked);
  const videoRef = useRef(null);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pauseAsync();
      }
    };
  }, []);

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
              label={views}
              color={'white'}
              textColor="white"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLike} style={styles.button}>
            <IconLabel
              size={20}
              name={isLiked ? 'heart' : 'hearto'}
              label={likes}
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
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height, 
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
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
