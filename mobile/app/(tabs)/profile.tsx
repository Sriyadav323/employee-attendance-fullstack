import React, { useEffect, useState } from "react";

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import {
  colors,
  GradientButton,
  PortalCard,
  PortalPage,
} from "../../src/components/PortalUI";

import {
  api,
  messageOf,
} from "../../src/services/api";

import { useAuth } from "../../src/context/AuthContext";

export default function Profile() {
  const {
    user,
    logout,
    setUser,
  } = useAuth();

  const [phone, setPhone] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  useEffect(() => {
    if (user) {
      setPhone(user.phone || "");
      setProfilePicture(
        user.profilePicture || ""
      );
    }
  }, [user]);

  async function save() {
    try {
      setLoading(true);
      setMessage("");

      const { data } = await api.patch(
        "/profile",
        {
          phone,
          profilePicture,
        }
      );

      setUser(data);

      setMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      setMessage(
        messageOf(error)
      );
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await logout();

    router.replace("/login");
  }

  return (
    <PortalPage>
      {/* TOP HEADER */}

      <View style={styles.topHeader}>
        <View style={styles.headerTextArea}>
          <Text style={styles.eyebrow}>
            MY PROFILE
          </Text>

          <Text style={styles.pageTitle}>
            Employee profile
          </Text>

          <Text style={styles.pageDescription}>
            Manage your personal information and account details.
          </Text>
        </View>

        {/* CLICKABLE TOP-RIGHT PROFILE ICON */}

        <View style={styles.topRightArea}>
          <Pressable
            onPress={() =>
              setShowProfileMenu(
                !showProfileMenu
              )
            }
            style={({ pressed }) => [
              styles.topProfileButton,
              pressed &&
                styles.topProfileButtonPressed,
            ]}
          >
            <Text
              style={
                styles.topProfileIcon
              }
            >
              👤
            </Text>
          </Pressable>

          {/* PROFILE DROPDOWN */}

          {showProfileMenu ? (
            <View
              style={
                styles.topProfileDropdown
              }
            >
              <View
                style={
                  styles.dropdownHeader
                }
              >
                <View
                  style={
                    styles.smallAvatar
                  }
                >
                  {profilePicture ? (
                    <Image
                      source={{
                        uri: profilePicture,
                      }}
                      style={
                        styles.smallAvatarImage
                      }
                    />
                  ) : (
                    <Text
                      style={
                        styles.smallAvatarText
                      }
                    >
                      👤
                    </Text>
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={
                      styles.dropdownName
                    }
                  >
                    {user?.name ||
                      "Employee"}
                  </Text>

                  <Text
                    style={
                      styles.dropdownEmployeeId
                    }
                  >
                    {user?.employeeId ||
                      "—"}
                  </Text>
                </View>
              </View>

              <View
                style={
                  styles.dropdownDivider
                }
              />

              <DropdownItem
                icon="✉️"
                label="Email"
                value={
                  user?.email || "—"
                }
              />

              <DropdownItem
                icon="🏢"
                label="Department"
                value={
                  user?.department ||
                  "—"
                }
              />

              <DropdownItem
                icon="📞"
                label="Phone"
                value={
                  user?.phone ||
                  "Not provided"
                }
              />

              <DropdownItem
                icon="🌴"
                label="Leave Balance"
                value={`${
                  user?.leaveBalance ??
                  0
                } days`}
              />

              <View
                style={
                  styles.dropdownDivider
                }
              />

              <Pressable
                onPress={signOut}
                style={({ pressed }) => [
                  styles.dropdownSignOut,

                  pressed &&
                    styles.dropdownSignOutPressed,
                ]}
              >
                <Text
                  style={
                    styles.dropdownSignOutIcon
                  }
                >
                  ↪
                </Text>

                <Text
                  style={
                    styles.dropdownSignOutText
                  }
                >
                  Sign Out
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>

      {/* EMPLOYEE IDENTITY CARD */}

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
        style={styles.identityCard}
      >
        <View
          style={
            styles.identityGlowOne
          }
        />

        <View
          style={
            styles.identityGlowTwo
          }
        />

        {/* DISPLAY-ONLY CENTER AVATAR */}

        <View
          style={
            styles.avatarWrapper
          }
        >
          {profilePicture ? (
            <Image
              source={{
                uri: profilePicture,
              }}
              style={
                styles.avatarImage
              }
            />
          ) : (
            <View
              style={
                styles.avatarPlaceholder
              }
            >
              <Text
                style={
                  styles.avatarEmoji
                }
              >
                👤
              </Text>
            </View>
          )}
        </View>

        <Text
          style={styles.employeeName}
        >
          {user?.name || "Employee"}
        </Text>

        <Text
          style={styles.department}
        >
          {user?.department ||
            "Department"}
        </Text>

        <View
          style={
            styles.employeeIdPill
          }
        >
          <Text
            style={
              styles.employeeIdText
            }
          >
            {user?.employeeId || "—"}
          </Text>
        </View>
      </LinearGradient>

      {/* SUMMARY CARDS */}

      <View style={styles.infoGrid}>
        <PortalCard
          style={styles.infoCard}
        >
          <View
            style={
              styles.infoIconBox
            }
          >
            <Text
              style={
                styles.infoIcon
              }
            >
              ✉️
            </Text>
          </View>

          <View>
            <Text
              style={
                styles.infoLabel
              }
            >
              Email
            </Text>

            <Text
              style={
                styles.infoValue
              }
            >
              {user?.email || "—"}
            </Text>
          </View>
        </PortalCard>

        <PortalCard
          style={styles.infoCard}
        >
          <View
            style={
              styles.infoIconBox
            }
          >
            <Text
              style={
                styles.infoIcon
              }
            >
              🏢
            </Text>
          </View>

          <View>
            <Text
              style={
                styles.infoLabel
              }
            >
              Department
            </Text>

            <Text
              style={
                styles.infoValue
              }
            >
              {user?.department ||
                "—"}
            </Text>
          </View>
        </PortalCard>

        <PortalCard
          style={styles.infoCard}
        >
          <View
            style={
              styles.infoIconBox
            }
          >
            <Text
              style={
                styles.infoIcon
              }
            >
              🌴
            </Text>
          </View>

          <View>
            <Text
              style={
                styles.infoLabel
              }
            >
              Leave Balance
            </Text>

            <Text
              style={
                styles.infoValue
              }
            >
              {user?.leaveBalance ??
                0}{" "}
              days
            </Text>
          </View>
        </PortalCard>
      </View>

      {/* PERSONAL INFORMATION */}

      <PortalCard
        style={styles.editCard}
      >
        <Text
          style={
            styles.sectionTitle
          }
        >
          Personal Information
        </Text>

        <Text style={styles.label}>
          Phone Number
        </Text>

        <TextInput
          value={phone}
          onChangeText={(value) => {
            setPhone(value);
            setMessage("");
          }}
          placeholder="Enter phone number"
          placeholderTextColor="#94A3B8"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Text style={styles.label}>
          Profile Picture URL
        </Text>

        <TextInput
          value={profilePicture}
          onChangeText={(value) => {
            setProfilePicture(
              value
            );

            setMessage("");
          }}
          placeholder="https://..."
          placeholderTextColor="#94A3B8"
          autoCapitalize="none"
          style={styles.input}
        />

        {message ? (
          <View
            style={styles.message}
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

        <View
          style={styles.saveButton}
        >
          <GradientButton
            title={
              loading
                ? "Saving..."
                : "Save Changes"
            }
            disabled={loading}
            onPress={save}
          />
        </View>
      </PortalCard>

      {/* SECURITY */}

      <PortalCard
        style={
          styles.securityCard
        }
      >
        <View
          style={
            styles.securityRow
          }
        >
          <View
            style={
              styles.securityIconBox
            }
          >
            <Text
              style={
                styles.securityEmoji
              }
            >
              🔐
            </Text>
          </View>

          <View
            style={
              styles.securityText
            }
          >
            <Text
              style={
                styles.securityTitle
              }
            >
              Account Security
            </Text>

            <Text
              style={
                styles.securityDescription
              }
            >
              Your session is protected using token-based authentication.
            </Text>
          </View>
        </View>
      </PortalCard>
    </PortalPage>
  );
}

function DropdownItem({
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
        styles.dropdownItem
      }
    >
      <View
        style={
          styles.dropdownItemIcon
        }
      >
        <Text>{icon}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={
            styles.dropdownLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            styles.dropdownValue
          }
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* TOP HEADER */

  topHeader: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: 26,

    zIndex: 1000,
  },

  headerTextArea: {
    flex: 1,
    paddingRight: 20,
  },

  eyebrow: {
    color: "#7C3AED",

    fontSize: 12,

    fontWeight: "800",

    letterSpacing: 1.4,
  },

  pageTitle: {
    color: "#0F172A",

    fontSize: 31,

    fontWeight: "800",

    marginTop: 6,
  },

  pageDescription: {
    color: "#64748B",

    fontSize: 14,

    marginTop: 7,

    lineHeight: 20,
  },

  topRightArea: {
    position: "relative",

    zIndex: 2000,
  },

  topProfileButton: {
    width: 60,
    height: 60,

    borderRadius: 18,

    backgroundColor:
      "#FFFFFF",

    justifyContent:
      "center",

    alignItems: "center",

    shadowColor:
      "#7C3AED",

    shadowOpacity: 0.13,

    shadowRadius: 14,

    elevation: 6,
  },

  topProfileButtonPressed: {
    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  topProfileIcon: {
    fontSize: 26,
  },

  /* TOP-RIGHT DROPDOWN */

  topProfileDropdown: {
    position: "absolute",

    top: 72,

    right: 0,

    width: 320,

    backgroundColor:
      "#FFFFFF",

    borderRadius: 20,

    padding: 18,

    borderWidth: 1,

    borderColor:
      "#EDE9FE",

    shadowColor:
      "#0F172A",

    shadowOpacity: 0.18,

    shadowRadius: 24,

    elevation: 20,

    zIndex: 9999,
  },

  dropdownHeader: {
    flexDirection: "row",

    alignItems: "center",
  },

  smallAvatar: {
    width: 46,
    height: 46,

    borderRadius: 23,

    backgroundColor:
      "#F3E8FF",

    justifyContent:
      "center",

    alignItems: "center",

    marginRight: 12,

    overflow: "hidden",
  },

  smallAvatarImage: {
    width: "100%",
    height: "100%",
  },

  smallAvatarText: {
    fontSize: 21,
  },

  dropdownName: {
    color: "#0F172A",

    fontSize: 15,

    fontWeight: "800",
  },

  dropdownEmployeeId: {
    color: "#7C3AED",

    fontSize: 11,

    fontWeight: "700",

    marginTop: 3,
  },

  dropdownDivider: {
    height: 1,

    backgroundColor:
      "#E2E8F0",

    marginVertical: 14,
  },

  dropdownItem: {
    flexDirection: "row",

    alignItems: "center",

    paddingVertical: 8,
  },

  dropdownItemIcon: {
    width: 34,
    height: 34,

    borderRadius: 10,

    backgroundColor:
      "#F8FAFC",

    justifyContent:
      "center",

    alignItems: "center",

    marginRight: 10,
  },

  dropdownLabel: {
    color: "#94A3B8",

    fontSize: 10,

    fontWeight: "700",
  },

  dropdownValue: {
    color: "#0F172A",

    fontSize: 12,

    fontWeight: "700",

    marginTop: 2,
  },

  dropdownSignOut: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor:
      "#FEF2F2",

    padding: 11,

    borderRadius: 10,
  },

  dropdownSignOutPressed: {
    opacity: 0.7,
  },

  dropdownSignOutIcon: {
    color: "#DC2626",

    fontSize: 18,

    marginRight: 9,
  },

  dropdownSignOutText: {
    color: "#DC2626",

    fontSize: 13,

    fontWeight: "800",
  },

  /* IDENTITY CARD */

  identityCard: {
    borderRadius: 28,

    padding: 30,

    alignItems: "center",

    overflow: "hidden",

    shadowColor:
      "#7C3AED",

    shadowOpacity: 0.2,

    shadowRadius: 18,

    elevation: 5,
  },

  identityGlowOne: {
    position: "absolute",

    width: 220,
    height: 220,

    borderRadius: 110,

    backgroundColor:
      "rgba(255,255,255,0.09)",

    right: -70,

    top: -100,
  },

  identityGlowTwo: {
    position: "absolute",

    width: 130,
    height: 130,

    borderRadius: 65,

    backgroundColor:
      "rgba(255,255,255,0.08)",

    left: -40,

    bottom: -50,
  },

  avatarWrapper: {
    width: 108,
    height: 108,

    borderRadius: 54,

    backgroundColor:
      "rgba(255,255,255,0.18)",

    justifyContent:
      "center",

    alignItems: "center",

    padding: 6,
  },

  avatarPlaceholder: {
    width: "100%",
    height: "100%",

    borderRadius: 50,

    backgroundColor:
      "#FFFFFF",

    justifyContent:
      "center",

    alignItems: "center",
  },

  avatarImage: {
    width: "100%",
    height: "100%",

    borderRadius: 50,
  },

  avatarEmoji: {
    fontSize: 42,
  },

  employeeName: {
    color: "#FFFFFF",

    fontSize: 27,

    fontWeight: "800",

    marginTop: 16,
  },

  department: {
    color: "#F5F3FF",

    fontSize: 14,

    marginTop: 5,
  },

  employeeIdPill: {
    marginTop: 14,

    paddingHorizontal: 16,

    paddingVertical: 7,

    backgroundColor:
      "rgba(255,255,255,0.16)",

    borderRadius: 999,
  },

  employeeIdText: {
    color: "#FFFFFF",

    fontSize: 12,

    fontWeight: "800",
  },

  /* SUMMARY */

  infoGrid: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: 16,

    marginTop: 20,
  },

  infoCard: {
    flex: 1,

    minWidth: 230,

    flexDirection: "row",

    alignItems: "center",
  },

  infoIconBox: {
    width: 46,
    height: 46,

    borderRadius: 14,

    backgroundColor:
      "#F5F3FF",

    justifyContent:
      "center",

    alignItems: "center",

    marginRight: 13,
  },

  infoIcon: {
    fontSize: 21,
  },

  infoLabel: {
    color:
      colors.secondary,

    fontSize: 11,
  },

  infoValue: {
    color:
      colors.text,

    fontWeight: "800",

    fontSize: 14,

    marginTop: 3,
  },

  /* EDIT */

  editCard: {
    marginTop: 20,
  },

  sectionTitle: {
    color:
      colors.text,

    fontSize: 18,

    fontWeight: "800",
  },

  label: {
    color:
      colors.text,

    fontSize: 13,

    fontWeight: "700",

    marginTop: 17,

    marginBottom: 7,
  },

  input: {
    minHeight: 52,

    borderRadius: 12,

    borderWidth: 1,

    borderColor:
      colors.border,

    backgroundColor:
      "#F8FAFC",

    paddingHorizontal: 15,

    color:
      colors.text,

    outlineStyle:
      "none" as any,
  },

  message: {
    backgroundColor:
      colors.purpleLight,

    borderRadius: 12,

    padding: 13,

    marginTop: 15,
  },

  messageText: {
    color:
      colors.purple,

    textAlign: "center",

    fontWeight: "700",
  },

  saveButton: {
    marginTop: 22,
  },

  /* SECURITY */

  securityCard: {
    marginTop: 20,
  },

  securityRow: {
    flexDirection: "row",

    alignItems: "center",
  },

  securityIconBox: {
    width: 52,
    height: 52,

    borderRadius: 16,

    backgroundColor:
      colors.purpleLight,

    justifyContent:
      "center",

    alignItems: "center",
  },

  securityEmoji: {
    fontSize: 22,
  },

  securityText: {
    flex: 1,

    marginLeft: 14,
  },

  securityTitle: {
    color:
      colors.text,

    fontSize: 14,

    fontWeight: "800",
  },

  securityDescription: {
    color:
      colors.secondary,

    fontSize: 12,

    lineHeight: 18,

    marginTop: 4,
  },
});