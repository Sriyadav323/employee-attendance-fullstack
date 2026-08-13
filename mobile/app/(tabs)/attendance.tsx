import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useFocusEffect,
} from "expo-router";

import * as Location from "expo-location";

import NetInfo from "@react-native-community/netinfo";

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

type TodayAttendance = {
  _id?: string;
  attendanceDate?: string;
  checkInAt?: string;
  checkOutAt?: string;
  totalWorkingHours?: number;
};

export default function Attendance() {
  const [online, setOnline] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [
    loadingStatus,
    setLoadingStatus,
  ] = useState(true);

  const [
    todayAttendance,
    setTodayAttendance,
  ] =
    useState<TodayAttendance | null>(
      null
    );

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    messageType,
    setMessageType,
  ] =
    useState<
      "success" | "error" | "info"
    >("info");

  const [
    locationText,
    setLocationText,
  ] = useState(
    "Location will be captured automatically"
  );

  const pulse =
    useRef(
      new Animated.Value(1)
    ).current;

  function todayString() {
    return new Date()
      .toISOString()
      .slice(0, 10);
  }

  const loadTodayAttendance =
    useCallback(async () => {
      try {
        setLoadingStatus(true);

        const today =
          todayString();

        const { data } =
          await api.get(
            "/attendance/history",
            {
              params: {
                from: today,
                to: today,
              },
            }
          );

        const records =
          Array.isArray(data)
            ? data
            : [];

        setTodayAttendance(
          records.length
            ? records[0]
            : null
        );
      } catch (error) {
        console.log(
          "Attendance status error",
          error
        );
      } finally {
        setLoadingStatus(false);
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      loadTodayAttendance();
    }, [loadTodayAttendance])
  );

  useEffect(() => {
    const unsubscribe =
      NetInfo.addEventListener(
        (state) => {
          setOnline(
            Boolean(
              state.isConnected
            )
          );
        }
      );

    const animation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            pulse,
            {
              toValue: 1.1,

              duration: 900,

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            pulse,
            {
              toValue: 1,

              duration: 900,

              useNativeDriver:
                true,
            }
          ),
        ])
      );

    animation.start();

    return () => {
      unsubscribe();
      animation.stop();
    };
  }, []);

  const checkedIn =
    Boolean(
      todayAttendance?.checkInAt
    );

  const checkedOut =
    Boolean(
      todayAttendance?.checkOutAt
    );

  async function getLocation() {
    const permission =
      await Location.requestForegroundPermissionsAsync();

    if (
      permission.status !==
      "granted"
    ) {
      throw new Error(
        "Location permission is required to mark attendance."
      );
    }

    const location =
      await Location.getCurrentPositionAsync(
        {
          accuracy:
            Location.Accuracy.Balanced,
        }
      );

    const latitude =
      location.coords.latitude;

    const longitude =
      location.coords.longitude;

    // Defensive GPS validation
    if (
      !Number.isFinite(
        latitude
      ) ||
      latitude < -90 ||
      latitude > 90
    ) {
      throw new Error(
        "Invalid latitude received from device."
      );
    }

    if (
      !Number.isFinite(
        longitude
      ) ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new Error(
        "Invalid longitude received from device."
      );
    }

    setLocationText(
      `${latitude.toFixed(
        5
      )}, ${longitude.toFixed(
        5
      )}`
    );

    return {
      latitude,
      longitude,
    };
  }

  async function checkIn() {
    setMessage("");

    if (!online) {
      setMessageType("error");

      setMessage(
        "You are offline. Connect to the internet before checking in."
      );

      return;
    }

    if (loading) {
      return;
    }

    if (checkedIn) {
      setMessageType("info");

      setMessage(
        checkedOut
          ? "Today's attendance is already completed."
          : "You have already checked in today."
      );

      return;
    }

    try {
      setLoading(true);

      const location =
        await getLocation();

      await api.post(
        "/attendance/check-in",
        location
      );

      await loadTodayAttendance();

      setMessageType(
        "success"
      );

      setMessage(
        "Checked in successfully."
      );
    } catch (error) {
      setMessageType("error");

      setMessage(
        messageOf(error)
      );
    } finally {
      setLoading(false);
    }
  }

  async function checkOut() {
    setMessage("");

    if (!online) {
      setMessageType("error");

      setMessage(
        "You are offline. Connect to the internet before checking out."
      );

      return;
    }

    if (loading) {
      return;
    }

    if (!checkedIn) {
      setMessageType("error");

      setMessage(
        "You must check in before checking out."
      );

      return;
    }

    if (checkedOut) {
      setMessageType("info");

      setMessage(
        "You have already checked out today."
      );

      return;
    }

    try {
      setLoading(true);

      const location =
        await getLocation();

      await api.post(
        "/attendance/check-out",
        location
      );

      await loadTodayAttendance();

      setMessageType(
        "success"
      );

      setMessage(
        "Checked out successfully."
      );
    } catch (error) {
      setMessageType("error");

      setMessage(
        messageOf(error)
      );
    } finally {
      setLoading(false);
    }
  }

  function statusText() {
    if (loadingStatus) {
      return "Loading attendance status...";
    }

    if (checkedOut) {
      return "Today's attendance is complete";
    }

    if (checkedIn) {
      return "You are currently checked in";
    }

    return "Ready to start your day?";
  }

  return (
    <PortalPage>
      <PageHeader
        eyebrow="ATTENDANCE"
        title="Mark your attendance"
        description="Your location is securely captured when you check in or check out."
        icon="📍"
      />

      <View style={styles.grid}>
        <PortalCard
          style={
            styles.statusCard
          }
        >
          <Text
            style={
              styles.cardLabel
            }
          >
            NETWORK STATUS
          </Text>

          <Text
            style={[
              styles.networkStatus,

              {
                color: online
                  ? "#059669"
                  : "#DC2626",
              },
            ]}
          >
            {online
              ? "● Online"
              : "● Offline"}
          </Text>
        </PortalCard>

        <PortalCard
          style={
            styles.locationCard
          }
        >
          <Text
            style={
              styles.cardLabel
            }
          >
            CURRENT LOCATION
          </Text>

          <Text
            style={
              styles.locationValue
            }
          >
            {locationText}
          </Text>

          <Text
            style={
              styles.locationDescription
            }
          >
            Latitude and longitude
            are captured
            automatically from
            your device.
          </Text>
        </PortalCard>
      </View>

      <PortalCard
        style={
          styles.mainCard
        }
      >
        <View
          style={
            styles.center
          }
        >
          <Animated.View
            style={[
              styles.pulseOuter,

              {
                transform: [
                  {
                    scale:
                      pulse,
                  },
                ],
              },
            ]}
          >
            <View
              style={
                styles.pulseInner
              }
            >
              <Text
                style={
                  styles.pin
                }
              >
                {checkedOut
                  ? "✅"
                  : checkedIn
                  ? "🟢"
                  : "📍"}
              </Text>
            </View>
          </Animated.View>

          <Text
            style={
              styles.statusTitle
            }
          >
            {statusText()}
          </Text>

          <Text
            style={
              styles.statusDescription
            }
          >
            {checkedOut
              ? "Your check-in and check-out have been recorded."
              : checkedIn
              ? "Remember to check out when you finish your workday."
              : "Attendance is recorded with timestamp and GPS location."}
          </Text>
        </View>

        <View
          style={
            styles.buttonGap
          }
        >
          <GradientButton
            title={
              loading
                ? "Processing..."
                : checkedIn
                ? "Already Checked In"
                : "Check In"
            }
            disabled={
              loading ||
              checkedIn ||
              !online
            }
            onPress={checkIn}
          />

          <GradientButton
            title={
              loading
                ? "Processing..."
                : checkedOut
                ? "Already Checked Out"
                : "Check Out"
            }
            disabled={
              loading ||
              !checkedIn ||
              checkedOut ||
              !online
            }
            colors={[
              "#2563EB",
              "#3B82F6",
              "#06B6D4",
            ]}
            onPress={checkOut}
          />
        </View>

        {message ? (
          <View
            style={[
              styles.message,

              messageType ===
                "success" &&
                styles.successMessage,

              messageType ===
                "error" &&
                styles.errorMessage,

              messageType ===
                "info" &&
                styles.infoMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,

                messageType ===
                  "success" &&
                  styles.successText,

                messageType ===
                  "error" &&
                  styles.errorText,

                messageType ===
                  "info" &&
                  styles.infoText,
              ]}
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
    grid: {
      flexDirection: "row",

      flexWrap: "wrap",

      gap: 16,
    },

    statusCard: {
      flex: 1,

      minWidth: 280,
    },

    locationCard: {
      flex: 2,

      minWidth: 300,
    },

    cardLabel: {
      color:
        colors.secondary,

      fontSize: 11,

      fontWeight: "800",

      letterSpacing: 1,
    },

    networkStatus: {
      fontSize: 18,

      fontWeight: "800",

      marginTop: 8,
    },

    locationValue: {
      color:
        colors.text,

      fontSize: 18,

      fontWeight: "800",

      marginTop: 8,
    },

    locationDescription: {
      color:
        colors.secondary,

      fontSize: 12,

      marginTop: 5,
    },

    mainCard: {
      marginTop: 22,
    },

    center: {
      alignItems: "center",

      marginVertical: 25,
    },

    pulseOuter: {
      width: 120,

      height: 120,

      borderRadius: 60,

      backgroundColor:
        "#EDE9FE",

      justifyContent:
        "center",

      alignItems: "center",
    },

    pulseInner: {
      width: 82,

      height: 82,

      borderRadius: 41,

      backgroundColor:
        "#DDD6FE",

      justifyContent:
        "center",

      alignItems: "center",
    },

    pin: {
      fontSize: 37,
    },

    statusTitle: {
      color:
        colors.text,

      fontSize: 23,

      fontWeight: "800",

      marginTop: 24,
    },

    statusDescription: {
      color:
        colors.secondary,

      fontSize: 13,

      marginTop: 8,

      textAlign: "center",
    },

    buttonGap: {
      gap: 13,
    },

    message: {
      marginTop: 18,

      borderRadius: 12,

      padding: 14,
    },

    successMessage: {
      backgroundColor:
        "#ECFDF5",
    },

    errorMessage: {
      backgroundColor:
        "#FEF2F2",
    },

    infoMessage: {
      backgroundColor:
        "#F5F3FF",
    },

    messageText: {
      fontWeight: "700",

      textAlign: "center",

      fontSize: 13,
    },

    successText: {
      color: "#047857",
    },

    errorText: {
      color: "#DC2626",
    },

    infoText: {
      color: "#7C3AED",
    },
  });