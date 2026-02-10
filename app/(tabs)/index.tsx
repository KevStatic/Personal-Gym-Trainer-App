import ScreenWrapper from "@/src/components/ScreenWrapper";
import { typography } from "@/src/theme/typography";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const { theme, themeColors } = useTheme();
  const isDark = themeColors.background === "#0A0A0A";

  const styles = StyleSheet.create({
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 25,
    },

    statCard: {
      backgroundColor: themeColors.card,
      width: "30%",
      paddingVertical: 18,
      borderRadius: 14,
      alignItems: "center",
      gap: 6,
    },

    statValue: {
      fontSize: 22,
      fontWeight: "700",
      color: themeColors.text,
    },

    statLabel: {
      marginTop: 4,
      fontSize: 14,
      color: themeColors.muted,
    },

    workoutCard: {
      backgroundColor: "#eef2ff",
      padding: 20,
      borderRadius: 16,
      marginBottom: 25,
    },

    workoutTitle: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 4,
    },

    workoutSubtitle: {
      color: themeColors.muted,
      marginBottom: 16,
    },

    startButton: {
      backgroundColor: themeColors.primary,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: "center",
    },

    startButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },

    aiCard: {
      backgroundColor: isDark ? "#1b2233" : "#fef3c7",
      padding: 18,
      borderRadius: 16,
    },

    aiTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 6,
      color: themeColors.text,
    },

    aiText: {
      fontSize: 15,
      color: themeColors.text,
    },
  });

  return (
    <LinearGradient
      colors={
        theme === "dark"
          ? ["#0A0A0A", "#151515"] // Dark mode gradient
          : ["#e0e7ff", "#ffffff"] // Light mode gradient
      }
      style={{ flex: 1 }}
    >
      <ScreenWrapper>
        {/* Greeting */}
        <Text style={typography.h2}>Welcome back, User! 👋</Text>
        <Text style={[typography.body, { marginBottom: 20 }]}>
          Here is your activity summary for today.
        </Text>

        {/* Quick Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="flame-outline" size={26} color={themeColors.primary} />
            <Text style={styles.statValue}>320</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={26} color={themeColors.primary} />
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="walk-outline" size={26} color={themeColors.primary} />
            <Text style={styles.statValue}>6,421</Text>
            <Text style={styles.statLabel}>Steps</Text>
          </View>
        </View>

        {/* Recommended Workout Card */}
        <View style={styles.workoutCard}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="barbell-outline" size={22} color={themeColors.primary} />
            <Text style={styles.workoutTitle}>{"Today's Workout"}</Text>
          </View>
          <Text style={styles.workoutSubtitle}>Push Day • Chest + Triceps</Text>

          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        </View>

        {/* AI suggestion */}
        <View style={styles.aiCard}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="bulb-outline" size={22} color="#d97706" />
            <Text style={styles.aiTitle}>AI Tip of the Day</Text>
          </View>
          <Text style={styles.aiText}>
            Increase your protein intake by 10–20g today to support muscle
            recovery and overall progression.
          </Text>
        </View>
      </ScreenWrapper>
    </LinearGradient>
  );
}
