import React from "react";

import {
  StyleSheet,
  Text,
  useWindowDimensions,
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
  const { width } = useWindowDimensions();
  const desktop = width >= 900;

  const { user } =
    useAuth();

  const isAdmin =
    user?.role ===
    "admin";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarPosition: desktop ? "left" : "bottom",

        tabBarLabelPosition: desktop ? "beside-icon" : "below-icon",

        tabBarActiveTintColor:
          "#FFFFFF",

        tabBarInactiveTintColor:
          "#DDD6FE",

        tabBarStyle: {
          backgroundColor:
            "#5B21B6",

          borderTopWidth: 0,

          height: desktop ? "100%" : 82,

          width: desktop ? 238 : undefined,

          borderRightWidth: desktop ? 1 : 0,

          borderRightColor: "rgba(255,255,255,0.12)",

          paddingTop: desktop ? 28 : 8,

          paddingBottom: desktop ? 22 : 9,

          paddingHorizontal: desktop ? 14 : 0,

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

          marginTop: desktop ? 0 : 2,

          textAlign: "left",
        },

        tabBarItemStyle: desktop
          ? {
              flex: 0,
              height: 58,
              borderRadius: 14,
              marginBottom: 5,
              paddingHorizontal: 7,
            }
          : undefined,
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
        name="notifications"
        options={{
          title: "Alerts",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🔔" focused={focused} />
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

      <Tabs.Screen
        name="employees"
        options={{
          title: "Employees",
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👥" focused={focused} />
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
