import React, { useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const ImagePopUp = ({ activeImage, setOverlayVisible }) => {
  const scaleValue = useRef(new Animated.Value(1)).current; // Ensure scale starts from 1
  const translateY = useRef(new Animated.Value(0)).current;

  const closeOverlay = () => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setOverlayVisible(false);
    });
  };

  return (
    <View style={styles.overlayContainer}>
      <Animated.View
        style={[
          styles.animatedImageContainer,
          {
            transform: [{ scale: scaleValue }, { translateY }],
          },
        ]}>
        <ImageViewer
          imageUrls={activeImage}
          backgroundColor="transparent"
          enableSwipeDown={true}
          onSwipeDown={closeOverlay}
          renderIndicator={() => null}
          style={styles.imageStyle}
          enableImageZoom={true}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  animatedImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
});

export default ImagePopUp;
