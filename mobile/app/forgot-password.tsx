import React, { useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import {
  api,
  messageOf,
} from "../src/services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setEmailError("");
    setMessage("");
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setEmailError("Email address is required.");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post(
        "/auth/forgot-password",
        {
          email: cleanEmail,
        }
      );

      setMessage(
        data?.message ||
          "If an account exists for this email, password reset instructions have been sent."
      );
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={[
        "#EEF2FF",
        "#FDF2F8",
        "#EFF6FF",
      ]}
      style={styles.page}
    >
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>🔐</Text>
        </View>

        <Text style={styles.title}>
          Forgot Password?
        </Text>

        <Text style={styles.subtitle}>
          Enter the email address associated with your employee account.
          We'll send you a secure password reset link.
        </Text>

        <Text style={styles.label}>
          Email Address
        </Text>

        <TextInput
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setEmailError("");
            setError("");
          }}
          placeholder="name@company.com"
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          autoCapitalize="none"
          style={[
            styles.input,
            emailError && styles.inputError,
          ]}
        />

        {emailError ? (
          <Text style={styles.errorText}>
            {emailError}
          </Text>
        ) : null}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>
              {error}
            </Text>
          </View>
        ) : null}

        {message ? (
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>
              ✓ Check your email
            </Text>

            <Text style={styles.successText}>
              {message}
            </Text>
          </View>
        ) : null}

        <Pressable
          onPress={submit}
          disabled={loading}
          style={styles.buttonWrapper}
        >
          <LinearGradient
            colors={[
              "#6D28D9",
              "#A855F7",
              "#EC4899",
            ]}
            style={styles.button}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                Send Reset Link
              </Text>
            )}
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/login")}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ← Back to Sign In
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  card: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 36,
    shadowColor: "#7C3AED",
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 5,
  },

  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  icon: {
    fontSize: 31,
  },

  title: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 20,
  },

  subtitle: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 9,
    marginBottom: 22,
  },

  label: {
    color: "#1E293B",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
  },

  input: {
    minHeight: 53,
    borderWidth: 1,
    borderColor: "#D7DFEA",
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 15,
    color: "#0F172A",
  },

  inputError: {
    borderColor: "#DC2626",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 5,
  },

  errorBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    padding: 12,
    marginTop: 15,
  },

  errorBoxText: {
    color: "#B91C1C",
    fontSize: 12,
  },

  successBox: {
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },

  successTitle: {
    color: "#047857",
    fontWeight: "800",
    fontSize: 13,
  },

  successText: {
    color: "#047857",
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },

  buttonWrapper: {
    marginTop: 22,
    borderRadius: 12,
    overflow: "hidden",
  },

  button: {
    minHeight: 54,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  backButton: {
    alignItems: "center",
    marginTop: 18,
  },

  backText: {
    color: "#7C3AED",
    fontSize: 13,
    fontWeight: "800",
  },
});
