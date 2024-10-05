import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import VideoPlayer from '../components/VideoPlayer';
import { collection, getDocs, query, limit, where, doc, updateDoc, increment } from 'firebase/firestore';
import db from '../config/firebase';

const Explore = () => {
  const route = useRoute();
  const { selectedVideo } = route.params || {};
  const [videos, setVideos] = useState([]);
  const [playingVideoIndex, setPlayingVideoIndex] = useState(0);
  const [initialVideoPlayDelay, setInitialVideoPlayDelay] = useState(true);

  useEffect(() => {
    if (videos.length > 0 && initialVideoPlayDelay) {
      const delayTimer = setTimeout(() => {
        setInitialVideoPlayDelay(false);
      }, 1250);

      return () => clearTimeout(delayTimer);
    }
  }, [videos]);

  const fetchMoreVideos = async () => {
    try {
      const videosCollection = collection(db, 'posts');
      const videosQuery = query(
        videosCollection,
        where('type', '==', 'video'),
        limit(10)
      );

      const querySnapshot = await getDocs(videosQuery);
      const newVideos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (newVideos.length > 0) {
        setVideos((prevVideos) => {
          if (prevVideos.length === 0 && selectedVideo) {
            return [selectedVideo, ...newVideos.filter(video => video.id !== selectedVideo.id)];
          } else if (prevVideos.length > 0) {
            return [...prevVideos, ...newVideos];
          } else {
            return newVideos;
          }
        });
      }
    } catch (error) {
      console.error('Error fetching videos from Firestore:', error);
    }
  };

  useEffect(() => {
    fetchMoreVideos();
  }, []);

  const onScroll = (e) => {
    const { contentOffset } = e.nativeEvent;
    const windowHeight = Dimensions.get('window').height - 60;
    const currentIndex = Math.floor((contentOffset.y + 30) / windowHeight);

    if (currentIndex !== playingVideoIndex) {
      setPlayingVideoIndex(currentIndex);
    }
  };

  const handleLike = async (videoId) => {
    try {
      const videoDocRef = doc(db, 'posts', videoId);
      await updateDoc(videoDocRef, {
        likes: increment(1),
      });
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  return (
    <View style={{
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height - 60,
    }}>
      <FlatList
        data={videos}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <VideoPlayer
            name={item.name}
            subtitle={item.subtitle}
            videoUri={item.content}
            poster={item.poster}
            videoId={item.id}
            shouldPlay={index === playingVideoIndex && (!initialVideoPlayDelay || index !== 0)}
            onLike={() => handleLike(item.id)}
            likes={item.likes}
            views={item.views}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={fetchMoreVideos}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        windowSize={5}
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
