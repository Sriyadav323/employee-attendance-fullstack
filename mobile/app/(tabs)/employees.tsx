import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { api, messageOf } from "../../src/services/api";
import { colors, PageHeader, PortalCard, PortalPage } from "../../src/components/PortalUI";

type PortalUser = {
  _id: string;
  name: string;
  email: string;
  employeeId?: string;
  department?: string;
  role: "employee" | "admin";
  approvalStatus: "pending" | "approved" | "rejected";
};

export default function Employees() {
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [query, setQuery] = useState("");
  const [roleMenuId, setRoleMenuId] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/admin/users");
      setUsers(
        Array.isArray(data)
          ? data.filter((user: PortalUser) => user.approvalStatus === "approved")
          : []
      );
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadUsers(); }, [loadUsers]));

  const filteredUsers = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return users;
    return users.filter((user) =>
      [user.name, user.email, user.employeeId, user.department]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(search))
    );
  }, [query, users]);

  async function updateRole(user: PortalUser, role: PortalUser["role"]) {
    setRoleMenuId(null);
    if (user.role === role) return;

    try {
      setActionId(user._id);
      setMessage("");
      setError("");
      const { data } = await api.patch(`/admin/users/${user._id}/role`, { role });
      setMessage(data?.message || "Employee role updated successfully.");
      await loadUsers();
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setActionId(null);
    }
  }

  return (
    <PortalPage>
      <PageHeader
        eyebrow="TEAM MANAGEMENT"
        title="Employee Directory"
        description="Search approved employees and manage their portal access roles."
        icon="👥"
      />

      <View style={styles.toolbar}>
        <View>
          <Text style={styles.count}>{users.length}</Text>
          <Text style={styles.countLabel}>Approved employees</Text>
        </View>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name, ID, email or department"
          placeholderTextColor="#94A3B8"
          style={styles.search}
        />
      </View>

      {message ? <View style={styles.successBox}><Text style={styles.successText}>{message}</Text></View> : null}
      {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Loading employees...</Text>
        </View>
      ) : filteredUsers.length === 0 ? (
        <PortalCard style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🔎</Text>
          <Text style={styles.emptyTitle}>No employees found</Text>
          <Text style={styles.emptyText}>Try a different name, employee ID, email or department.</Text>
        </PortalCard>
      ) : (
        <View style={styles.employeeList}>
          {filteredUsers.map((user) => {
            const busy = actionId === user._id;
            const menuOpen = roleMenuId === user._id;
            return (
              <PortalCard key={user._id} style={styles.employeeRow}>
                <View style={styles.employeeIdentity}>
                  <View style={styles.avatar}><Text style={styles.avatarText}>👤</Text></View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <Text style={styles.employeeMeta}>
                      {user.employeeId || "ID pending"} · {user.department || "No department"}
                    </Text>
                  </View>
                </View>

                <View style={styles.roleControl}>
                  <Text style={styles.roleLabel}>ASSIGNED ROLE</Text>
                  <Pressable
                    disabled={busy}
                    onPress={() => setRoleMenuId(menuOpen ? null : user._id)}
                    style={[styles.roleSelect, menuOpen && styles.roleSelectOpen]}
                  >
                    {busy ? <ActivityIndicator size="small" color="#7C3AED" /> : (
                      <>
                        <Text style={styles.roleSelectText}>{user.role === "admin" ? "Administrator" : "Employee"}</Text>
                        <Text style={styles.chevron}>{menuOpen ? "▲" : "▼"}</Text>
                      </>
                    )}
                  </Pressable>
                  {menuOpen ? (
                    <View style={styles.roleMenu}>
                      {(["employee", "admin"] as const).map((role) => (
                        <Pressable
                          key={role}
                          onPress={() => updateRole(user, role)}
                          style={[styles.roleOption, user.role === role && styles.roleOptionActive]}
                        >
                          <Text style={[styles.roleOptionText, user.role === role && styles.roleOptionTextActive]}>
                            {role === "admin" ? "Administrator" : "Employee"}
                          </Text>
                          {user.role === role ? <Text style={styles.roleCheck}>✓</Text> : null}
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                </View>
              </PortalCard>
            );
          })}
        </View>
      )}
    </PortalPage>
  );
}

const styles = StyleSheet.create({
  toolbar: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 18, flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 18, borderWidth: 1, borderColor: "#EDE9FE" },
  count: { color: "#7C3AED", fontSize: 28, fontWeight: "900" },
  countLabel: { color: colors.secondary, fontSize: 11, marginTop: 2 },
  search: { flex: 1, minWidth: 260, maxWidth: 460, minHeight: 48, borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 13, paddingHorizontal: 15, color: colors.text, backgroundColor: "#F8FAFC", outlineStyle: "none" as any },
  employeeList: { gap: 12, marginTop: 18 },
  employeeRow: { padding: 18, flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 18, overflow: "visible" },
  employeeIdentity: { flex: 1, minWidth: 260, flexDirection: "row", alignItems: "center" },
  avatar: { width: 52, height: 52, borderRadius: 16, backgroundColor: "#F3E8FF", alignItems: "center", justifyContent: "center", marginRight: 13 },
  avatarText: { fontSize: 23 },
  userInfo: { flex: 1 },
  userName: { color: colors.text, fontSize: 16, fontWeight: "800" },
  userEmail: { color: colors.secondary, fontSize: 12, marginTop: 3 },
  employeeMeta: { color: "#64748B", fontSize: 11, marginTop: 6, fontWeight: "600" },
  roleControl: { width: 210, position: "relative", zIndex: 10 },
  roleLabel: { color: "#64748B", fontSize: 9, fontWeight: "800", letterSpacing: 0.8, marginBottom: 6 },
  roleSelect: { minHeight: 46, borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 12, paddingHorizontal: 14, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  roleSelectOpen: { borderColor: "#7C3AED" },
  roleSelectText: { color: colors.text, fontWeight: "700", fontSize: 13 },
  chevron: { color: "#7C3AED", fontSize: 10 },
  roleMenu: { marginTop: 6, borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, backgroundColor: "#FFFFFF", padding: 5, shadowColor: "#0F172A", shadowOpacity: 0.12, shadowRadius: 12, elevation: 6 },
  roleOption: { minHeight: 40, borderRadius: 9, paddingHorizontal: 11, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  roleOptionActive: { backgroundColor: "#F3E8FF" },
  roleOptionText: { color: colors.text, fontSize: 12, fontWeight: "700" },
  roleOptionTextActive: { color: "#7C3AED" },
  roleCheck: { color: "#7C3AED", fontWeight: "900" },
  successBox: { backgroundColor: "#ECFDF5", padding: 13, borderRadius: 12, marginTop: 18 },
  successText: { color: "#047857", fontWeight: "700" },
  errorBox: { backgroundColor: "#FEF2F2", padding: 13, borderRadius: 12, marginTop: 18 },
  errorText: { color: "#B91C1C", fontWeight: "700" },
  loading: { alignItems: "center", marginTop: 50 },
  loadingText: { color: colors.secondary, marginTop: 12 },
  emptyCard: { marginTop: 22, alignItems: "center", paddingVertical: 35 },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: "800", marginTop: 12 },
  emptyText: { color: colors.secondary, fontSize: 12, marginTop: 5 },
});
