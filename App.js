import React from 'react';
import { View, Text } from "react-native";
import BottomBar from "./components/BottomBar";
import { SafeAreaProvider } from 'react-native-safe-area-context'; 
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import Explore from "./screens/Explore";
import MyCollection from "./screens/MyCollection";
import Settings from "./screens/Settings";
import AntDesign from '@expo/vector-icons/AntDesign';
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
    backgroundColor: "black"
  }
}

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen 
          name="Home" 
          component={Home}
          options={{
            tabBarIcon: ({ focused }) => 
              <View style={{
                alignItems: "center",
                justifyContent: "center",
              }}>  
                <AntDesign name="home" size={28} style={{ color: focused ? "#faff00" : "#fff" }} />
              </View>
            }
          }
        />
        <Tab.Screen 
          name="My Collection" 
          component={MyCollection}
          options={{
            tabBarIcon: ({ focused }) => 
              <View style={{
                alignItems: "center",
                justifyContent: "center",
              }}>  
                <AntDesign name="book" size={28} style={{ color: focused ? "#faff00" : "#fff" }} />
              </View>
            }
          }
        />
        <Tab.Screen 
          name="Explore" 
          component={Explore} 
          options={{
            tabBarIcon: ({ focused }) => 
              <View style={{
                alignItems: "center",
                justifyContent: "center",
              }}>  
                <AntDesign name="playcircleo" size={28} style={{ color: focused ? "#faff00" : "#fff" }} />
              </View>
            }
          }
        />
        <Tab.Screen 
          name="Settings" 
          component={Settings}
          options={{
            tabBarIcon: ({ focused }) => 
              <View style={{
                alignItems: "center",
                justifyContent: "center",
              }}>  
                <AntDesign name="setting" size={28} style={{ color: focused ? "#faff00" : "#fff" }} />
              </View>
            }
          }
        />
        <Tab.Screen 
          name="Profile" 
          component={Profile}
          options={{
            tabBarIcon: ({ focused }) => 
              <View style={{
                alignItems: "center",
                justifyContent: "center",
              }}>  
                <AntDesign name="user" size={28} style={{ color: focused ? "#faff00" : "#fff" }} />
              </View>
            }
          }
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
