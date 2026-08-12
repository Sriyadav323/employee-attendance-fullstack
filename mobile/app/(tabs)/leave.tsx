import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Button,
  Field,
  Label,
  Screen,
} from "../../src/components/UI";

import {
  api,
  messageOf,
} from "../../src/services/api";

export default function Leave() {
  const [type, setType] = useState("Casual");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");

  const [fromError, setFromError] = useState("");
  const [toError, setToError] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [typeError, setTypeError] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  function isValidDate(value: string) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (!regex.test(value)) {
      return false;
    }

    const date = new Date(`${value}T00:00:00`);

    return !Number.isNaN(date.getTime());
  }

  async function submit() {
    // Clear previous messages
    setFromError("");
    setToError("");
    setReasonError("");
    setTypeError("");
    setMessage("");

    let valid = true;

    // ---------------------------
    // Leave Type Validation
    // ---------------------------

    const allowedTypes = [
      "Sick",
      "Casual",
      "Vacation",
      "Unpaid",
    ];

    if (!type.trim()) {
      setTypeError("Leave Type is required.");
      valid = false;
    } else if (!allowedTypes.includes(type.trim())) {
      setTypeError(
        "Leave Type must be Sick, Casual, Vacation, or Unpaid."
      );
      valid = false;
    }

    // ---------------------------
    // Required Date Validation
    // ---------------------------

    if (!from.trim()) {
      setFromError("From Date is required.");
      valid = false;
    } else if (!isValidDate(from.trim())) {
      setFromError(
        "Enter From Date in YYYY-MM-DD format."
      );
      valid = false;
    }

    if (!to.trim()) {
      setToError("To Date is required.");
      valid = false;
    } else if (!isValidDate(to.trim())) {
      setToError(
        "Enter To Date in YYYY-MM-DD format."
      );
      valid = false;
    }

    // ---------------------------
    // Reason Validation
    // ---------------------------

    if (!reason.trim()) {
      setReasonError("Reason is mandatory.");
      valid = false;
    }

    // ---------------------------
    // Date Business Validations
    // ---------------------------

    if (
      isValidDate(from.trim()) &&
      isValidDate(to.trim())
    ) {
      const fromDate = new Date(
        `${from.trim()}T00:00:00`
      );

      const toDate = new Date(
        `${to.trim()}T00:00:00`
      );

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      // Past From Date
      if (fromDate < today) {
        setFromError(
          "Past dates are not allowed."
        );
        valid = false;
      }

      // Past To Date
      if (toDate < today) {
        setToError(
          "Past dates are not allowed."
        );
        valid = false;
      }

      // From Date > To Date
      if (fromDate > toDate) {
        setFromError(
          "From Date should not exceed To Date."
        );
        valid = false;
      }
    }

    // Stop before API call
    if (!valid) {
      return;
    }

    // ---------------------------
    // API Call
    // ---------------------------

    try {
      setLoading(true);

      await api.post("/leaves", {
        leaveType: type.trim(),
        fromDate: from.trim(),
        toDate: to.trim(),
        reason: reason.trim(),
      });

      setMessage(
        "Leave request submitted successfully."
      );

      setFrom("");
      setTo("");
      setReason("");
      setType("Casual");
    } catch (error) {
      setMessage(messageOf(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ScrollView>
        <Text style={styles.heading}>
          Apply Leave
        </Text>

        {/* Leave Type */}

        <Label>
          Leave Type
        </Label>

        <Field
          value={type}
          onChangeText={(value: string) => {
            setType(value);
            setTypeError("");
          }}
          placeholder="Sick / Casual / Vacation / Unpaid"
        />

        {typeError ? (
          <Text style={styles.error}>
            {typeError}
          </Text>
        ) : null}

        {/* From Date */}

        <Label>
          From Date
        </Label>

        <Field
          value={from}
          onChangeText={(value: string) => {
            setFrom(value);
            setFromError("");
          }}
          placeholder="YYYY-MM-DD"
        />

        {fromError ? (
          <Text style={styles.error}>
            {fromError}
          </Text>
        ) : null}

        {/* To Date */}

        <Label>
          To Date
        </Label>

        <Field
          value={to}
          onChangeText={(value: string) => {
            setTo(value);
            setToError("");
          }}
          placeholder="YYYY-MM-DD"
        />

        {toError ? (
          <Text style={styles.error}>
            {toError}
          </Text>
        ) : null}

        {/* Reason */}

        <Label>
          Reason
        </Label>

        <Field
          value={reason}
          onChangeText={(value: string) => {
            setReason(value);
            setReasonError("");
          }}
          placeholder="Enter reason for leave"
          multiline
        />

        {reasonError ? (
          <Text style={styles.error}>
            {reasonError}
          </Text>
        ) : null}

        {/* Success / API Message */}

        {message ? (
          <View style={styles.messageBox}>
            <Text style={styles.message}>
              {message}
            </Text>
          </View>
        ) : null}

        <Button
          title="Submit Leave Request"
          onPress={submit}
          loading={loading}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: "white",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
  },

  error: {
    color: "#ff6b6b",
    fontSize: 14,
    marginTop: -5,
    marginBottom: 12,
  },

  messageBox: {
    marginVertical: 10,
    padding: 12,
    backgroundColor: "#161d31",
    borderRadius: 10,
  },

  message: {
    color: "white",
    fontSize: 14,
  },
});