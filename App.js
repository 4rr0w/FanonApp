import React from 'react';
import { View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from "./src/screens/Home";
import Profile from "./src/screens/Profile";
import Explore from "./src/screens/Explore";
import MyCollection from "./src/screens/MyCollection";
import Settings from "./src/screens/Settings";
import Icon, { icons } from "./src/components/Icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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
            name="Home"
            component={Home}
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={styles.iconContainer}>
                  <Icon
                    icon={icons.AntDesign}  // Choose the icon set (AntDesign in this case)
                    name="home"
                    size={28}
                    color={focused ? "#faff00" : "#fff"}
                    accessibilityLabel="Home"
                  />
                </View>
              )
            }}
          />
          <Tab.Screen
            name="My Collection"
            component={MyCollection}
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={styles.iconContainer}>
                  <Icon
                    icon={icons.FontAwesome}
                    name="book"
                    size={28}
                    color={focused ? "#faff00" : "#fff"}
                    accessibilityLabel="My Collection"
                  />
                </View>
              )
            }}
          />
          <Tab.Screen
            name="Explore"
            component={Home}
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={styles.iconContainer}>
                  <Icon
                    icon={icons.AntDesign}
                    name="play"
                    size={28}
                    color={focused ? "#faff00" : "#fff"}
                    accessibilityLabel="Explore"
                  />
                </View>
              )
            }}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={styles.iconContainer}>
                  <Icon
                    icon={icons.AntDesign}
                    name="setting"
                    size={28}
                    color={focused ? "#faff00" : "#fff"}
                    accessibilityLabel="Settings"
                  />
                </View>
              )
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={styles.iconContainer}>
                  <Icon
                    icon={icons.AntDesign}
                    name="user"
                    size={28}
                    color={focused ? "#faff00" : "#fff"}
                    accessibilityLabel="Profile"
                  />
                </View>
              )
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
