import React, { useState, useRef, useEffect } from 'react';
import { FlatList, View, Dimensions, ActivityIndicator } from 'react-native';
import ItemCard from '../components/ItemCard';
import ImagePopUp from '../components/ImagePopUp';
import { collection, getDocs, query, limit, startAfter } from 'firebase/firestore';
import db from '../config/firebase';

const Home = () => {
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const flatListRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [feed, setFeed] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const { width } = Dimensions.get('window');
  const numColumns = Math.min(width >= 800 ? Math.floor(width / 400) : 1, 4);

  useEffect(() => {
    fetchData();
  }, []);

  const calculateItemsToFetch = (numColumns) => {
    const { width } = Dimensions.get('window');
    const itemWidth = 400; 
    const itemHeight = 300; 
    const screenHeight = Dimensions.get('window').height;
    const itemsPerScreen = Math.floor(screenHeight / itemHeight) * numColumns;
    return Math.max(1, itemsPerScreen*2);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const postsCollection = collection(db, 'posts');
      const postsQuery = query(postsCollection, limit(calculateItemsToFetch(numColumns)));
      const querySnapshot = await getDocs(postsQuery);
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFeed(postsData.filter(item => item.id));
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
      const nextPostsQuery = query(postsCollection, startAfter(lastVisible), limit(calculateItemsToFetch(numColumns)));
      const querySnapshot = await getDocs(nextPostsQuery);
      const nextPostsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Fetched nextPostsData:", nextPostsData);
      if (nextPostsData.length > 0) {
        setFeed((prevFeed) => [
          ...prevFeed,
          ...nextPostsData.filter(item => item.id),
        ]);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error('Error fetching more data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setLastVisible(null);
    fetchData();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, marginTop: 40, marginBottom: 80, justifyContent: 'center', alignItems: 'center' }}>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={{ marginBottom: 20 }}
        data={feed.filter(item => item)}
        renderItem={({ item }) => (
          <ItemCard info={item} setActiveImage={setActiveImage} setOverlayVisible={setOverlayVisible} />
        )}
        keyExtractor={() => Math.random().toString()}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.7}
      />
      {isOverlayVisible && (
        <ImagePopUp
          activeImage={activeImage}
          setOverlayVisible={setOverlayVisible}
        />
      )}
      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 20 }} />}
    </View>
  );
};

export default Home;
