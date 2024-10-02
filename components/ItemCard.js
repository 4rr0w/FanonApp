import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import IconLabel from './IconLabel';

const iconColor = '#6c5ce7';

const ItemCard = ({ info }) => {
  const { name, subtitle, likes, views, image, type } = info;

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Image style={styles.imageStyle} source={{uri: image}} />
          <AntDesign name={type === 'img' ? "picture" : "playcircleo"} color="white" style={styles.iconStyle} />
        <View style={styles.infoStyle}>
          <Text style={styles.titleStyle}>{name}</Text>
          <Text style={styles.categoryStyle}>{subtitle}</Text>

          <View style={styles.iconLabelStyle}>
            <IconLabel name="heart" label={likes} color="red" />
            <IconLabel name="eye" label={views} color={iconColor} />
          </View>
        </View>
      </View>
    </View>
  );
};

const deviceWidth = Math.round(Dimensions.get('window').width);
const offset = 40;
const radius = 10;
const styles = StyleSheet.create({
  container: {
    width: deviceWidth - 20,
    alignItems: 'center',
    marginTop: 15,
  },
  cardContainer: {
    width: deviceWidth - offset,
    backgroundColor: '#faff00',
    height: 220,
    borderRadius: radius,
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 9,
    position: 'relative',
  },
  imageStyle: {
    height: 150,
    width: deviceWidth - offset,
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
    opacity: 0.9,
    alignContent: 'center',
    alignSelf: 'center',
  },
  titleStyle: {
    fontSize: 14,
    fontWeight: '800',
  },
  categoryStyle: {
    fontWeight: '200',
  },
  infoStyle: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  iconLabelStyle: {
    flexDirection: 'row',
    marginTop: 2,
    justifyContent: "space-between",
  },
   iconStyle: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    borderRadius: 4,
    fontSize: 16,
    padding: 2,
  },
});

export default ItemCard;