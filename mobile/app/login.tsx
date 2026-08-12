import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import {
  Button,
  Field,
  Screen,
} from "../src/components/UI";

import { useAuth } from "../src/context/AuthContext";
import { messageOf } from "../src/services/api";

export default function Login() {
  const [email, setEmail] = useState("employee@company.com");
  const [password, setPassword] = useState("Password123");
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { login } = useAuth();

  async function submit() {
    // Clear previous errors
    setEmailError("");
    setPasswordError("");

    let isValid = true;

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    // Password validation
    if (password.length < 8) {
      setPasswordError(
        "Password must be at least 8 characters."
      );
      isValid = false;
    }

    // Stop login if validation fails
    if (!isValid) {
      return;
    }

    try {
      setLoading(true);

      await login(email.trim(), password);

      router.replace("/(tabs)/dashboard");
    } catch (error) {
      Alert.alert(
        "Login failed",
        messageOf(error)
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View>
        <Text style={styles.title}>
          Employee Attendance
        </Text>

        <Text style={styles.sub}>
          Sign in to manage attendance and leave.
        </Text>

        <Field
          label="Email"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setEmailError("");
          }}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {emailError ? (
          <Text style={styles.error}>
            {emailError}
          </Text>
        ) : null}

        <Field
          label="Password"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setPasswordError("");
          }}
          secureTextEntry
        />

        {passwordError ? (
          <Text style={styles.error}>
            {passwordError}
          </Text>
        ) : null}

        <Button
          title={loading ? "Signing In..." : "Sign In"}
          onPress={submit}
          disabled={loading}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 100,
  },

  sub: {
    color: "#9aa4bb",
    marginVertical: 18,
    fontSize: 16,
  },

  error: {
    color: "#ff5c5c",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
});