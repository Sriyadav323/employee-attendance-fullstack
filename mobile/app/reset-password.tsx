import React, { useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  api,
  messageOf,
} from "../src/services/api";

export default function ResetPassword() {
  const params =
    useLocalSearchParams();

  const token =
    typeof params.token === "string"
      ? params.token
      : "";

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function submit() {
    setError("");
    setSuccess("");

    if (!token) {
      setError(
        "Invalid password reset link. Please request a new reset link."
      );

      return;
    }

    if (!password) {
      setError(
        "New password is required."
      );

      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );

      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError(
        "Password must contain at least one uppercase letter."
      );

      return;
    }

    if (!/[a-z]/.test(password)) {
      setError(
        "Password must contain at least one lowercase letter."
      );

      return;
    }

    if (!/[0-9]/.test(password)) {
      setError(
        "Password must contain at least one number."
      );

      return;
    }

    if (
      password !== confirmPassword
    ) {
      setError(
        "New Password and Confirm Password do not match."
      );

      return;
    }

    try {
      setLoading(true);

      const { data } =
        await api.post(
          "/auth/reset-password",
          {
            token,
            password,
          }
        );

      setSuccess(
        data?.message ||
          "Your password has been reset successfully."
      );

      setPassword("");
      setConfirmPassword("");
    } catch (e) {
      setError(
        messageOf(e)
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <LinearGradient
        colors={[
          "#EEF2FF",
          "#FDF2F8",
          "#EFF6FF",
        ]}
        style={styles.background}
      >
        <ScrollView
          contentContainerStyle={
            styles.scroll
          }
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <LinearGradient
              colors={[
                "#F3E8FF",
                "#FCE7F3",
              ]}
              style={
                styles.iconCircle
              }
            >
              <Text
                style={styles.icon}
              >
                🔐
              </Text>
            </LinearGradient>

            <Text
              style={styles.eyebrow}
            >
              ACCOUNT SECURITY
            </Text>

            <Text
              style={styles.title}
            >
              Create New Password
            </Text>

            <Text
              style={styles.subtitle}
            >
              Choose a strong password for your Employee Portal account.
            </Text>

            {!token ? (
              <View
                style={
                  styles.errorBox
                }
              >
                <Text
                  style={
                    styles.errorText
                  }
                >
                  This reset link is invalid. Please request a new password reset link.
                </Text>
              </View>
            ) : null}

            {!success ? (
              <>
                <Text
                  style={
                    styles.label
                  }
                >
                  New Password
                </Text>

                <View
                  style={
                    styles.passwordBox
                  }
                >
                  <TextInput
                    value={password}
                    onChangeText={(
                      value
                    ) => {
                      setPassword(
                        value
                      );

                      setError("");
                    }}
                    placeholder="Enter new password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={
                      !showPassword
                    }
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={
                      styles.passwordInput
                    }
                  />

                  <Pressable
                    onPress={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    style={
                      styles.showButton
                    }
                  >
                    <Text
                      style={
                        styles.showText
                      }
                    >
                      {showPassword
                        ? "Hide"
                        : "Show"}
                    </Text>
                  </Pressable>
                </View>

                <View
                  style={
                    styles.requirementBox
                  }
                >
                  <Text
                    style={
                      styles.requirementTitle
                    }
                  >
                    Password requirements
                  </Text>

                  <Text
                    style={
                      password.length >=
                      8
                        ? styles.validRequirement
                        : styles.requirement
                    }
                  >
                    {password.length >=
                    8
                      ? "✓"
                      : "•"}{" "}
                    At least 8 characters
                  </Text>

                  <Text
                    style={
                      /[A-Z]/.test(
                        password
                      )
                        ? styles.validRequirement
                        : styles.requirement
                    }
                  >
                    {/[A-Z]/.test(
                      password
                    )
                      ? "✓"
                      : "•"}{" "}
                    One uppercase letter
                  </Text>

                  <Text
                    style={
                      /[a-z]/.test(
                        password
                      )
                        ? styles.validRequirement
                        : styles.requirement
                    }
                  >
                    {/[a-z]/.test(
                      password
                    )
                      ? "✓"
                      : "•"}{" "}
                    One lowercase letter
                  </Text>

                  <Text
                    style={
                      /[0-9]/.test(
                        password
                      )
                        ? styles.validRequirement
                        : styles.requirement
                    }
                  >
                    {/[0-9]/.test(
                      password
                    )
                      ? "✓"
                      : "•"}{" "}
                    One number
                  </Text>
                </View>

                <Text
                  style={
                    styles.label
                  }
                >
                  Confirm Password
                </Text>

                <View
                  style={
                    styles.passwordBox
                  }
                >
                  <TextInput
                    value={
                      confirmPassword
                    }
                    onChangeText={(
                      value
                    ) => {
                      setConfirmPassword(
                        value
                      );

                      setError("");
                    }}
                    placeholder="Re-enter new password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={
                      !showConfirmPassword
                    }
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={
                      styles.passwordInput
                    }
                  />

                  <Pressable
                    onPress={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    style={
                      styles.showButton
                    }
                  >
                    <Text
                      style={
                        styles.showText
                      }
                    >
                      {showConfirmPassword
                        ? "Hide"
                        : "Show"}
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : null}

            {error ? (
              <View
                style={
                  styles.errorBox
                }
              >
                <Text
                  style={
                    styles.errorText
                  }
                >
                  {error}
                </Text>
              </View>
            ) : null}

            {success ? (
              <View
                style={
                  styles.successBox
                }
              >
                <Text
                  style={
                    styles.successIcon
                  }
                >
                  ✓
                </Text>

                <Text
                  style={
                    styles.successTitle
                  }
                >
                  Password Updated
                </Text>

                <Text
                  style={
                    styles.successText
                  }
                >
                  {success}
                </Text>
              </View>
            ) : null}

            {!success &&
            token ? (
              <Pressable
                onPress={submit}
                disabled={
                  loading
                }
                style={
                  styles.buttonWrapper
                }
              >
                <LinearGradient
                  colors={[
                    "#6D28D9",
                    "#A855F7",
                    "#EC4899",
                  ]}
                  style={
                    styles.button
                  }
                >
                  {loading ? (
                    <ActivityIndicator
                      color="#FFFFFF"
                    />
                  ) : (
                    <Text
                      style={
                        styles.buttonText
                      }
                    >
                      Reset Password
                    </Text>
                  )}
                </LinearGradient>
              </Pressable>
            ) : null}

            <Pressable
              onPress={() =>
                router.replace(
                  "/login"
                )
              }
              style={
                styles.backButton
              }
            >
              <Text
                style={
                  styles.backText
                }
              >
                {success
                  ? "Continue to Sign In →"
                  : "← Back to Sign In"}
              </Text>
            </Pressable>

            <Text
              style={
                styles.securityText
              }
            >
              🔒 Your password is securely encrypted and never stored as plain text.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles =
  StyleSheet.create({
    page: {
      flex: 1,
    },

    background: {
      flex: 1,
    },

    scroll: {
      flexGrow: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
      padding: 24,
    },

    card: {
      width: "100%",
      maxWidth: 520,
      backgroundColor:
        "#FFFFFF",
      borderRadius: 28,
      padding: 36,
      shadowColor:
        "#7C3AED",
      shadowOpacity: 0.12,
      shadowRadius: 25,
      elevation: 6,
    },

    iconCircle: {
      width: 76,
      height: 76,
      borderRadius: 38,
      justifyContent:
        "center",
      alignItems:
        "center",
      alignSelf:
        "center",
    },

    icon: {
      fontSize: 31,
    },

    eyebrow: {
      color: "#7C3AED",
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 1.2,
      textAlign: "center",
      marginTop: 18,
    },

    title: {
      color: "#0F172A",
      fontSize: 30,
      fontWeight: "800",
      textAlign: "center",
      marginTop: 5,
    },

    subtitle: {
      color: "#64748B",
      fontSize: 13,
      lineHeight: 20,
      textAlign: "center",
      marginTop: 8,
      marginBottom: 20,
    },

    label: {
      color: "#1E293B",
      fontSize: 13,
      fontWeight: "700",
      marginTop: 15,
      marginBottom: 7,
    },

    passwordBox: {
      minHeight: 54,
      borderWidth: 1,
      borderColor:
        "#D7DFEA",
      borderRadius: 12,
      backgroundColor:
        "#F8FAFC",
      flexDirection:
        "row",
      alignItems:
        "center",
      overflow: "hidden",
    },

    passwordInput: {
      flex: 1,
      minHeight: 52,
      paddingHorizontal: 15,
      color: "#0F172A",
      outlineStyle:
        "none" as any,
    },

    showButton: {
      minHeight: 52,
      paddingHorizontal: 16,
      justifyContent:
        "center",
      backgroundColor:
        "#FAF5FF",
    },

    showText: {
      color: "#7C3AED",
      fontWeight: "800",
      fontSize: 12,
    },

    requirementBox: {
      backgroundColor:
        "#F8FAFC",
      borderRadius: 10,
      padding: 12,
      marginTop: 10,
    },

    requirementTitle: {
      color: "#475569",
      fontSize: 11,
      fontWeight: "800",
      marginBottom: 5,
    },

    requirement: {
      color: "#94A3B8",
      fontSize: 10,
      marginTop: 3,
    },

    validRequirement: {
      color: "#059669",
      fontSize: 10,
      fontWeight: "700",
      marginTop: 3,
    },

    errorBox: {
      backgroundColor:
        "#FEF2F2",
      borderRadius: 10,
      padding: 12,
      marginTop: 16,
    },

    errorText: {
      color: "#B91C1C",
      fontSize: 12,
      fontWeight: "700",
      lineHeight: 18,
    },

    successBox: {
      backgroundColor:
        "#ECFDF5",
      borderRadius: 14,
      padding: 20,
      marginTop: 18,
      alignItems:
        "center",
    },

    successIcon: {
      color: "#FFFFFF",
      backgroundColor:
        "#059669",
      width: 40,
      height: 40,
      borderRadius: 20,
      textAlign:
        "center",
      lineHeight: 40,
      fontWeight: "800",
      fontSize: 20,
    },

    successTitle: {
      color: "#047857",
      fontWeight: "800",
      fontSize: 17,
      marginTop: 10,
    },

    successText: {
      color: "#047857",
      fontSize: 12,
      marginTop: 5,
      lineHeight: 18,
      textAlign:
        "center",
    },

    buttonWrapper: {
      marginTop: 22,
      borderRadius: 12,
      overflow: "hidden",
    },

    button: {
      minHeight: 54,
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    buttonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "800",
    },

    backButton: {
      alignItems:
        "center",
      marginTop: 18,
    },

    backText: {
      color: "#7C3AED",
      fontSize: 13,
      fontWeight: "800",
    },

    securityText: {
      color: "#94A3B8",
      fontSize: 10,
      lineHeight: 16,
      textAlign: "center",
      marginTop: 20,
    },
  });