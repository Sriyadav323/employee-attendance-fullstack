import React, { useState } from "react";

import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import {
  colors,
  GradientButton,
  PageHeader,
  PortalCard,
  PortalPage,
} from "../../src/components/PortalUI";

import {
  api,
  messageOf,
} from "../../src/services/api";

const leaveTypes = [
  {
    name: "Casual",
    icon: "☕",
  },
  {
    name: "Sick",
    icon: "🤒",
  },
  {
    name: "Vacation",
    icon: "🏖️",
  },
  {
    name: "Unpaid",
    icon: "📋",
  },
];

export default function Leave() {
  const [type, setType] = useState("Casual");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");

  const [showFromPicker, setShowFromPicker] =
    useState(false);

  const [showToPicker, setShowToPicker] =
    useState(false);

  const [fromError, setFromError] =
    useState("");

  const [toError, setToError] =
    useState("");

  const [reasonError, setReasonError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  function todayString() {
    return new Date()
      .toISOString()
      .slice(0, 10);
  }

  function formatDate(date: Date) {
    return date
      .toISOString()
      .slice(0, 10);
  }

  async function submit() {
    setFromError("");
    setToError("");
    setReasonError("");
    setMessage("");

    let valid = true;

    if (!from) {
      setFromError(
        "From Date is required."
      );
      valid = false;
    }

    if (!to) {
      setToError(
        "To Date is required."
      );
      valid = false;
    }

    if (!reason.trim()) {
      setReasonError(
        "Reason is mandatory."
      );
      valid = false;
    }

    if (from && from < todayString()) {
      setFromError(
        "Past dates are not allowed."
      );
      valid = false;
    }

    if (to && to < todayString()) {
      setToError(
        "Past dates are not allowed."
      );
      valid = false;
    }

    if (from && to && from > to) {
      setFromError(
        "From Date should not exceed To Date."
      );
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      setLoading(true);

      await api.post("/leaves", {
        leaveType: type,
        fromDate: from,
        toDate: to,
        reason: reason.trim(),
      });

      setMessage(
        "Leave request submitted successfully."
      );

      setType("Casual");
      setFrom("");
      setTo("");
      setReason("");
    } catch (error) {
      setMessage(
        messageOf(error)
      );
    } finally {
      setLoading(false);
    }
  }

  function renderWebDateInput(
    value: string,
    minimumDate: string,
    error: string,
    onChange: (value: string) => void
  ) {
    return React.createElement(
      "input",
      {
        type: "date",

        value,

        min: minimumDate,

        onChange: (
          event: any
        ) => {
          onChange(
            event.target.value
          );
        },

        style: {
          width: "100%",
          height: "52px",

          boxSizing:
            "border-box",

          borderRadius:
            "12px",

          border: error
            ? "1px solid #DC2626"
            : "1px solid #E2E8F0",

          backgroundColor:
            "#F8FAFC",

          padding:
            "0 15px",

          fontSize:
            "14px",

          color:
            "#0F172A",

          outline:
            "none",

          cursor:
            "pointer",
        },
      }
    );
  }

  return (
    <PortalPage>
      <PageHeader
        eyebrow="LEAVE MANAGEMENT"
        title="Plan your time away"
        description="Submit and manage leave requests with a simple guided experience."
        icon="🌴"
      />

      <PortalCard>
        <Text
          style={
            styles.sectionTitle
          }
        >
          Select Leave Type
        </Text>

        <View
          style={
            styles.typeGrid
          }
        >
          {leaveTypes.map(
            (item) => {
              const active =
                type ===
                item.name;

              return (
                <Pressable
                  key={
                    item.name
                  }
                  onPress={() =>
                    setType(
                      item.name
                    )
                  }
                  style={[
                    styles.typeCard,

                    active &&
                      styles.typeCardActive,
                  ]}
                >
                  <Text
                    style={
                      styles.typeEmoji
                    }
                  >
                    {item.icon}
                  </Text>

                  <Text
                    style={[
                      styles.typeName,

                      active &&
                        styles.typeNameActive,
                    ]}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              );
            }
          )}
        </View>

        <View
          style={
            styles.formRow
          }
        >
          {/* FROM DATE */}

          <View
            style={
              styles.fieldColumn
            }
          >
            <Text
              style={
                styles.label
              }
            >
              From Date
            </Text>

            {Platform.OS ===
            "web" ? (
              renderWebDateInput(
                from,
                todayString(),
                fromError,
                (
                  value
                ) => {
                  setFrom(
                    value
                  );

                  setFromError(
                    ""
                  );

                  if (
                    to &&
                    value >
                      to
                  ) {
                    setTo("");
                  }
                }
              )
            ) : (
              <>
                <Pressable
                  onPress={() =>
                    setShowFromPicker(
                      true
                    )
                  }
                  style={[
                    styles.dateField,

                    fromError &&
                      styles.inputError,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateText,

                      !from &&
                        styles.datePlaceholder,
                    ]}
                  >
                    {from ||
                      "Select From Date"}
                  </Text>

                  <Text
                    style={
                      styles.calendarIcon
                    }
                  >
                    📅
                  </Text>
                </Pressable>

                {showFromPicker ? (
                  <DateTimePicker
                    value={
                      from
                        ? new Date(
                            `${from}T00:00:00`
                          )
                        : new Date()
                    }
                    mode="date"
                    minimumDate={
                      new Date()
                    }
                    onChange={(
                      _,
                      selectedDate
                    ) => {
                      setShowFromPicker(
                        false
                      );

                      if (
                        selectedDate
                      ) {
                        const value =
                          formatDate(
                            selectedDate
                          );

                        setFrom(
                          value
                        );

                        setFromError(
                          ""
                        );

                        if (
                          to &&
                          value >
                            to
                        ) {
                          setTo(
                            ""
                          );
                        }
                      }
                    }}
                  />
                ) : null}
              </>
            )}

            {fromError ? (
              <Text
                style={
                  styles.error
                }
              >
                {fromError}
              </Text>
            ) : null}
          </View>

          {/* TO DATE */}

          <View
            style={
              styles.fieldColumn
            }
          >
            <Text
              style={
                styles.label
              }
            >
              To Date
            </Text>

            {Platform.OS ===
            "web" ? (
              renderWebDateInput(
                to,
                from ||
                  todayString(),
                toError,
                (
                  value
                ) => {
                  setTo(
                    value
                  );

                  setToError(
                    ""
                  );
                }
              )
            ) : (
              <>
                <Pressable
                  onPress={() =>
                    setShowToPicker(
                      true
                    )
                  }
                  style={[
                    styles.dateField,

                    toError &&
                      styles.inputError,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateText,

                      !to &&
                        styles.datePlaceholder,
                    ]}
                  >
                    {to ||
                      "Select To Date"}
                  </Text>

                  <Text
                    style={
                      styles.calendarIcon
                    }
                  >
                    📅
                  </Text>
                </Pressable>

                {showToPicker ? (
                  <DateTimePicker
                    value={
                      to
                        ? new Date(
                            `${to}T00:00:00`
                          )
                        : new Date()
                    }
                    mode="date"
                    minimumDate={
                      from
                        ? new Date(
                            `${from}T00:00:00`
                          )
                        : new Date()
                    }
                    onChange={(
                      _,
                      selectedDate
                    ) => {
                      setShowToPicker(
                        false
                      );

                      if (
                        selectedDate
                      ) {
                        setTo(
                          formatDate(
                            selectedDate
                          )
                        );

                        setToError(
                          ""
                        );
                      }
                    }}
                  />
                ) : null}
              </>
            )}

            {toError ? (
              <Text
                style={
                  styles.error
                }
              >
                {toError}
              </Text>
            ) : null}
          </View>
        </View>

        {/* REASON */}

        <Text
          style={
            styles.label
          }
        >
          Reason
        </Text>

        <TextInput
          value={reason}
          onChangeText={(
            value
          ) => {
            setReason(
              value
            );

            setReasonError(
              ""
            );
          }}
          multiline
          placeholder="Tell us briefly why you are requesting leave..."
          placeholderTextColor="#94A3B8"
          style={[
            styles.input,
            styles.reason,

            reasonError &&
              styles.inputError,
          ]}
        />

        {reasonError ? (
          <Text
            style={
              styles.error
            }
          >
            {reasonError}
          </Text>
        ) : null}

        <View
          style={
            styles.button
          }
        >
          <GradientButton
            title={
              loading
                ? "Submitting..."
                : "Submit Leave Request"
            }
            disabled={
              loading
            }
            onPress={
              submit
            }
          />
        </View>

        {message ? (
          <View
            style={
              styles.message
            }
          >
            <Text
              style={
                styles.messageText
              }
            >
              {message}
            </Text>
          </View>
        ) : null}
      </PortalCard>
    </PortalPage>
  );
}

const styles =
  StyleSheet.create({
    sectionTitle: {
      color:
        colors.text,

      fontSize: 16,

      fontWeight:
        "800",

      marginBottom: 14,
    },

    typeGrid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      gap: 12,
    },

    typeCard: {
      flex: 1,

      minWidth: 130,

      padding: 16,

      borderRadius: 15,

      backgroundColor:
        "#F8FAFC",

      borderWidth: 1,

      borderColor:
        "#E2E8F0",

      alignItems:
        "center",
    },

    typeCardActive: {
      backgroundColor:
        colors.purpleLight,

      borderColor:
        colors.purple,
    },

    typeEmoji: {
      fontSize: 27,
    },

    typeName: {
      color:
        colors.secondary,

      fontWeight:
        "700",

      marginTop: 7,
    },

    typeNameActive: {
      color:
        colors.purple,
    },

    formRow: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      gap: 15,

      marginTop: 25,
    },

    fieldColumn: {
      flex: 1,

      minWidth: 250,
    },

    label: {
      color:
        colors.text,

      fontSize: 13,

      fontWeight:
        "700",

      marginTop: 18,

      marginBottom: 7,
    },

    dateField: {
      minHeight: 52,

      borderRadius: 12,

      borderWidth: 1,

      borderColor:
        colors.border,

      backgroundColor:
        "#F8FAFC",

      paddingHorizontal:
        15,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },

    dateText: {
      color:
        colors.text,

      fontSize: 14,

      fontWeight:
        "600",
    },

    datePlaceholder: {
      color:
        "#94A3B8",

      fontWeight:
        "400",
    },

    calendarIcon: {
      fontSize: 19,
    },

    input: {
      borderWidth: 1,

      borderColor:
        colors.border,

      backgroundColor:
        "#F8FAFC",

      borderRadius: 12,

      minHeight: 52,

      paddingHorizontal:
        15,

      color:
        colors.text,

      outlineStyle:
        "none" as any,
    },

    reason: {
      minHeight: 115,

      paddingTop: 14,

      textAlignVertical:
        "top",
    },

    inputError: {
      borderColor:
        colors.error,
    },

    error: {
      color:
        colors.error,

      fontSize: 12,

      marginTop: 5,
    },

    button: {
      marginTop: 24,
    },

    message: {
      backgroundColor:
        colors.purpleLight,

      padding: 13,

      borderRadius: 12,

      marginTop: 15,
    },

    messageText: {
      color:
        colors.purple,

      textAlign:
        "center",

      fontWeight:
        "700",
    },
  });