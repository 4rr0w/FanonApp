import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet, Dimensions } from 'react-native';
import VideoPlayer from '../components/VideoPlayer';

const Explore = () => {
  const [videos, setVideos] = useState([]);
  const [playingVideoIndex, setPlayingVideoIndex] = useState(0);
  const [page, setPage] = useState(1);

  const videoUrls = [
    'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
  ];

  const fetchMoreVideos = () => {
    const newVideos = videoUrls.map((url, index) => ({
      id: `video-${page}-${index}`,
      uri: url,
    }));
    setVideos((prevVideos) => [...prevVideos, ...newVideos]);
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    fetchMoreVideos();
  }, []);

  const handleViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setPlayingVideoIndex(index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // Adjust threshold to determine when a video should start playing
  };

  return (
    <View style={{  
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height, 
    }}>
      <FlatList
        data={videos}
        renderItem={({ item, index }) => (
          <VideoPlayer
            videoUri={item.uri}
            shouldPlay={index === playingVideoIndex}
          />
        )}
        keyExtractor={(item) => item.id}
        onEndReached={fetchMoreVideos}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        windowSize={5} // Adjust window size for performance
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export default Explore;
