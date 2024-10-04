import React, { useRef, useState } from 'react';
import { Modal, View, Image, StyleSheet, PanResponder, Animated, Dimensions } from 'react-native';

const ImagePopUp = ({ activeImage, setOverlayVisible }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [isMoving, setIsMoving] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderGrant: () => {
        setIsMoving(true);
        Animated.spring(scale, {
          toValue: 1.5,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderRelease: () => {
        setIsMoving(false);
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: false,
        }).start(() => {
          pan.setValue({ x: 0, y: 0 });
          setOverlayVisible(false);
        });
      },
    })
  ).current;

  return (
    <Modal transparent={true} visible={true} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.zoomableContainer,
            {
              transform: [...pan.getTranslateTransform(), { scale }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Image source={{ uri: activeImage }} style={styles.zoomedImage} />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.9,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomableContainer: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.9,
  },
  zoomedImage: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.9,
    resizeMode: 'contain',
  },
});

export default ImagePopUp;
