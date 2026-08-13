import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { useAuth } from "../src/context/AuthContext";
import { messageOf } from "../src/services/api";
import { storage } from "../src/services/storage";

/* =====================================================
   ROTATING CONTENT
===================================================== */

const slides = [
  {
    icon: "⚡",
    title: "Your workday. Simplified.",
    description:
      "Manage attendance, leave requests and employee activity from one secure workspace.",
  },

  {
    icon: "📊",
    title: "Stay informed. Stay productive.",
    description:
      "View attendance activity, working hours and employee information in one modern portal.",
  },

  {
    icon: "✨",
    title: "A smarter employee experience.",
    description:
      "Simple attendance, easier leave management and a connected employee workspace.",
  },
];

/* =====================================================
   LOGIN
===================================================== */

export default function Login() {
  const { width } =
    useWindowDimensions();

  const isDesktop =
    width >= 900;

  const { login } =
    useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [rememberMe, setRememberMe] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [emailError, setEmailError] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  const [loginError, setLoginError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [slideIndex, setSlideIndex] =
    useState(0);

  /*
   * Main slide fade animation
   */
  const fade =
    useRef(
      new Animated.Value(1)
    ).current;

  /*
   * Hero icon floating animation
   */
  const heroFloat =
    useRef(
      new Animated.Value(0)
    ).current;

  /*
   * Background bubble animations
   */
  const bubbleFloatOne =
    useRef(
      new Animated.Value(0)
    ).current;

  const bubbleFloatTwo =
    useRef(
      new Animated.Value(0)
    ).current;

  const bubbleFloatThree =
    useRef(
      new Animated.Value(0)
    ).current;

  /* =====================================================
     LOAD REMEMBERED EMAIL
  ===================================================== */

  useEffect(() => {
    async function loadRememberedEmail() {
      try {
        const savedEmail =
          await storage.getRememberedEmail();

        if (savedEmail) {
          setEmail(savedEmail);
          setRememberMe(true);
        } else {
          setEmail("");
          setRememberMe(false);
        }

        /*
         * Never restore password
         */
        setPassword("");
      } catch {
        setEmail("");
        setPassword("");
        setRememberMe(false);
      }
    }

    loadRememberedEmail();
  }, []);

  /* =====================================================
     ROTATING TEXT
  ===================================================== */

  useEffect(() => {
    const timer =
      setInterval(() => {
        Animated.timing(
          fade,
          {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }
        ).start(() => {
          setSlideIndex(
            (current) =>
              (current + 1) %
              slides.length
          );

          Animated.timing(
            fade,
            {
              toValue: 1,
              duration: 450,
              useNativeDriver: true,
            }
          ).start();
        });
      }, 4500);

    return () =>
      clearInterval(timer);
  }, []);

  /* =====================================================
     HERO ICON FLOAT
  ===================================================== */

  useEffect(() => {
    const animation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            heroFloat,
            {
              toValue: -14,
              duration: 1800,
              useNativeDriver: true,
            }
          ),

          Animated.timing(
            heroFloat,
            {
              toValue: 0,
              duration: 1800,
              useNativeDriver: true,
            }
          ),
        ])
      );

    animation.start();

    return () =>
      animation.stop();
  }, []);

  /* =====================================================
     FLOATING BUBBLES
  ===================================================== */

  useEffect(() => {
    const first =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            bubbleFloatOne,
            {
              toValue: 1,
              duration: 4200,
              useNativeDriver: true,
            }
          ),

          Animated.timing(
            bubbleFloatOne,
            {
              toValue: 0,
              duration: 4200,
              useNativeDriver: true,
            }
          ),
        ])
      );

    const second =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            bubbleFloatTwo,
            {
              toValue: 1,
              duration: 5200,
              useNativeDriver: true,
            }
          ),

          Animated.timing(
            bubbleFloatTwo,
            {
              toValue: 0,
              duration: 5200,
              useNativeDriver: true,
            }
          ),
        ])
      );

    const third =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            bubbleFloatThree,
            {
              toValue: 1,
              duration: 6000,
              useNativeDriver: true,
            }
          ),

          Animated.timing(
            bubbleFloatThree,
            {
              toValue: 0,
              duration: 6000,
              useNativeDriver: true,
            }
          ),
        ])
      );

    first.start();
    second.start();
    third.start();

    return () => {
      first.stop();
      second.stop();
      third.stop();
    };
  }, []);

  const slide =
    slides[slideIndex];

  /* =====================================================
     VALIDATION
  ===================================================== */

  function validate() {
    let valid = true;

    setEmailError("");
    setPasswordError("");
    setLoginError("");

    const cleanEmail =
      email.trim();

    if (!cleanEmail) {
      setEmailError(
        "Email address is required."
      );

      valid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail
      )
    ) {
      setEmailError(
        "Please enter a valid email address."
      );

      valid = false;
    }

    if (!password) {
      setPasswordError(
        "Password is required."
      );

      valid = false;
    } else if (
      password.length < 8
    ) {
      setPasswordError(
        "Password must contain at least 8 characters."
      );

      valid = false;
    }

    return valid;
  }

  /* =====================================================
     SIGN IN
  ===================================================== */

  async function submit() {
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const cleanEmail =
        email
          .trim()
          .toLowerCase();

      await login(
        cleanEmail,
        password
      );

      /*
       * Remember email only.
       * Never store password.
       */
      if (rememberMe) {
        await storage.setRememberedEmail(
          cleanEmail
        );
      } else {
        await storage.clearRememberedEmail();
      }

      setPassword("");

      router.replace(
        "/(tabs)/dashboard"
      );
    } catch (error) {
      setLoginError(
        messageOf(error)
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleRemember() {
    const next =
      !rememberMe;

    setRememberMe(next);

    if (!next) {
      await storage.clearRememberedEmail();
    }
  }

  /* =====================================================
     BUBBLE TRANSFORMS
  ===================================================== */

  const bubbleOneY =
    bubbleFloatOne.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -45],
    });

  const bubbleOneX =
    bubbleFloatOne.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 22],
    });

  const bubbleTwoY =
    bubbleFloatTwo.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 35],
    });

  const bubbleTwoX =
    bubbleFloatTwo.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -30],
    });

  const bubbleThreeY =
    bubbleFloatThree.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -28],
    });

  const bubbleThreeX =
    bubbleFloatThree.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 40],
    });

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.scroll
        }
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={[
            "#EEF2FF",
            "#FDF2F8",
            "#EFF6FF",
          ]}
          style={[
            styles.layout,

            isDesktop
              ? styles.desktop
              : styles.mobile,
          ]}
        >
          {/* =================================================
              COLORFUL MOVING BACKGROUND BALLS
          ================================================= */}

          <Animated.View
            pointerEvents="none"
            style={[
              styles.ballPurpleLarge,
              {
                transform: [
                  {
                    translateY:
                      bubbleOneY,
                  },
                  {
                    translateX:
                      bubbleOneX,
                  },
                ],
              },
            ]}
          />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.ballPinkMedium,
              {
                transform: [
                  {
                    translateY:
                      bubbleTwoY,
                  },
                  {
                    translateX:
                      bubbleTwoX,
                  },
                ],
              },
            ]}
          />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.ballBlue,
              {
                transform: [
                  {
                    translateY:
                      bubbleThreeY,
                  },
                  {
                    translateX:
                      bubbleThreeX,
                  },
                ],
              },
            ]}
          />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.ballPinkSmall,
              {
                transform: [
                  {
                    translateY:
                      bubbleOneY,
                  },
                ],
              },
            ]}
          />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.ballPurpleSmall,
              {
                transform: [
                  {
                    translateX:
                      bubbleTwoX,
                  },
                ],
              },
            ]}
          />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.ballCyan,
              {
                transform: [
                  {
                    translateY:
                      bubbleThreeY,
                  },
                ],
              },
            ]}
          />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.ballOrange,
              {
                transform: [
                  {
                    translateX:
                      bubbleOneX,
                  },
                ],
              },
            ]}
          />

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          {isDesktop ? (
            <View
              style={
                styles.leftPanel
              }
            >
              {/* BRAND */}

              <View
                style={
                  styles.brand
                }
              >
                <LinearGradient
                  colors={[
                    "#6D28D9",
                    "#EC4899",
                  ]}
                  style={
                    styles.logo
                  }
                >
                  <Text
                    style={
                      styles.logoText
                    }
                  >
                    EA
                  </Text>
                </LinearGradient>

                <View>
                  <Text
                    style={
                      styles.brandTitle
                    }
                  >
                    Employee Portal
                  </Text>

                  <Text
                    style={
                      styles.brandSub
                    }
                  >
                    Attendance & Leave Management
                  </Text>
                </View>
              </View>

              {/* FLOATING MAIN ICON */}

              <Animated.View
                style={[
                  styles.heroIconBox,

                  {
                    transform: [
                      {
                        translateY:
                          heroFloat,
                      },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={[
                    "#6D28D9",
                    "#A855F7",
                    "#EC4899",
                  ]}
                  style={
                    styles.heroIcon
                  }
                >
                  <Text
                    style={
                      styles.heroEmoji
                    }
                  >
                    {slide.icon}
                  </Text>
                </LinearGradient>
              </Animated.View>

              {/* ROTATING MESSAGE */}

              <Animated.View
                style={{
                  opacity:
                    fade,
                }}
              >
                <Text
                  style={
                    styles.heroTitle
                  }
                >
                  {slide.title}
                </Text>

                <Text
                  style={
                    styles.heroDescription
                  }
                >
                  {
                    slide.description
                  }
                </Text>
              </Animated.View>

              {/* SMALL FEATURE CARDS */}

              <View
                style={
                  styles.featureRow
                }
              >
                <FeatureCard
                  icon="🔐"
                  title="Secure"
                  text="Protected access"
                  color="#7C3AED"
                />

                <FeatureCard
                  icon="⚡"
                  title="Fast"
                  text="Quick updates"
                  color="#2563EB"
                />

                <FeatureCard
                  icon="✨"
                  title="Simple"
                  text="Easy experience"
                  color="#DB2777"
                />
              </View>

              {/* SLIDE DOTS */}

              <View
                style={
                  styles.dots
                }
              >
                {slides.map(
                  (
                    _,
                    index
                  ) => (
                    <View
                      key={
                        index
                      }
                      style={[
                        styles.dot,

                        index ===
                          slideIndex &&
                          styles.activeDot,
                      ]}
                    />
                  )
                )}
              </View>
            </View>
          ) : null}

          {/* =================================================
              RIGHT LOGIN CARD
          ================================================= */}

          <View
            style={
              styles.rightPanel
            }
          >
            <View
              style={
                styles.formCard
              }
            >
              <LinearGradient
                colors={[
                  "#F3E8FF",
                  "#FCE7F3",
                ]}
                style={
                  styles.lockCircle
                }
              >
                <Text
                  style={
                    styles.lock
                  }
                >
                  🔐
                </Text>
              </LinearGradient>

              <Text
                style={
                  styles.welcome
                }
              >
                Welcome Back
              </Text>

              <Text
                style={
                  styles.subtitle
                }
              >
                Sign in to continue to your employee workspace.
              </Text>

              {/* EMAIL */}

              <Text
                style={
                  styles.label
                }
              >
                Email Address
              </Text>

              <TextInput
                value={email}
                onChangeText={(
                  value
                ) => {
                  setEmail(
                    value
                  );

                  setEmailError(
                    ""
                  );

                  setLoginError(
                    ""
                  );
                }}
                placeholder="Enter your email"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                autoComplete="off"
                importantForAutofill="no"
                style={[
                  styles.input,

                  emailError &&
                    styles.inputError,
                ]}
              />

              {emailError ? (
                <Text
                  style={
                    styles.error
                  }
                >
                  {emailError}
                </Text>
              ) : null}

              {/* PASSWORD */}

              <Text
                style={
                  styles.label
                }
              >
                Password
              </Text>

              <View
                style={[
                  styles.passwordBox,

                  passwordError &&
                    styles.inputError,
                ]}
              >
                <TextInput
                  value={
                    password
                  }
                  onChangeText={(
                    value
                  ) => {
                    setPassword(
                      value
                    );

                    setPasswordError(
                      ""
                    );

                    setLoginError(
                      ""
                    );
                  }}
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={
                    !showPassword
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  importantForAutofill="no"
                  onSubmitEditing={
                    submit
                  }
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

              {passwordError ? (
                <Text
                  style={
                    styles.error
                  }
                >
                  {
                    passwordError
                  }
                </Text>
              ) : null}

              {/* OPTIONS */}

              <View
                style={
                  styles.options
                }
              >
                <Pressable
                  onPress={
                    toggleRemember
                  }
                  style={
                    styles.remember
                  }
                >
                  <View
                    style={[
                      styles.checkbox,

                      rememberMe &&
                        styles.checkboxActive,
                    ]}
                  >
                    {rememberMe ? (
                      <Text
                        style={
                          styles.check
                        }
                      >
                        ✓
                      </Text>
                    ) : null}
                  </View>

                  <Text
                    style={
                      styles.rememberText
                    }
                  >
                    Remember email
                  </Text>
                </Pressable>

                {/* WORKING FORGOT PASSWORD */}

                <Pressable
                  onPress={() =>
                    router.push(
                      "/forgot-password"
                    )
                  }
                >
                  <Text
                    style={
                      styles.forgot
                    }
                  >
                    Forgot Password?
                  </Text>
                </Pressable>
              </View>

              {/* LOGIN ERROR */}

              {loginError ? (
                <View
                  style={
                    styles.errorBox
                  }
                >
                  <Text
                    style={
                      styles.errorBoxText
                    }
                  >
                    {loginError}
                  </Text>
                </View>
              ) : null}

              {/* SIGN IN */}

              <Pressable
                onPress={submit}
                disabled={
                  loading
                }
                style={
                  styles.loginButtonWrap
                }
              >
                <LinearGradient
                  colors={[
                    "#6D28D9",
                    "#A855F7",
                    "#EC4899",
                  ]}
                  start={{
                    x: 0,
                    y: 0,
                  }}
                  end={{
                    x: 1,
                    y: 0,
                  }}
                  style={
                    styles.loginButton
                  }
                >
                  {loading ? (
                    <ActivityIndicator
                      color="#FFFFFF"
                    />
                  ) : (
                    <Text
                      style={
                        styles.loginButtonText
                      }
                    >
                      Sign In
                    </Text>
                  )}
                </LinearGradient>
              </Pressable>

              {/* CREATE ACCOUNT */}

              <View
                style={
                  styles.createAccountSection
                }
              >
                <Text
                  style={
                    styles.newEmployeeText
                  }
                >
                  New to Employee Portal?
                </Text>

                <Pressable
                  onPress={() =>
                    router.push(
                      "/register"
                    )
                  }
                  style={
                    styles.createAccountButton
                  }
                >
                  <Text
                    style={
                      styles.createAccountText
                    }
                  >
                    Create Account
                  </Text>
                </Pressable>
              </View>

              <Text
                style={
                  styles.footer
                }
              >
                New accounts require administrator approval before login.
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* =====================================================
   SMALL FEATURE CARD
===================================================== */

function FeatureCard({
  icon,
  title,
  text,
  color,
}: {
  icon: string;
  title: string;
  text: string;
  color: string;
}) {
  return (
    <View
      style={
        styles.featureCard
      }
    >
      <View
        style={[
          styles.featureIconBox,

          {
            backgroundColor:
              `${color}18`,
          },
        ]}
      >
        <Text
          style={
            styles.featureEmoji
          }
        >
          {icon}
        </Text>
      </View>

      <View>
        <Text
          style={
            styles.featureTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            styles.featureText
          }
        >
          {text}
        </Text>
      </View>
    </View>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles =
  StyleSheet.create({
    page: {
      flex: 1,
    },

    scroll: {
      flexGrow: 1,
    },

    layout: {
      flex: 1,
      minHeight: 720,
      overflow: "hidden",
    },

    desktop: {
      flexDirection: "row",
    },

    mobile: {
      flexDirection: "column",
    },

    /* =================================================
       MOVING COLOR BALLS
    ================================================= */

    ballPurpleLarge: {
      position: "absolute",

      width: 95,
      height: 95,

      borderRadius: 48,

      backgroundColor:
        "rgba(124,58,237,0.16)",

      top: 120,
      left: 55,

      shadowColor:
        "#7C3AED",

      shadowOpacity: 0.2,
      shadowRadius: 30,
    },

    ballPinkMedium: {
      position: "absolute",

      width: 65,
      height: 65,

      borderRadius: 33,

      backgroundColor:
        "rgba(236,72,153,0.18)",

      bottom: 100,
      left: "42%",

      shadowColor:
        "#EC4899",

      shadowOpacity: 0.18,
      shadowRadius: 22,
    },

    ballBlue: {
      position: "absolute",

      width: 78,
      height: 78,

      borderRadius: 39,

      backgroundColor:
        "rgba(37,99,235,0.13)",

      top: 90,
      right: 70,

      shadowColor:
        "#2563EB",

      shadowOpacity: 0.15,
      shadowRadius: 25,
    },

    ballPinkSmall: {
      position: "absolute",

      width: 28,
      height: 28,

      borderRadius: 14,

      backgroundColor:
        "rgba(244,114,182,0.33)",

      top: 270,
      left: "38%",
    },

    ballPurpleSmall: {
      position: "absolute",

      width: 34,
      height: 34,

      borderRadius: 17,

      backgroundColor:
        "rgba(167,139,250,0.30)",

      bottom: 170,
      right: 110,
    },

    ballCyan: {
      position: "absolute",

      width: 45,
      height: 45,

      borderRadius: 23,

      backgroundColor:
        "rgba(6,182,212,0.20)",

      top: 390,
      left: 95,
    },

    ballOrange: {
      position: "absolute",

      width: 24,
      height: 24,

      borderRadius: 12,

      backgroundColor:
        "rgba(249,115,22,0.28)",

      bottom: 80,
      left: "18%",
    },

    /* =================================================
       LEFT SIDE
    ================================================= */

    leftPanel: {
      flex: 1.1,

      padding: 60,

      justifyContent:
        "center",

      zIndex: 2,
    },

    brand: {
      position: "absolute",

      top: 45,
      left: 60,

      flexDirection: "row",

      alignItems:
        "center",
    },

    logo: {
      width: 50,
      height: 50,

      borderRadius: 15,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight: 12,

      shadowColor:
        "#7C3AED",

      shadowOpacity: 0.22,

      shadowRadius: 12,
    },

    logoText: {
      color: "#FFFFFF",

      fontWeight: "800",
    },

    brandTitle: {
      color: "#0F172A",

      fontSize: 18,

      fontWeight: "800",
    },

    brandSub: {
      color: "#64748B",

      fontSize: 12,

      marginTop: 2,
    },

    heroIconBox: {
      alignSelf:
        "flex-start",

      marginBottom: 25,
    },

    heroIcon: {
      width: 90,
      height: 90,

      borderRadius: 29,

      justifyContent:
        "center",

      alignItems:
        "center",

      shadowColor:
        "#7C3AED",

      shadowOpacity: 0.25,

      shadowRadius: 24,

      elevation: 8,
    },

    heroEmoji: {
      fontSize: 39,
    },

    heroTitle: {
      color: "#0F172A",

      fontSize: 43,

      fontWeight: "800",

      maxWidth: 520,

      lineHeight: 51,
    },

    heroDescription: {
      color: "#475569",

      fontSize: 16,

      lineHeight: 26,

      marginTop: 16,

      maxWidth: 500,
    },

    featureRow: {
      flexDirection: "row",

      flexWrap: "wrap",

      gap: 12,

      marginTop: 31,
    },

    featureCard: {
      backgroundColor:
        "rgba(255,255,255,0.88)",

      borderRadius: 17,

      padding: 13,

      minWidth: 150,

      flexDirection: "row",

      alignItems:
        "center",

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.75)",

      shadowColor:
        "#7C3AED",

      shadowOpacity: 0.05,

      shadowRadius: 12,
    },

    featureIconBox: {
      width: 39,
      height: 39,

      borderRadius: 12,

      justifyContent:
        "center",

      alignItems:
        "center",

      marginRight: 9,
    },

    featureEmoji: {
      fontSize: 18,
    },

    featureTitle: {
      color: "#334155",

      fontSize: 12,

      fontWeight: "800",
    },

    featureText: {
      color: "#94A3B8",

      fontSize: 9,

      marginTop: 2,
    },

    dots: {
      flexDirection: "row",

      marginTop: 24,
    },

    dot: {
      width: 8,
      height: 8,

      borderRadius: 4,

      backgroundColor:
        "#CBD5E1",

      marginRight: 7,
    },

    activeDot: {
      width: 28,

      backgroundColor:
        "#7C3AED",
    },

    /* =================================================
       RIGHT SIDE
    ================================================= */

    rightPanel: {
      flex: 0.9,

      alignItems:
        "center",

      justifyContent:
        "center",

      padding: 30,

      zIndex: 3,
    },

    formCard: {
      width: "100%",

      maxWidth: 500,

      backgroundColor:
        "rgba(255,255,255,0.96)",

      borderRadius: 30,

      padding: 37,

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.9)",

      shadowColor:
        "#4C1D95",

      shadowOpacity: 0.12,

      shadowRadius: 30,

      elevation: 8,
    },

    lockCircle: {
      width: 78,
      height: 78,

      borderRadius: 39,

      alignSelf:
        "center",

      alignItems:
        "center",

      justifyContent:
        "center",

      shadowColor:
        "#A855F7",

      shadowOpacity: 0.15,

      shadowRadius: 16,
    },

    lock: {
      fontSize: 31,
    },

    welcome: {
      color: "#0F172A",

      fontSize: 31,

      fontWeight: "800",

      textAlign: "center",

      marginTop: 18,
    },

    subtitle: {
      color: "#64748B",

      textAlign: "center",

      marginTop: 7,

      marginBottom: 22,

      lineHeight: 20,
    },

    label: {
      color: "#1E293B",

      fontSize: 13,

      fontWeight: "700",

      marginTop: 15,

      marginBottom: 7,
    },

    input: {
      minHeight: 54,

      borderWidth: 1,

      borderColor:
        "#D7DFEA",

      borderRadius: 13,

      paddingHorizontal: 15,

      backgroundColor:
        "#F8FAFC",

      color: "#0F172A",

      fontSize: 14,

      outlineStyle:
        "none" as any,
    },

    passwordBox: {
      minHeight: 54,

      borderWidth: 1,

      borderColor:
        "#D7DFEA",

      borderRadius: 13,

      backgroundColor:
        "#F8FAFC",

      flexDirection: "row",

      alignItems:
        "center",

      overflow:
        "hidden",
    },

    passwordInput: {
      flex: 1,

      minHeight: 52,

      paddingHorizontal: 15,

      color: "#0F172A",

      fontSize: 14,

      outlineStyle:
        "none" as any,
    },

    showButton: {
      minHeight: 52,

      paddingHorizontal: 15,

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

    inputError: {
      borderColor:
        "#DC2626",
    },

    error: {
      color: "#DC2626",

      fontSize: 12,

      marginTop: 5,
    },

    options: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginTop: 18,
    },

    remember: {
      flexDirection: "row",

      alignItems:
        "center",
    },

    checkbox: {
      width: 19,
      height: 19,

      borderRadius: 5,

      borderWidth: 1,

      borderColor:
        "#94A3B8",

      marginRight: 8,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    checkboxActive: {
      backgroundColor:
        "#7C3AED",

      borderColor:
        "#7C3AED",
    },

    check: {
      color: "#FFFFFF",

      fontWeight: "800",
    },

    rememberText: {
      color: "#475569",

      fontSize: 13,
    },

    forgot: {
      color: "#7C3AED",

      fontSize: 13,

      fontWeight: "800",
    },

    errorBox: {
      backgroundColor:
        "#FEF2F2",

      borderRadius: 10,

      padding: 12,

      marginTop: 15,
    },

    errorBoxText: {
      color: "#B91C1C",

      fontSize: 12,
    },

    loginButtonWrap: {
      marginTop: 24,

      borderRadius: 13,

      overflow:
        "hidden",

      shadowColor:
        "#7C3AED",

      shadowOpacity: 0.18,

      shadowRadius: 12,
    },

    loginButton: {
      minHeight: 55,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    loginButtonText: {
      color: "#FFFFFF",

      fontSize: 16,

      fontWeight: "800",
    },

    createAccountSection: {
      marginTop: 21,

      alignItems:
        "center",
    },

    newEmployeeText: {
      color: "#64748B",

      fontSize: 12,

      marginBottom: 9,
    },

    createAccountButton: {
      width: "100%",

      minHeight: 50,

      borderRadius: 13,

      borderWidth: 1,

      borderColor:
        "#7C3AED",

      backgroundColor:
        "#FAF5FF",

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    createAccountText: {
      color: "#7C3AED",

      fontSize: 14,

      fontWeight: "800",
    },

    footer: {
      color: "#94A3B8",

      fontSize: 11,

      textAlign: "center",

      marginTop: 18,
    },
  });