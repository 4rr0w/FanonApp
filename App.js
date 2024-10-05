import React from 'react';
import { View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from "./src/screens/Home";
import Profile from "./src/screens/Profile";
import Explore from "./src/screens/Explore";
import MyCollection from "./src/screens/MyCollection";
import Settings from "./src/screens/Settings";
import Icon from 'react-native-vector-icons/AntDesign';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 60,
    backgroundColor: "black",
  }
}

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <NavigationContainer>
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen
            name="My Collection"
            component={MyCollection}
            options={{
              tabBarIcon: ({ focused }) =>
                <View style={styles.iconContainer}>
                  <Icon
                    name="book"
                    size={28}
                    style={{ color: focused ? "#faff00" : "#fff" }}
                    accessibilityLabel="My Collection"
                  />
                </View>
            }}
          />

          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{
              tabBarIcon: ({ focused }) =>
                <View style={styles.iconContainer}>
                  <Icon
                    name="setting"
                    size={28}
                    style={{ color: focused ? "#faff00" : "#fff" }}
                    accessibilityLabel="Settings"
                  />
                </View>
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarIcon: ({ focused }) =>
                <View style={styles.iconContainer}>
                  <Icon
                    name="user"
                    size={28}
                    style={{ color: focused ? "#faff00" : "#fff" }}
                    accessibilityLabel="Profile"
                  />
                </View>
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
