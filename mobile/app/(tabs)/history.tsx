import React, { useEffect, useMemo, useState } from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  colors,
  GradientButton,
  PageHeader,
  PortalCard,
  PortalPage,
} from "../../src/components/PortalUI";

import { api, messageOf } from "../../src/services/api";
import { Attendance } from "../../src/types";

export default function History() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState<"7" | "30" | "custom">("7");
  const [correctionDate, setCorrectionDate] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [correctionReason, setCorrectionReason] = useState("");
  const [correctionBusy, setCorrectionBusy] = useState(false);
  const [correctionMessage, setCorrectionMessage] = useState("");
  const [correctionError, setCorrectionError] = useState("");
  const [corrections, setCorrections] = useState<any[]>([]);

  useEffect(() => {
    loadPreset("7");
    loadCorrections();
  }, []);

  async function loadCorrections() {
    try {
      const { data } = await api.get("/attendance/corrections");
      setCorrections(Array.isArray(data) ? data : []);
    } catch {
      setCorrections([]);
    }
  }

  async function submitCorrection() {
    setCorrectionError("");
    setCorrectionMessage("");

    if (!correctionDate || !checkInTime || correctionReason.trim().length < 10) {
      setCorrectionError("Enter a date, check-in time, and a reason of at least 10 characters.");
      return;
    }

    const checkIn = new Date(`${correctionDate}T${checkInTime}:00`);
    const checkOut = checkOutTime
      ? new Date(`${correctionDate}T${checkOutTime}:00`)
      : null;

    if (Number.isNaN(checkIn.getTime()) || checkOut && Number.isNaN(checkOut.getTime())) {
      setCorrectionError("Enter valid times using HH:MM format.");
      return;
    }

    try {
      setCorrectionBusy(true);
      await api.post("/attendance/corrections", {
        attendanceDate: correctionDate,
        requestedCheckInAt: checkIn.toISOString(),
        requestedCheckOutAt: checkOut?.toISOString() || null,
        reason: correctionReason.trim(),
      });
      setCorrectionMessage("Correction request submitted for admin review.");
      setCorrectionDate("");
      setCheckInTime("");
      setCheckOutTime("");
      setCorrectionReason("");
      await loadCorrections();
    } catch (e) {
      setCorrectionError(messageOf(e));
    } finally {
      setCorrectionBusy(false);
    }
  }

  async function loadPreset(days: "7" | "30") {
    setSelectedRange(days);
    setLoading(true);

    const end = new Date();
    const start = new Date();

    start.setDate(end.getDate() - (Number(days) - 1));

    const fromDate = start.toISOString().slice(0, 10);
    const toDate = end.toISOString().slice(0, 10);

    setFrom(fromDate);
    setTo(toDate);

    try {
      const { data } = await api.get("/attendance/history", {
        params: {
          from: fromDate,
          to: toDate,
        },
      });

      setRecords(data);
    } finally {
      setLoading(false);
    }
  }

  async function applyCustomRange() {
    setSelectedRange("custom");
    setLoading(true);

    try {
      const { data } = await api.get("/attendance/history", {
        params: {
          from,
          to,
        },
      });

      setRecords(data);
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const checkedOut = records.filter(
      (item) => Boolean(item.checkOutAt)
    ).length;

    const totalHours = records.reduce(
      (sum, item) => sum + (item.totalWorkingHours || 0),
      0
    );

    return {
      records: records.length,
      completedDays: checkedOut,
      totalHours: totalHours.toFixed(1),
    };
  }, [records]);

  return (
    <PortalPage>
      <PageHeader
        eyebrow="ATTENDANCE HISTORY"
        title="Your attendance insights"
        description="Review attendance records, working hours and recent trends."
        icon="📊"
      />

      <View style={styles.statsGrid}>
        <PortalCard style={styles.statCard}>
          <Text style={styles.statIcon}>📅</Text>
          <Text style={styles.statValue}>{stats.records}</Text>
          <Text style={styles.statLabel}>Records</Text>
        </PortalCard>

        <PortalCard style={styles.statCard}>
          <Text style={styles.statIcon}>✅</Text>
          <Text style={styles.statValue}>{stats.completedDays}</Text>
          <Text style={styles.statLabel}>Completed Days</Text>
        </PortalCard>

        <PortalCard style={styles.statCard}>
          <Text style={styles.statIcon}>⏱️</Text>
          <Text style={styles.statValue}>{stats.totalHours}</Text>
          <Text style={styles.statLabel}>Working Hours</Text>
        </PortalCard>
      </View>

      <PortalCard style={styles.filterCard}>
        <Text style={styles.sectionTitle}>Filter Attendance</Text>

        <View style={styles.presetRow}>
          <Pressable
            onPress={() => loadPreset("7")}
            style={[
              styles.presetButton,
              selectedRange === "7" && styles.presetButtonActive,
            ]}
          >
            <Text
              style={[
                styles.presetText,
                selectedRange === "7" && styles.presetTextActive,
              ]}
            >
              Last 7 Days
            </Text>
          </Pressable>

          <Pressable
            onPress={() => loadPreset("30")}
            style={[
              styles.presetButton,
              selectedRange === "30" && styles.presetButtonActive,
            ]}
          >
            <Text
              style={[
                styles.presetText,
                selectedRange === "30" && styles.presetTextActive,
              ]}
            >
              Last 30 Days
            </Text>
          </Pressable>
        </View>

        <View style={styles.dateRow}>
          <View style={styles.fieldColumn}>
            <Text style={styles.label}>From Date</Text>

            <TextInput
              value={from}
              onChangeText={setFrom}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>

          <View style={styles.fieldColumn}>
            <Text style={styles.label}>To Date</Text>

            <TextInput
              value={to}
              onChangeText={setTo}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.buttonWrap}>
          <GradientButton
            title={loading ? "Loading..." : "Apply Custom Range"}
            disabled={loading}
            onPress={applyCustomRange}
          />
        </View>
      </PortalCard>

      <PortalCard style={styles.correctionCard}>
        <Text style={styles.sectionTitle}>Request Attendance Correction</Text>
        <Text style={styles.correctionIntro}>
          Submit corrected times for a missed or inaccurate attendance record.
        </Text>

        {correctionMessage ? <Text style={styles.correctionSuccess}>{correctionMessage}</Text> : null}
        {correctionError ? <Text style={styles.correctionError}>{correctionError}</Text> : null}

        <View style={styles.dateRow}>
          <CorrectionField label="Attendance Date" value={correctionDate} onChange={setCorrectionDate} placeholder="YYYY-MM-DD" />
          <CorrectionField label="Check In" value={checkInTime} onChange={setCheckInTime} placeholder="HH:MM" />
          <CorrectionField label="Check Out (optional)" value={checkOutTime} onChange={setCheckOutTime} placeholder="HH:MM" />
        </View>

        <Text style={[styles.label, styles.reasonLabel]}>Reason</Text>
        <TextInput
          value={correctionReason}
          onChangeText={setCorrectionReason}
          placeholder="Explain why this attendance record needs correction"
          placeholderTextColor="#94A3B8"
          multiline
          maxLength={500}
          style={[styles.input, styles.reasonInput]}
        />

        <View style={styles.buttonWrap}>
          <GradientButton title={correctionBusy ? "Submitting..." : "Submit Correction"} disabled={correctionBusy} onPress={submitCorrection} />
        </View>

        {corrections.slice(0, 5).map((item) => (
          <View key={item._id} style={styles.correctionStatusRow}>
            <Text style={styles.correctionStatusDate}>{item.attendanceDate}</Text>
            <Text style={styles.correctionStatusText}>{item.status.toUpperCase()}</Text>
          </View>
        ))}
      </PortalCard>

      <View style={styles.recordsHeader}>
        <Text style={styles.sectionTitle}>Attendance Timeline</Text>
        <Text style={styles.recordCount}>{records.length} records</Text>
      </View>

      <View style={styles.timeline}>
        {records.length === 0 ? (
          <PortalCard>
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyTitle}>No attendance records</Text>
              <Text style={styles.emptyText}>
                Try selecting a different date range.
              </Text>
            </View>
          </PortalCard>
        ) : (
          records.map((item, index) => (
            <View key={item._id} style={styles.timelineItem}>
              <View style={styles.timelineRail}>
                <View style={styles.timelineDot} />
                {index < records.length - 1 ? (
                  <View style={styles.timelineLine} />
                ) : null}
              </View>

              <PortalCard style={styles.recordCard}>
                <View style={styles.recordTop}>
                  <View>
                    <Text style={styles.recordDate}>
                      {item.attendanceDate}
                    </Text>

                    <Text style={styles.recordStatus}>
                      {item.checkOutAt ? "Completed" : "In Progress"}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      item.checkOutAt
                        ? styles.completedPill
                        : styles.progressPill,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        item.checkOutAt
                          ? styles.completedText
                          : styles.progressText,
                      ]}
                    >
                      {item.checkOutAt ? "✓ Complete" : "● Active"}
                    </Text>
                  </View>
                </View>

                <View style={styles.recordDetails}>
                  <Detail
                    icon="🟢"
                    label="Check In"
                    value={formatTime(item.checkInAt)}
                  />

                  <Detail
                    icon="🔵"
                    label="Check Out"
                    value={formatTime(item.checkOutAt)}
                  />

                  <Detail
                    icon="⏱️"
                    label="Working Hours"
                    value={`${(item.totalWorkingHours || 0).toFixed(2)} hrs`}
                  />
                </View>
              </PortalCard>
            </View>
          ))
        )}
      </View>
    </PortalPage>
  );
}

function CorrectionField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <View style={styles.fieldColumn}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#94A3B8" style={styles.input} />
    </View>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailIcon}>{icon}</Text>

      <View>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

function formatTime(value?: string) {
  if (!value) return "—";

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },

  statCard: {
    flex: 1,
    minWidth: 200,
    alignItems: "center",
  },

  statIcon: {
    fontSize: 27,
  },

  statValue: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "800",
    marginTop: 8,
  },

  statLabel: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: 4,
  },

  filterCard: {
    marginTop: 22,
  },

  correctionCard: {
    marginTop: 22,
  },

  correctionIntro: {
    color: colors.secondary,
    marginTop: 6,
  },

  correctionSuccess: {
    color: "#047857",
    fontWeight: "700",
    marginTop: 14,
  },

  correctionError: {
    color: "#B91C1C",
    fontWeight: "700",
    marginTop: 14,
  },

  reasonLabel: {
    marginTop: 16,
  },

  reasonInput: {
    minHeight: 90,
    paddingTop: 14,
    textAlignVertical: "top",
  },

  correctionStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 12,
  },

  correctionStatusDate: {
    color: colors.text,
    fontWeight: "700",
  },

  correctionStatusText: {
    color: colors.purple,
    fontSize: 11,
    fontWeight: "800",
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },

  presetRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  presetButton: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.border,
  },

  presetButtonActive: {
    backgroundColor: colors.purpleLight,
    borderColor: colors.purple,
  },

  presetText: {
    color: colors.secondary,
    fontWeight: "700",
  },

  presetTextActive: {
    color: colors.purple,
  },

  dateRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginTop: 18,
  },

  fieldColumn: {
    flex: 1,
    minWidth: 240,
  },

  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
  },

  input: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 15,
    color: colors.text,
    outlineStyle: "none" as any,
  },

  buttonWrap: {
    marginTop: 18,
  },

  recordsHeader: {
    marginTop: 28,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  recordCount: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "700",
  },

  timeline: {
    gap: 0,
  },

  timelineItem: {
    flexDirection: "row",
  },

  timelineRail: {
    width: 28,
    alignItems: "center",
  },

  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.purple,
    marginTop: 30,
  },

  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#DDD6FE",
  },

  recordCard: {
    flex: 1,
    marginBottom: 16,
  },

  recordTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  recordDate: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
  },

  recordStatus: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: 4,
  },

  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },

  completedPill: {
    backgroundColor: "#ECFDF5",
  },

  progressPill: {
    backgroundColor: "#EFF6FF",
  },

  statusPillText: {
    fontSize: 11,
    fontWeight: "800",
  },

  completedText: {
    color: colors.green,
  },

  progressText: {
    color: colors.blue,
  },

  recordDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 28,
    marginTop: 18,
  },

  detail: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 150,
  },

  detailIcon: {
    fontSize: 18,
    marginRight: 9,
  },

  detailLabel: {
    color: colors.secondary,
    fontSize: 11,
  },

  detailValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 3,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 35,
  },

  emptyEmoji: {
    fontSize: 38,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 12,
  },

  emptyText: {
    color: colors.secondary,
    marginTop: 5,
  },
});
