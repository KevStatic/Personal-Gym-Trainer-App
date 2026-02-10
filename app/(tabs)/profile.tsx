import ScreenWrapper from "@/src/components/ScreenWrapper";
import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import { typography } from "@/src/theme/typography";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { signOut, user, isAuthLoading } = useAuth();
  const { theme, setTheme, themeColors } = useTheme();

  const handleLogout = async () => {
    await signOut();
    router.replace("/auth/login");
  };

  const styles = StyleSheet.create({
    header: {
      alignItems: "center",
      marginBottom: 24,
    },

    avatar: {
      width: 90,
      height: 90,
      borderRadius: 45,
      marginBottom: 12,
    },

    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 30,
    },

    statBox: {
      backgroundColor: themeColors.card,
      width: "31%",
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: "center",
    },

    statValue: {
      fontSize: 18,
      fontWeight: "700",
      color: themeColors.text,
    },

    statLabel: {
      fontSize: 13,
      color: themeColors.muted,
    },

    section: {
      marginBottom: 26,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: themeColors.text,
      marginBottom: 14,
    },

    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: themeColors.card,
      padding: 14,
      borderRadius: 12,
      marginBottom: 10,
      gap: 14,
    },

    settingText: {
      fontSize: 16,
      color: themeColors.text,
    },

    logoutButton: {
      marginTop: 10,
      backgroundColor: "#dc2626",
      padding: 14,
      borderRadius: 12,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },

    logoutText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
  });

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png" }}
            style={styles.avatar}
          />
          <Text style={[typography.h2, { color: themeColors.text }]}>
            {user?.name ?? "John Doe"}
          </Text>
          <Text style={[typography.small, { color: themeColors.muted }]}>
            {user?.email ?? "Fitness Level: Intermediate"}
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>72 kg</Text>
            <Text style={styles.statLabel}>Weight</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>178 cm</Text>
            <Text style={styles.statLabel}>Height</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>22</Text>
            <Text style={styles.statLabel}>BMI</Text>
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="person-outline" size={22} color={themeColors.primary} />
            <Text style={styles.settingText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="barbell-outline" size={22} color={themeColors.primary} />
            <Text style={styles.settingText}>Fitness Goals</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="stats-chart-outline" size={22} color={themeColors.primary} />
            <Text style={styles.settingText}>Progress Tracking</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="notifications-outline" size={22} color={themeColors.primary} />
            <Text style={styles.settingText}>Notifications</Text>
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <Ionicons name="color-palette-outline" size={22} color={themeColors.primary} />
            <Text style={styles.settingText}>Theme</Text>

            <View style={{ marginLeft: "auto", flexDirection: "row", gap: 6 }}>
              <TouchableOpacity
                onPress={() => setTheme("light")}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                  backgroundColor: theme === "light" ? themeColors.primary : themeColors.card,
                }}
              >
                <Text style={{ color: theme === "light" ? "white" : themeColors.text, fontSize: 12 }}>
                  Light
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setTheme("dark")}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                  backgroundColor: theme === "dark" ? themeColors.primary : themeColors.card,
                }}
              >
                <Text style={{ color: theme === "dark" ? "white" : themeColors.text, fontSize: 12 }}>
                  Dark
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setTheme("system")}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                  backgroundColor: theme === "system" ? themeColors.primary : themeColors.card,
                }}
              >
                <Text style={{ color: theme === "system" ? "white" : themeColors.text, fontSize: 12 }}>
                  System
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="shield-checkmark-outline" size={22} color={themeColors.primary} />
            <Text style={styles.settingText}>Privacy & Security</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, isAuthLoading && { opacity: 0.7 }]}
          onPress={handleLogout}
          disabled={isAuthLoading}
        >
          <Ionicons name="log-out-outline" size={22} color="white" />
          <Text style={styles.logoutText}>{isAuthLoading ? "Logging out..." : "Logout"}</Text>
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  );
}
