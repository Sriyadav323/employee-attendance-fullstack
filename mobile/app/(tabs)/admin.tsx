import React, {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useFocusEffect,
} from "expo-router";

import {
  api,
  messageOf,
} from "../../src/services/api";

import {
  colors,
  PageHeader,
  PortalCard,
  PortalPage,
} from "../../src/components/PortalUI";

type AccessRequest = {
  _id: string;
  name: string;
  email: string;
  employeeId?: string;
  department?: string;
  phone?: string;
  createdAt?: string;
  approvalStatus:
    | "pending"
    | "approved"
    | "rejected";
};

type CorrectionRequest = {
  _id: string;
  attendanceDate: string;
  requestedCheckInAt: string;
  requestedCheckOutAt?: string | null;
  reason: string;
  userId: {
    name: string;
    email: string;
    employeeId?: string;
    department?: string;
  };
};

export default function Admin() {
  const [requests, setRequests] =
    useState<AccessRequest[]>([]);

  const [corrections, setCorrections] =
    useState<CorrectionRequest[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [actionId, setActionId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const loadRequests =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const [accessResponse, correctionResponse] =
          await Promise.all([
            api.get("/admin/access-requests"),
            api.get("/admin/attendance-corrections"),
          ]);

        setRequests(
          Array.isArray(accessResponse.data)
            ? accessResponse.data
            : []
        );
        setCorrections(
          Array.isArray(correctionResponse.data)
            ? correctionResponse.data
            : []
        );
      } catch (e) {
        setError(
          messageOf(e)
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [loadRequests])
  );

  async function approve(
    id: string
  ) {
    try {
      setActionId(id);
      setMessage("");
      setError("");

      const { data } =
        await api.patch(
          `/admin/access-requests/${id}/approve`
        );

      setMessage(
        data?.message ||
          "User approved successfully."
      );

      await loadRequests();
    } catch (e) {
      setError(
        messageOf(e)
      );
    } finally {
      setActionId(null);
    }
  }

  async function reject(
    id: string
  ) {
    try {
      setActionId(id);
      setMessage("");
      setError("");

      const { data } =
        await api.patch(
          `/admin/access-requests/${id}/reject`
        );

      setMessage(
        data?.message ||
          "User rejected successfully."
      );

      await loadRequests();
    } catch (e) {
      setError(
        messageOf(e)
      );
    } finally {
      setActionId(null);
    }
  }

  async function reviewCorrection(
    id: string,
    decision: "approve" | "reject"
  ) {
    try {
      setActionId(id);
      setMessage("");
      setError("");
      const { data } = await api.patch(
        `/admin/attendance-corrections/${id}/${decision}`
      );
      setMessage(data?.message || `Correction ${decision}d successfully.`);
      await loadRequests();
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setActionId(null);
    }
  }

  return (
    <PortalPage>
      <PageHeader
        eyebrow="ADMINISTRATION"
        title="Access Requests"
        description="Review new employee account requests and approve or reject access."
        icon="🛡️"
      />

      <PortalCard
        style={styles.summaryCard}
      >
        <Text style={styles.summaryIcon}>
          🔔
        </Text>

        <View>
          <Text style={styles.summaryLabel}>
            Pending Requests
          </Text>

          <Text style={styles.summaryValue}>
            {requests.length}
          </Text>
        </View>
      </PortalCard>

      {message ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>
            {message}
          </Text>
        </View>
      ) : null}

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color="#7C3AED"
          />

          <Text style={styles.loadingText}>
            Loading access requests...
          </Text>
        </View>
      ) : requests.length === 0 ? (
        <PortalCard
          style={styles.emptyCard}
        >
          <Text style={styles.emptyIcon}>
            ✅
          </Text>

          <Text style={styles.emptyTitle}>
            No pending requests
          </Text>

          <Text style={styles.emptyText}>
            All employee access requests have been reviewed.
          </Text>
        </PortalCard>
      ) : (
        <View style={styles.requests}>
          {requests.map((user) => {
            const busy =
              actionId === user._id;

            return (
              <PortalCard
                key={user._id}
                style={styles.requestCard}
              >
                <View style={styles.topRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      👤
                    </Text>
                  </View>

                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                      {user.name}
                    </Text>

                    <Text style={styles.userEmail}>
                      {user.email}
                    </Text>
                  </View>

                  <View style={styles.pendingPill}>
                    <Text style={styles.pendingText}>
                      Pending
                    </Text>
                  </View>
                </View>

                <View style={styles.details}>
                  <Detail
                    label="Department"
                    value={
                      user.department ||
                      "Not provided"
                    }
                  />

                  <Detail
                    label="Phone"
                    value={
                      user.phone ||
                      "Not provided"
                    }
                  />

                  <Detail
                    label="Requested"
                    value={
                      user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString()
                        : "—"
                    }
                  />
                </View>

                <View style={styles.actions}>
                  <Pressable
                    disabled={busy}
                    onPress={() =>
                      reject(user._id)
                    }
                    style={[
                      styles.rejectButton,
                      busy &&
                        styles.disabled,
                    ]}
                  >
                    <Text style={styles.rejectText}>
                      Reject
                    </Text>
                  </Pressable>

                  <Pressable
                    disabled={busy}
                    onPress={() =>
                      approve(user._id)
                    }
                    style={[
                      styles.approveButton,
                      busy &&
                        styles.disabled,
                    ]}
                  >
                    {busy ? (
                      <ActivityIndicator
                        color="#FFFFFF"
                      />
                    ) : (
                      <Text style={styles.approveText}>
                        ✓ Approve
                      </Text>
                    )}
                  </Pressable>
                </View>
              </PortalCard>
            );
          })}
        </View>
      )}

      <View style={styles.correctionHeader}>
        <Text style={styles.sectionTitle}>Attendance Corrections</Text>
        <Text style={styles.recordCount}>{corrections.length} pending</Text>
      </View>

      {corrections.length === 0 ? (
        <PortalCard style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🕒</Text>
          <Text style={styles.emptyTitle}>No correction requests</Text>
          <Text style={styles.emptyText}>Submitted attendance corrections will appear here.</Text>
        </PortalCard>
      ) : (
        <View style={styles.requests}>
          {corrections.map((item) => {
            const busy = actionId === item._id;
            return (
              <PortalCard key={item._id} style={styles.requestCard}>
                <View style={styles.topRow}>
                  <View style={styles.avatar}><Text style={styles.avatarText}>🕒</Text></View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.userId?.name || "Employee"}</Text>
                    <Text style={styles.userEmail}>{item.userId?.employeeId || "—"} · {item.userId?.email}</Text>
                  </View>
                  <View style={styles.pendingPill}><Text style={styles.pendingText}>Pending</Text></View>
                </View>

                <View style={styles.details}>
                  <Detail label="Date" value={item.attendanceDate} />
                  <Detail label="Requested Check In" value={formatTime(item.requestedCheckInAt)} />
                  <Detail label="Requested Check Out" value={formatTime(item.requestedCheckOutAt)} />
                </View>

                <Text style={styles.reasonText}>{item.reason}</Text>

                <View style={styles.actions}>
                  <Pressable disabled={busy} onPress={() => reviewCorrection(item._id, "reject")} style={[styles.rejectButton, busy && styles.disabled]}>
                    <Text style={styles.rejectText}>Reject</Text>
                  </Pressable>
                  <Pressable disabled={busy} onPress={() => reviewCorrection(item._id, "approve")} style={[styles.approveButton, busy && styles.disabled]}>
                    {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.approveText}>✓ Approve</Text>}
                  </Pressable>
                </View>
              </PortalCard>
            );
          })}
        </View>
      )}
    </PortalPage>
  );
}

function formatTime(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>
        {label}
      </Text>

      <Text style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  correctionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },

  recordCount: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "700",
  },

  reasonText: {
    color: colors.text,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
    marginTop: 18,
    lineHeight: 20,
  },
  summaryCard: {
    minWidth: 240,
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    fontSize: 28,
    marginRight: 14,
  },

  summaryLabel: {
    color: colors.secondary,
    fontSize: 11,
  },

  summaryValue: {
    color: "#7C3AED",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 3,
  },

  successBox: {
    backgroundColor: "#ECFDF5",
    padding: 13,
    borderRadius: 12,
    marginTop: 18,
  },

  successText: {
    color: "#047857",
    fontWeight: "700",
  },

  errorBox: {
    backgroundColor: "#FEF2F2",
    padding: 13,
    borderRadius: 12,
    marginTop: 18,
  },

  errorText: {
    color: "#B91C1C",
    fontWeight: "700",
  },

  loading: {
    alignItems: "center",
    marginTop: 50,
  },

  loadingText: {
    color: colors.secondary,
    marginTop: 12,
  },

  emptyCard: {
    marginTop: 22,
    alignItems: "center",
    paddingVertical: 35,
  },

  emptyIcon: {
    fontSize: 40,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 12,
  },

  emptyText: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: 5,
  },

  requests: {
    gap: 16,
    marginTop: 22,
  },

  requestCard: {
    padding: 22,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  avatarText: {
    fontSize: 23,
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },

  userEmail: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: 3,
  },

  pendingPill: {
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
  },

  pendingText: {
    color: "#EA580C",
    fontSize: 10,
    fontWeight: "800",
  },

  details: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 30,
    marginTop: 20,
    paddingTop: 17,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  detail: {
    minWidth: 150,
  },

  detailLabel: {
    color: colors.secondary,
    fontSize: 10,
  },

  detailValue: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 11,
    marginTop: 22,
  },

  rejectButton: {
    minWidth: 110,
    minHeight: 44,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
  },

  rejectText: {
    color: "#DC2626",
    fontWeight: "800",
  },

  approveButton: {
    minWidth: 125,
    minHeight: 44,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7C3AED",
  },

  approveText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  disabled: {
    opacity: 0.5,
  },
});
