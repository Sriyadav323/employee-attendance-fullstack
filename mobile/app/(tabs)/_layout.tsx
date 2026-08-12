import React from "react";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          headerTitle: "Employee Portal",
        }}
      />

      <Tabs.Screen
        name="attendance"
        options={{
          title: "Attendance",
          headerTitle: "Attendance",
        }}
      />

      <Tabs.Screen
        name="leave"
        options={{
          title: "Apply Leave",
          headerTitle: "Leave Management",
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          headerTitle: "Attendance History",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitle: "My Profile",
        }}
      />
    </Tabs>
  );
}
