import {
  primary,
  secondary,
  tintColorLight,
  tintColorDark
} from "@/constants/ThemeVariables";
import Foundation from "@expo/vector-icons/Foundation";
import { Tabs, router } from "expo-router";
import React from "react";
import { Button, Platform } from "react-native";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props) {
  return <Foundation size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: tintColorLight,
        tabBarActiveBackgroundColor: secondary,
        headerStyle: {
          backgroundColor: primary
        },
        headerTintColor: tintColorLight,
        headerTitleStyle: {
          fontWeight: "bold"
        },
        tabBarStyle: {
          backgroundColor: primary
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Posts",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Button
              title="Add New"
              color={Platform.OS === "ios" ? tintColorLight : tintColorDark}
              onPress={() => router.push("/post-modal")}
            />
          )
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="marker" color={color} />
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="torsos-all" color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="torso" color={color} />
        }}
      />
    </Tabs>
  );
}
