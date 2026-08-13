import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN = "token";
const USER = "user";
const QUEUE = "attendance_queue";

/*
 * New key so previously stored email
 * will NOT automatically appear.
 */
const REMEMBERED_EMAIL = "employee_portal_remembered_email_v2";

export const storage = {
  getToken: () =>
    AsyncStorage.getItem(TOKEN),

  setToken: (value: string) =>
    AsyncStorage.setItem(TOKEN, value),

  clear: () =>
    AsyncStorage.multiRemove([
      TOKEN,
      USER,
    ]),

  getUser: async () => {
    const value =
      await AsyncStorage.getItem(USER);

    return value
      ? JSON.parse(value)
      : null;
  },

  setUser: (user: any) =>
    AsyncStorage.setItem(
      USER,
      JSON.stringify(user)
    ),

  getQueue: async () =>
    JSON.parse(
      (await AsyncStorage.getItem(
        QUEUE
      )) || "[]"
    ),

  setQueue: (queue: any[]) =>
    AsyncStorage.setItem(
      QUEUE,
      JSON.stringify(queue)
    ),

  getRememberedEmail: () =>
    AsyncStorage.getItem(
      REMEMBERED_EMAIL
    ),

  setRememberedEmail: (
    email: string
  ) =>
    AsyncStorage.setItem(
      REMEMBERED_EMAIL,
      email
    ),

  clearRememberedEmail: () =>
    AsyncStorage.removeItem(
      REMEMBERED_EMAIL
    ),
};