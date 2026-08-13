import React, {
  useState,
} from "react";

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

import {
  LinearGradient,
} from "expo-linear-gradient";

import {
  router,
} from "expo-router";

import {
  api,
  messageOf,
} from "../src/services/api";

export default function Register() {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [
    department,
    setDepartment,
  ] = useState("");

  const [phone, setPhone] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  function validate() {
    setError("");

    if (!name.trim()) {
      setError(
        "Full name is required."
      );

      return false;
    }

    if (
      name.trim().length < 2
    ) {
      setError(
        "Please enter a valid full name."
      );

      return false;
    }

    if (!email.trim()) {
      setError(
        "Email address is required."
      );

      return false;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
    ) {
      setError(
        "Please enter a valid email address."
      );

      return false;
    }

    if (
      !department.trim()
    ) {
      setError(
        "Department is required."
      );

      return false;
    }

    if (
      phone &&
      !/^[0-9+\-\s()]{7,20}$/.test(
        phone
      )
    ) {
      setError(
        "Please enter a valid phone number."
      );

      return false;
    }

    if (!password) {
      setError(
        "Password is required."
      );

      return false;
    }

    if (
      password.length < 8
    ) {
      setError(
        "Password must contain at least 8 characters."
      );

      return false;
    }

    if (
      !/[A-Z]/.test(
        password
      )
    ) {
      setError(
        "Password must contain at least one uppercase letter."
      );

      return false;
    }

    if (
      !/[a-z]/.test(
        password
      )
    ) {
      setError(
        "Password must contain at least one lowercase letter."
      );

      return false;
    }

    if (
      !/[0-9]/.test(
        password
      )
    ) {
      setError(
        "Password must contain at least one number."
      );

      return false;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Password and Confirm Password do not match."
      );

      return false;
    }

    return true;
  }

  async function submit() {
    setSuccess("");

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const { data } =
        await api.post(
          "/auth/register",
          {
            name:
              name.trim(),

            email:
              email
                .trim()
                .toLowerCase(),

            department:
              department.trim(),

            phone:
              phone.trim(),

            password,
          }
        );

      setSuccess(
        data?.message ||
          "Registration submitted successfully. Your account is waiting for administrator approval."
      );

      setName("");
      setEmail("");
      setDepartment("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(
        messageOf(error)
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={
        Platform.OS ===
        "ios"
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
          <View
            style={
              styles.card
            }
          >
            <View
              style={
                styles.iconCircle
              }
            >
              <Text
                style={
                  styles.icon
                }
              >
                👤
              </Text>
            </View>

            <Text
              style={
                styles.eyebrow
              }
            >
              EMPLOYEE REGISTRATION
            </Text>

            <Text
              style={
                styles.title
              }
            >
              Create your account
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Submit your information to request access to the Employee Portal.
            </Text>

            <View
              style={
                styles.notice
              }
            >
              <Text
                style={
                  styles.noticeIcon
                }
              >
                🔐
              </Text>

              <Text
                style={
                  styles.noticeText
                }
              >
                Your account will remain pending until the administrator approves your access.
              </Text>
            </View>

            <Text
              style={
                styles.label
              }
            >
              Full Name *
            </Text>

            <TextInput
              value={name}
              onChangeText={
                setName
              }
              placeholder="Enter full name"
              placeholderTextColor="#94A3B8"
              style={
                styles.input
              }
            />

            <Text
              style={
                styles.label
              }
            >
              Email Address *
            </Text>

            <TextInput
              value={email}
              onChangeText={
                setEmail
              }
              placeholder="name@company.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={
                false
              }
              style={
                styles.input
              }
            />

            <Text
              style={
                styles.label
              }
            >
              Department *
            </Text>

            <TextInput
              value={
                department
              }
              onChangeText={
                setDepartment
              }
              placeholder="Example: Engineering"
              placeholderTextColor="#94A3B8"
              style={
                styles.input
              }
            />

            <Text
              style={
                styles.label
              }
            >
              Phone Number
            </Text>

            <TextInput
              value={phone}
              onChangeText={
                setPhone
              }
              placeholder="Enter phone number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              style={
                styles.input
              }
            />

            <Text
              style={
                styles.label
              }
            >
              Password *
            </Text>

            <TextInput
              value={
                password
              }
              onChangeText={
                setPassword
              }
              placeholder="Minimum 8 characters"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              autoCapitalize="none"
              style={
                styles.input
              }
            />

            <Text
              style={
                styles.passwordHelp
              }
            >
              Use at least 8 characters with uppercase, lowercase and a number.
            </Text>

            <Text
              style={
                styles.label
              }
            >
              Confirm Password *
            </Text>

            <TextInput
              value={
                confirmPassword
              }
              onChangeText={
                setConfirmPassword
              }
              placeholder="Re-enter your password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              autoCapitalize="none"
              style={
                styles.input
              }
            />

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
                    styles.successTitle
                  }
                >
                  ✓ Request Submitted
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

            <Pressable
              onPress={submit}
              disabled={
                loading
              }
              style={
                styles.submitWrapper
              }
            >
              <LinearGradient
                colors={[
                  "#6D28D9",
                  "#A855F7",
                  "#EC4899",
                ]}
                style={
                  styles.submitButton
                }
              >
                {loading ? (
                  <ActivityIndicator
                    color="#FFFFFF"
                  />
                ) : (
                  <Text
                    style={
                      styles.submitText
                    }
                  >
                    Request Access
                  </Text>
                )}
              </LinearGradient>
            </Pressable>

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
                ← Back to Sign In
              </Text>
            </Pressable>
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

      padding: 30,
    },

    card: {
      width: "100%",

      maxWidth: 600,

      backgroundColor:
        "#FFFFFF",

      borderRadius: 28,

      padding: 36,

      shadowColor:
        "#7C3AED",

      shadowOpacity: 0.1,

      shadowRadius: 25,

      elevation: 5,
    },

    iconCircle: {
      width: 72,

      height: 72,

      borderRadius: 36,

      backgroundColor:
        "#F3E8FF",

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
      color:
        "#7C3AED",

      fontSize: 11,

      fontWeight:
        "800",

      letterSpacing:
        1.3,

      textAlign:
        "center",

      marginTop: 18,
    },

    title: {
      color:
        "#0F172A",

      fontSize: 30,

      fontWeight:
        "800",

      textAlign:
        "center",

      marginTop: 6,
    },

    subtitle: {
      color:
        "#64748B",

      fontSize: 13,

      textAlign:
        "center",

      lineHeight: 20,

      marginTop: 8,
    },

    notice: {
      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "#F5F3FF",

      borderRadius: 12,

      padding: 13,

      marginTop: 20,
    },

    noticeIcon: {
      fontSize: 18,

      marginRight: 9,
    },

    noticeText: {
      flex: 1,

      color:
        "#6D28D9",

      fontSize: 12,

      lineHeight: 18,

      fontWeight:
        "600",
    },

    label: {
      color:
        "#1E293B",

      fontSize: 13,

      fontWeight:
        "700",

      marginTop: 16,

      marginBottom: 6,
    },

    input: {
      minHeight: 52,

      borderWidth: 1,

      borderColor:
        "#D7DFEA",

      borderRadius: 12,

      backgroundColor:
        "#F8FAFC",

      paddingHorizontal: 15,

      color:
        "#0F172A",

      outlineStyle:
        "none" as any,
    },

    passwordHelp: {
      color:
        "#94A3B8",

      fontSize: 10,

      marginTop: 5,
    },

    errorBox: {
      backgroundColor:
        "#FEF2F2",

      padding: 12,

      borderRadius: 10,

      marginTop: 18,
    },

    errorText: {
      color:
        "#B91C1C",

      fontSize: 12,

      fontWeight:
        "700",
    },

    successBox: {
      backgroundColor:
        "#ECFDF5",

      padding: 14,

      borderRadius: 12,

      marginTop: 18,
    },

    successTitle: {
      color:
        "#047857",

      fontSize: 13,

      fontWeight:
        "800",
    },

    successText: {
      color:
        "#047857",

      fontSize: 12,

      marginTop: 4,

      lineHeight: 18,
    },

    submitWrapper: {
      marginTop: 23,

      borderRadius: 12,

      overflow:
        "hidden",
    },

    submitButton: {
      minHeight: 54,

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    submitText: {
      color:
        "#FFFFFF",

      fontSize: 15,

      fontWeight:
        "800",
    },

    backButton: {
      marginTop: 18,

      alignItems:
        "center",
    },

    backText: {
      color:
        "#7C3AED",

      fontSize: 13,

      fontWeight:
        "800",
    },
  });