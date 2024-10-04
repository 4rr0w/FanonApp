import React, { useState, useRef, useEffect } from 'react';
import { Animated, FlatList, View, Dimensions, ActivityIndicator } from 'react-native';
import { Surface } from 'react-native-paper';
import { collection, getDocs, query, limit, startAfter } from 'firebase/firestore';
import db from '../config/firebase';
import ItemCard from '../components/ItemCard';
import Header from '../components/Header';

const CONTAINER_HEIGHT = 50;
const { width } = Dimensions.get('window'); 
const numColumns = Math.min(width >= 800 ? Math.floor(width / 400) : 1, 4);

const Home = ({ route, navigation }) => {
  const [feed, setFeed] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    fetchData();
  }, [numColumns]); // Fetch data when numColumns changes

  const calculateItemsToFetch = () => {
    const itemHeight = 300;
    const screenHeight = Dimensions.get('window').height;
    const itemsPerScreen = Math.floor(screenHeight / itemHeight) * numColumns;
    return Math.max(1, itemsPerScreen * 2); 
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const postsCollection = collection(db, 'posts');
      const postsQuery = query(postsCollection, limit(calculateItemsToFetch()));
      const querySnapshot = await getDocs(postsQuery);
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeed(postsData);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (error) {
      console.error('Error fetching Firestore data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreData = async () => {
    if (!lastVisible || loading) return;
    setLoading(true);
    try {
      const postsCollection = collection(db, 'posts');
      const nextPostsQuery = query(postsCollection, startAfter(lastVisible), limit(calculateItemsToFetch()));
      const querySnapshot = await getDocs(nextPostsQuery);
      const nextPostsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeed((prevFeed) => [...prevFeed, ...nextPostsData]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (error) {
      console.error('Error fetching more data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, CONTAINER_HEIGHT],
    outputRange: [0, -CONTAINER_HEIGHT],
    extrapolate: 'clamp',
  });

  const bottomTabTranslate = scrollY.interpolate({
    inputRange: [0, CONTAINER_HEIGHT],
    outputRange: [0, CONTAINER_HEIGHT * 2],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Animated.FlatList
        style={{ marginBottom: 65 }}
        ref={flatListRef}
        data={feed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemCard item={item} navigation={navigation} numColumns={numColumns} />}
        contentContainerStyle={{ paddingTop: CONTAINER_HEIGHT }}
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.7}
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false} 
      />
      <Animated.View
        style={{
          top: 0,
          transform: [{ translateY: headerTranslate }],
          position: 'absolute',
          left: 0,
          right: 0,
          height: CONTAINER_HEIGHT,
        }}
      >
        <Header title={route.name} right="search" />
      </Animated.View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

export default Home;
