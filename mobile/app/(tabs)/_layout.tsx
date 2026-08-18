import React, { useEffect, useState } from "react";

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

const sidebarTips = [
  {
    icon: "⏰",
    eyebrow: "ATTENDANCE TIP",
    title: "Start your day on time",
    message: "Check in when your workday begins so your attendance stays accurate.",
  },
  {
    icon: "🌴",
    eyebrow: "LEAVE PLANNING",
    title: "Plan ahead",
    message: "Submit upcoming leave early to give your team enough time to prepare.",
  },
  {
    icon: "🔔",
    eyebrow: "STAY UPDATED",
    title: "Review your alerts",
    message: "Important approval and attendance updates will appear in your Alerts page.",
  },
  {
    icon: "👥",
    eyebrow: "ADMIN QUICK TIP",
    title: "Keep roles current",
    message: "Use Employees to review team members and maintain the correct access roles.",
  },
];

function SidebarBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % sidebarTips.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const tip = sidebarTips[index];

  return (
    <View pointerEvents="none" style={styles.sidebarBanner}>
      <View style={styles.bannerIconBox}>
        <Text style={styles.bannerIcon}>{tip.icon}</Text>
      </View>
      <Text style={styles.bannerEyebrow}>{tip.eyebrow}</Text>
      <Text style={styles.bannerTitle}>{tip.title}</Text>
      <Text style={styles.bannerMessage}>{tip.message}</Text>
      <View style={styles.bannerDots}>
        {sidebarTips.map((_, dotIndex) => (
          <View
            key={dotIndex}
            style={[
              styles.bannerDot,
              dotIndex === index && styles.bannerDotActive,
            ]}
          />
        ))}
      </View>
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

        tabBarVariant: desktop ? "material" : "uikit",

        tabBarLabelPosition: desktop ? "beside-icon" : "below-icon",

        tabBarActiveTintColor:
          "#FFFFFF",

        tabBarInactiveTintColor:
          "#DDD6FE",

        tabBarActiveBackgroundColor: desktop
          ? "rgba(255,255,255,0.16)"
          : "transparent",

        tabBarBackground: desktop
          ? () => <SidebarBanner />
          : undefined,

        tabBarStyle: {
          backgroundColor:
            "#5B21B6",

          borderTopWidth: 0,

          height: desktop ? "100%" : 82,

          width: desktop ? 238 : undefined,

          borderRightWidth: desktop ? 1 : 0,

          borderRightColor: "rgba(255,255,255,0.12)",

          paddingTop: desktop ? 24 : 8,

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

          lineHeight: 18,
        },

        tabBarItemStyle: desktop
          ? {
              flex: 0,
              width: "100%",
              minHeight: 54,
              borderRadius: 14,
              marginBottom: 7,
              paddingHorizontal: 10,
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

    sidebarBanner: {
      position: "absolute",
      left: 16,
      right: 16,
      bottom: 24,
      borderRadius: 18,
      padding: 17,
      backgroundColor: "rgba(255,255,255,0.13)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
    },

    bannerIconBox: {
      width: 40,
      height: 40,
      borderRadius: 13,
      backgroundColor: "rgba(255,255,255,0.16)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 13,
    },

    bannerIcon: {
      fontSize: 20,
    },

    bannerEyebrow: {
      color: "#DDD6FE",
      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 1,
    },

    bannerTitle: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "800",
      lineHeight: 19,
      marginTop: 6,
    },

    bannerMessage: {
      color: "#EDE9FE",
      fontSize: 10,
      lineHeight: 16,
      marginTop: 7,
    },

    bannerDots: {
      flexDirection: "row",
      gap: 5,
      marginTop: 15,
    },

    bannerDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: "rgba(255,255,255,0.3)",
    },

    bannerDotActive: {
      width: 17,
      backgroundColor: "#FFFFFF",
    },
  });
