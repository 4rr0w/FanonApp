import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

const IconLabel = ({ name, label, color, size = 14, textColor="black" }) => {
  return (
    <View style={styles.container}>
      <AntDesign
        name={name}
        type="ionicon"
        size={size}
        color={color}
        style={styles.iconStyle}
      />
      <Text style={{...styles.labelStyle, color: textColor, fontSize: size}} >{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: "center",
  },
  labelStyle: {
    fontSize: 12,
  },
  iconStyle: {
    marginTop : 2,
    marginRight: 5,
  },
});

export default IconLabel;