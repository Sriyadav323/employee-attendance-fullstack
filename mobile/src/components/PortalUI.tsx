import React, {
  ReactNode,
  useEffect,
  useRef,
} from "react";

import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

export const colors = {
  purple: "#7C3AED",
  violet: "#8B5CF6",
  pink: "#EC4899",
  blue: "#2563EB",
  green: "#059669",
  orange: "#EA580C",

  background: "#F8FAFC",
  text: "#0F172A",
  secondary: "#64748B",

  border: "#E2E8F0",
  purpleLight: "#F5F3FF",
  pinkLight: "#FDF2F8",
  blueLight: "#EFF6FF",

  white: "#FFFFFF",
  error: "#DC2626",
};

export function PortalPage({
  children,
}: {
  children: ReactNode;
}) {
  const opacity =
    useRef(new Animated.Value(0)).current;

  const translateY =
    useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),

      Animated.spring(translateY, {
        toValue: 0,
        speed: 10,
        bounciness: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={[
        "#F5F3FF",
        "#FDF2F8",
        "#EFF6FF",
      ]}
      style={styles.page}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.pageContent}
      >
        <Animated.View
          style={{
            opacity,
            transform: [
              {
                translateY,
              },
            ],
          }}
        >
          {children}
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <View style={styles.pageHeader}>
      <View style={styles.headerText}>
        <Text style={styles.eyebrow}>
          {eyebrow}
        </Text>

        <Text style={styles.title}>
          {title}
        </Text>

        <Text style={styles.description}>
          {description}
        </Text>
      </View>

      <View style={styles.headerIcon}>
        <Text style={styles.headerEmoji}>
          {icon}
        </Text>
      </View>
    </View>
  );
}

export function PortalCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: any;
}) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

export function GradientButton({
  title,
  onPress,
  colors: buttonColors = [
    "#6D28D9",
    "#A855F7",
    "#EC4899",
  ],
  disabled,
}: {
  title: string;
  onPress: () => void;
  colors?: readonly [string, string, ...string[]];
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        opacity:
          disabled ? 0.55 : pressed ? 0.88 : 1,
      })}
    >
      <LinearGradient
        colors={buttonColors}
        start={{
          x: 0,
          y: 0,
        }}
        end={{
          x: 1,
          y: 0,
        }}
        style={styles.gradientButton}
      >
        <Text style={styles.buttonText}>
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },

  pageContent: {
    width: "100%",
    maxWidth: 1250,
    alignSelf: "center",

    padding: 28,
    paddingBottom: 55,
  },

  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 26,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    color: colors.purple,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.3,
  },

  title: {
    color: colors.text,
    fontSize: 31,
    fontWeight: "800",
    marginTop: 6,
  },

  description: {
    color: colors.secondary,
    fontSize: 14,
    marginTop: 7,
    lineHeight: 21,
  },

  headerIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,

    backgroundColor: colors.white,

    justifyContent: "center",
    alignItems: "center",

    shadowColor: colors.purple,
    shadowOpacity: 0.13,
    shadowRadius: 14,

    elevation: 3,
  },

  headerEmoji: {
    fontSize: 26,
  },

  card: {
    backgroundColor: colors.white,

    borderRadius: 22,

    padding: 22,

    borderWidth: 1,
    borderColor: "#F1F5F9",

    shadowColor: "#7C3AED",
    shadowOpacity: 0.07,
    shadowRadius: 14,

    elevation: 3,
  },

  gradientButton: {
    minHeight: 54,
    borderRadius: 13,

    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
  },
});