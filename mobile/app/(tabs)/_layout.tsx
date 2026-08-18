import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Tabs } from "expo-router";

import { useAuth } from "../../src/context/AuthContext";

function TabIcon({
  icon,
  focused,
}: {
  icon: string;
  focused: boolean;
}) {
  return (
    <View
      style={[
        styles.iconBox,

        focused &&
          styles.iconBoxActive,
      ]}
    >
      <Text
        style={
          styles.icon
        }
      >
        {icon}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { user } =
    useAuth();

  const isAdmin =
    user?.role ===
    "admin";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor:
          "#FFFFFF",

        tabBarInactiveTintColor:
          "#DDD6FE",

        tabBarStyle: {
          backgroundColor:
            "#5B21B6",

          borderTopWidth: 0,

          height: 82,

          paddingTop: 8,

          paddingBottom: 9,

          shadowColor:
            "#4C1D95",

          shadowOpacity:
            0.28,

          shadowRadius:
            18,

          elevation: 15,
        },

        tabBarLabelStyle: {
          fontSize: 12,

          fontWeight:
            "700",

          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",

          tabBarIcon: ({
            focused,
          }) => (
            <TabIcon
              icon="🏠"
              focused={
                focused
              }
            />
          ),
        }}
      />

      <Tabs.Screen
        name="attendance"
        options={{
          title:
            "Attendance",

          tabBarIcon: ({
            focused,
          }) => (
            <TabIcon
              icon="📍"
              focused={
                focused
              }
            />
          ),
        }}
      />

      <Tabs.Screen
        name="leave"
        options={{
          title:
            "Apply Leave",

          tabBarIcon: ({
            focused,
          }) => (
            <TabIcon
              icon="📅"
              focused={
                focused
              }
            />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",

          tabBarIcon: ({
            focused,
          }) => (
            <TabIcon
              icon="📊"
              focused={
                focused
              }
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({
            focused,
          }) => (
            <TabIcon
              icon="👤"
              focused={
                focused
              }
            />
          ),
        }}
      />

      <Tabs.Screen
        name="admin"
        options={{
          title:
            "Approvals",

          href:
            isAdmin
              ? undefined
              : null,

          tabBarIcon: ({
            focused,
          }) => (
            <TabIcon
              icon="🛡️"
              focused={
                focused
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles =
  StyleSheet.create({
    iconBox: {
      width: 42,

      height: 34,

      borderRadius: 12,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    iconBoxActive: {
      backgroundColor:
        "rgba(255,255,255,0.22)",

      shadowColor:
        "#FFFFFF",

      shadowOpacity:
        0.22,

      shadowRadius: 8,
    },

    icon: {
      fontSize: 19,
    },
  });