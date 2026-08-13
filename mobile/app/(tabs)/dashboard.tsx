import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  LinearGradient,
} from "expo-linear-gradient";

import {
  router,
  useFocusEffect,
} from "expo-router";

import {
  useAuth,
} from "../../src/context/AuthContext";

import {
  api,
} from "../../src/services/api";

import {
  colors,
  PortalCard,
  PortalPage,
} from "../../src/components/PortalUI";

type TodayAttendance = {
  _id?: string;
  attendanceDate?: string;
  checkInAt?: string;
  checkOutAt?: string;
  totalWorkingHours?: number;
};

export default function Dashboard() {
  const { user } = useAuth();

  const [todayAttendance, setTodayAttendance] =
    useState<TodayAttendance | null>(null);

  const [loadingStatus, setLoadingStatus] =
    useState(true);

  const fade =
    useRef(new Animated.Value(0)).current;

  const slide =
    useRef(new Animated.Value(18)).current;

  function todayString() {
    return new Date()
      .toISOString()
      .slice(0, 10);
  }

  const loadTodayAttendance =
    useCallback(async () => {
      try {
        setLoadingStatus(true);

        const today = todayString();

        const { data } = await api.get(
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
          records.length > 0
            ? records[0]
            : null
        );
      } catch (error) {
        console.log(
          "Unable to load today's attendance",
          error
        );

        setTodayAttendance(null);
      } finally {
        setLoadingStatus(false);
      }
    }, []);

  /*
   * IMPORTANT:
   * Runs every time Dashboard becomes active.
   * If employee checks in and comes back Home,
   * Dashboard immediately requests fresh status.
   */
  useFocusEffect(
    useCallback(() => {
      loadTodayAttendance();
    }, [loadTodayAttendance])
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),

      Animated.spring(slide, {
        toValue: 0,
        speed: 10,
        bounciness: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  function attendanceStatus() {
    if (loadingStatus) {
      return {
        text: "Checking...",
        color: "#64748B",
        icon: "⏳",
      };
    }

    if (!todayAttendance) {
      return {
        text: "Not checked in",
        color: "#2563EB",
        icon: "⏰",
      };
    }

    if (
      todayAttendance.checkInAt &&
      todayAttendance.checkOutAt
    ) {
      return {
        text: "Completed",
        color: "#059669",
        icon: "✅",
      };
    }

    if (todayAttendance.checkInAt) {
      return {
        text: "Checked in",
        color: "#059669",
        icon: "🟢",
      };
    }

    return {
      text: "Not checked in",
      color: "#2563EB",
      icon: "⏰",
    };
  }

  const status =
    attendanceStatus();

  return (
    <PortalPage>
      <Animated.View
        style={{
          opacity: fade,

          transform: [
            {
              translateY:
                slide,
            },
          ],
        }}
      >
        {/* HERO */}

        <LinearGradient
          colors={[
            "#6D28D9",
            "#8B5CF6",
            "#EC4899",
          ]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={
            styles.hero
          }
        >
          <View
            style={
              styles.heroCircleOne
            }
          />

          <View
            style={
              styles.heroCircleTwo
            }
          />

          <View>
            <Text
              style={
                styles.heroSmall
              }
            >
              TODAY'S OVERVIEW
            </Text>

            <Text
              style={
                styles.heroTitle
              }
            >
              Have a productive day!
            </Text>

            <Text
              style={
                styles.heroDescription
              }
            >
              Track your attendance,
              manage leave and stay
              updated from your
              employee workspace.
            </Text>
          </View>

          <Text
            style={
              styles.heroEmoji
            }
          >
            ✨
          </Text>
        </LinearGradient>

        {/* QUICK OVERVIEW */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Quick Overview
        </Text>

        <View
          style={
            styles.overviewGrid
          }
        >
          <SummaryCard
            icon="🪪"
            label="Employee ID"
            value={
              user?.employeeId ||
              "—"
            }
            valueColor="#7C3AED"
            background="#F5F3FF"
          />

          <SummaryCard
            icon={status.icon}
            label="Today's Attendance"
            value={status.text}
            valueColor={
              status.color
            }
            background="#EFF6FF"
          />

          <SummaryCard
            icon="🌴"
            label="Leave Balance"
            value={`${
              user?.leaveBalance ??
              0
            } days`}
            valueColor="#DB2777"
            background="#FDF2F8"
          />
        </View>

        {/* ATTENDANCE DETAILS */}

        {todayAttendance?.checkInAt ? (
          <PortalCard
            style={
              styles.todayCard
            }
          >
            <View
              style={
                styles.todayHeader
              }
            >
              <View>
                <Text
                  style={
                    styles.todayTitle
                  }
                >
                  Today's Attendance
                </Text>

                <Text
                  style={
                    styles.todaySubtitle
                  }
                >
                  Your current workday
                  activity
                </Text>
              </View>

              <View
                style={
                  styles.statusPill
                }
              >
                <Text
                  style={
                    styles.statusPillText
                  }
                >
                  {todayAttendance.checkOutAt
                    ? "✓ Completed"
                    : "● Checked In"}
                </Text>
              </View>
            </View>

            <View
              style={
                styles.timeGrid
              }
            >
              <TimeItem
                label="Check In"
                value={formatTime(
                  todayAttendance.checkInAt
                )}
                icon="🟢"
              />

              <TimeItem
                label="Check Out"
                value={
                  todayAttendance.checkOutAt
                    ? formatTime(
                        todayAttendance.checkOutAt
                      )
                    : "Not yet"
                }
                icon="🔵"
              />

              <TimeItem
                label="Working Hours"
                value={
                  todayAttendance.checkOutAt
                    ? `${
                        todayAttendance.totalWorkingHours?.toFixed(
                          2
                        ) || "0.00"
                      } hrs`
                    : "In progress"
                }
                icon="⏱️"
              />
            </View>
          </PortalCard>
        ) : null}

        {/* QUICK ACTIONS */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Quick Actions
        </Text>

        <View
          style={styles.actions}
        >
          <ActionCard
            icon="📍"
            title={
              todayAttendance?.checkInAt
                ? "Attendance"
                : "Check In"
            }
            description={
              todayAttendance?.checkInAt
                ? todayAttendance.checkOutAt
                  ? "Today's attendance completed"
                  : "You're currently checked in"
                : "Record today's attendance"
            }
            color="#7C3AED"
            onPress={() =>
              router.push(
                "/(tabs)/attendance"
              )
            }
          />

          <ActionCard
            icon="📅"
            title="Apply Leave"
            description="Submit a new leave request"
            color="#DB2777"
            onPress={() =>
              router.push(
                "/(tabs)/leave"
              )
            }
          />

          <ActionCard
            icon="📊"
            title="View History"
            description="Review attendance records"
            color="#2563EB"
            onPress={() =>
              router.push(
                "/(tabs)/history"
              )
            }
          />

          <ActionCard
            icon="👤"
            title="My Profile"
            description="View employee information"
            color="#EA580C"
            onPress={() =>
              router.push(
                "/(tabs)/profile"
              )
            }
          />
        </View>

        <PortalCard
          style={
            styles.reminder
          }
        >
          <Text
            style={
              styles.reminderIcon
            }
          >
            💡
          </Text>

          <View>
            <Text
              style={
                styles.reminderTitle
              }
            >
              Attendance Reminder
            </Text>

            <Text
              style={
                styles.reminderText
              }
            >
              {todayAttendance?.checkOutAt
                ? "Your attendance for today is complete."
                : todayAttendance?.checkInAt
                ? "Remember to check out when you finish your workday."
                : "Remember to check in when you begin your workday."}
            </Text>
          </View>
        </PortalCard>
      </Animated.View>
    </PortalPage>
  );
}

function formatTime(
  value?: string
) {
  if (!value) {
    return "—";
  }

  return new Date(
    value
  ).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function SummaryCard({
  icon,
  label,
  value,
  valueColor,
  background,
}: {
  icon: string;
  label: string;
  value: string;
  valueColor: string;
  background: string;
}) {
  return (
    <View
      style={[
        styles.summaryCard,
        {
          backgroundColor:
            background,
        },
      ]}
    >
      <View
        style={
          styles.summaryIcon
        }
      >
        <Text
          style={{
            fontSize: 21,
          }}
        >
          {icon}
        </Text>
      </View>

      <View>
        <Text
          style={
            styles.summaryLabel
          }
        >
          {label}
        </Text>

        <Text
          style={[
            styles.summaryValue,
            {
              color:
                valueColor,
            },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function TimeItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View
      style={
        styles.timeItem
      }
    >
      <Text
        style={
          styles.timeIcon
        }
      >
        {icon}
      </Text>

      <View>
        <Text
          style={
            styles.timeLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            styles.timeValue
          }
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function ActionCard({
  icon,
  title,
  description,
  color,
  onPress,
}: {
  icon: string;
  title: string;
  description: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({
        pressed,
      }) => [
        styles.actionCard,

        pressed && {
          opacity: 0.85,

          transform: [
            {
              scale: 0.99,
            },
          ],
        },
      ]}
    >
      <View
        style={[
          styles.actionIcon,
          {
            backgroundColor:
              `${color}15`,
          },
        ]}
      >
        <Text
          style={{
            fontSize: 21,
          }}
        >
          {icon}
        </Text>
      </View>

      <View
        style={
          styles.actionContent
        }
      >
        <Text
          style={
            styles.actionTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            styles.actionDescription
          }
        >
          {description}
        </Text>
      </View>

      <Text
        style={[
          styles.arrow,
          {
            color,
          },
        ]}
      >
        ›
      </Text>
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    hero: {
      borderRadius: 26,

      padding: 30,

      minHeight: 170,

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

      overflow: "hidden",
    },

    heroCircleOne: {
      position: "absolute",

      width: 220,
      height: 220,

      borderRadius: 110,

      backgroundColor:
        "rgba(255,255,255,0.08)",

      right: -60,

      top: -100,
    },

    heroCircleTwo: {
      position: "absolute",

      width: 130,
      height: 130,

      borderRadius: 65,

      backgroundColor:
        "rgba(255,255,255,0.07)",

      right: 150,

      bottom: -80,
    },

    heroSmall: {
      color: "#EDE9FE",

      fontSize: 11,

      fontWeight: "800",

      letterSpacing: 1.4,
    },

    heroTitle: {
      color: "#FFFFFF",

      fontSize: 30,

      fontWeight: "800",

      marginTop: 9,
    },

    heroDescription: {
      color: "#F5F3FF",

      fontSize: 14,

      marginTop: 10,
    },

    heroEmoji: {
      fontSize: 60,

      marginRight: 35,
    },

    sectionTitle: {
      color: colors.text,

      fontSize: 20,

      fontWeight: "800",

      marginTop: 28,

      marginBottom: 14,
    },

    overviewGrid: {
      flexDirection: "row",

      flexWrap: "wrap",

      gap: 16,
    },

    summaryCard: {
      flex: 1,

      minWidth: 220,

      padding: 20,

      borderRadius: 20,

      flexDirection: "row",

      alignItems: "center",
    },

    summaryIcon: {
      width: 48,
      height: 48,

      borderRadius: 14,

      backgroundColor:
        "rgba(255,255,255,0.65)",

      justifyContent:
        "center",

      alignItems: "center",

      marginRight: 14,
    },

    summaryLabel: {
      color:
        colors.secondary,

      fontSize: 12,

      fontWeight: "600",
    },

    summaryValue: {
      fontSize: 18,

      fontWeight: "800",

      marginTop: 5,
    },

    todayCard: {
      marginTop: 22,
    },

    todayHeader: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",
    },

    todayTitle: {
      color:
        colors.text,

      fontSize: 17,

      fontWeight: "800",
    },

    todaySubtitle: {
      color:
        colors.secondary,

      fontSize: 12,

      marginTop: 4,
    },

    statusPill: {
      paddingHorizontal: 12,

      paddingVertical: 7,

      borderRadius: 999,

      backgroundColor:
        "#ECFDF5",
    },

    statusPillText: {
      color: "#059669",

      fontSize: 11,

      fontWeight: "800",
    },

    timeGrid: {
      flexDirection: "row",

      flexWrap: "wrap",

      gap: 30,

      marginTop: 20,
    },

    timeItem: {
      flexDirection: "row",

      alignItems: "center",

      minWidth: 180,
    },

    timeIcon: {
      fontSize: 19,

      marginRight: 10,
    },

    timeLabel: {
      color:
        colors.secondary,

      fontSize: 11,
    },

    timeValue: {
      color:
        colors.text,

      fontSize: 14,

      fontWeight: "800",

      marginTop: 3,
    },

    actions: {
      flexDirection: "row",

      flexWrap: "wrap",

      gap: 16,
    },

    actionCard: {
      flexBasis: "48%",

      flexGrow: 1,

      minWidth: 280,

      backgroundColor:
        "#FFFFFF",

      borderRadius: 20,

      padding: 18,

      flexDirection: "row",

      alignItems: "center",
    },

    actionIcon: {
      width: 50,

      height: 50,

      borderRadius: 15,

      justifyContent:
        "center",

      alignItems: "center",
    },

    actionContent: {
      flex: 1,

      marginLeft: 14,
    },

    actionTitle: {
      color:
        colors.text,

      fontSize: 15,

      fontWeight: "800",
    },

    actionDescription: {
      color:
        colors.secondary,

      fontSize: 12,

      marginTop: 4,
    },

    arrow: {
      fontSize: 30,
    },

    reminder: {
      marginTop: 30,

      flexDirection: "row",

      alignItems: "center",
    },

    reminderIcon: {
      fontSize: 23,

      marginRight: 15,
    },

    reminderTitle: {
      color:
        colors.text,

      fontSize: 14,

      fontWeight: "800",
    },

    reminderText: {
      color:
        colors.secondary,

      fontSize: 12,

      marginTop: 4,
    },
  });