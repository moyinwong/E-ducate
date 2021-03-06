// React, React Native
import React from "react";
import { View, Text } from 'react-native';

// Navigation
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

// Icons
import {
  FontAwesome,
  MaterialIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";

// Routes
import HomeStack from "../stacks/homeStack";
import SubjectStack from "../stacks/subjectStack";
import CartStack from "../stacks/cartStack";
import MyCoursesStack from "../stacks/myCoursesStack";

import CartIcon from '../../sharedComponents/cartIcon';

export default function BottomTap() {
  const Tab = createMaterialBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#e96a43"
      inactiveColor="#a5aebf"
      barStyle={{
        backgroundColor: "#ffffff",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: "首頁",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Subject"
        children={SubjectStack}
        options={{
          tabBarLabel: "科目",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="subject" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        children={CartStack}
        options={{
          tabBarLabel: "購物車",
          tabBarIcon: ({ color }) => (
            <CartIcon color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyCourses"
        children={MyCoursesStack}
        options={{
          tabBarLabel: "我的課程",
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-school" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
