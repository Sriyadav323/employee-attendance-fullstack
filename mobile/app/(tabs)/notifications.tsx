import React, { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";

import { api, messageOf } from "../../src/services/api";
import { colors, PageHeader, PortalCard, PortalPage } from "../../src/components/PortalUI";

type NotificationItem = {
  _id: string;
  type: string;
  title: string;
  message: string;
  readAt?: string | null;
  createdAt: string;
};

export default function Notifications() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/notifications");
      setItems(Array.isArray(data?.items) ? data.items : []);
      setUnreadCount(Number(data?.unreadCount || 0));
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function markRead(id: string) {
    await api.patch(`/notifications/${id}/read`);
    setItems((current) => current.map((item) => item._id === id ? { ...item, readAt: new Date().toISOString() } : item));
    setUnreadCount((count) => Math.max(0, count - 1));
  }

  async function markAllRead() {
    await api.patch("/notifications/read-all");
    setItems((current) => current.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString() })));
    setUnreadCount(0);
  }

  return (
    <PortalPage>
      <PageHeader eyebrow="NOTIFICATIONS" title="Updates and reminders" description="Review attendance reminders and account decisions." icon="🔔" />

      <View style={styles.headerRow}>
        <Text style={styles.unread}>{unreadCount} unread</Text>
        {unreadCount ? <Pressable onPress={markAllRead} style={styles.markAll}><Text style={styles.markAllText}>Mark all read</Text></Pressable> : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? <ActivityIndicator size="large" color={colors.purple} style={styles.loading} /> : null}

      {!loading && items.length === 0 ? (
        <PortalCard style={styles.empty}><Text style={styles.emptyIcon}>🔕</Text><Text style={styles.emptyTitle}>No notifications yet</Text></PortalCard>
      ) : (
        <View style={styles.list}>
          {items.map((item) => (
            <Pressable key={item._id} onPress={() => !item.readAt && markRead(item._id)}>
              <PortalCard style={[styles.item, !item.readAt && styles.unreadItem]}>
                <View style={styles.itemTop}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {!item.readAt ? <View style={styles.dot} /> : null}
                </View>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
              </PortalCard>
            </Pressable>
          ))}
        </View>
      )}
    </PortalPage>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  unread: { color: colors.secondary, fontWeight: "700" },
  markAll: { backgroundColor: colors.purpleLight, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  markAllText: { color: colors.purple, fontWeight: "800" },
  error: { color: colors.error, fontWeight: "700", marginTop: 18 },
  loading: { marginTop: 50 },
  list: { gap: 14, marginTop: 20 },
  item: { padding: 20 },
  unreadItem: { borderWidth: 1, borderColor: "#C4B5FD", backgroundColor: "#FAF5FF" },
  itemTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  itemTitle: { color: colors.text, fontSize: 16, fontWeight: "800" },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.purple },
  message: { color: colors.secondary, marginTop: 7, lineHeight: 20 },
  time: { color: "#94A3B8", fontSize: 10, marginTop: 10 },
  empty: { alignItems: "center", marginTop: 24, paddingVertical: 40 },
  emptyIcon: { fontSize: 38 },
  emptyTitle: { color: colors.text, fontWeight: "800", marginTop: 12 },
});
