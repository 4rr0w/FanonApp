import React, { useState, useRef } from 'react';
import { FlatList, TouchableOpacity, View, Animated, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ItemCard from '../components/ItemCard';
import ImagePopUp from '../components/ImagePopUp';
import { items } from '../data/home';

const Home = () => {
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const navigation = useNavigation();
  
  const [data, setData] = useState(items);
  const flatListRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleImageClick = (item) => {
    if (item.type === 'img') {
      setOverlayVisible(true);
      setActiveImage([{ url: item.image }]);
    } else if (item.type === 'video') {
      navigation.navigate('Explore');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      }
      setRefreshing(false);
    }, 1000);
  };

  const handleEndReached = () => {
    setData((prevData) => [...prevData, ...items]);
  };

  return (
    <View
      style={{
        flex: 1,
        marginTop: 40,
        marginBottom: 80,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      
      <FlatList
        ref={flatListRef}
        contentContainerStyle={{ marginBottom: 20 }}
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleImageClick(item)} activeOpacity={0.9}>
            <ItemCard info={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      {isOverlayVisible && (
        <ImagePopUp
          activeImage={activeImage}
          setOverlayVisible={setOverlayVisible}
        />
      )}
    </View>
  );
};

export default Home;
