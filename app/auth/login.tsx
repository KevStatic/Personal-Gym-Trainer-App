import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/src/context/ThemeContext";

export default function LoginScreen() {
  const { themeColors } = useTheme();
  const isDark = themeColors.background === "#0A0A0A";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const gradientColors = isDark
    ? (["#0b1220", "#0A0A0A"] as const)
    : (["#e0e7ff", "#ffffff"] as const);

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      paddingBottom: 32,
    },
    header: {
      alignItems: "center",
      marginTop: 8,
      marginBottom: 28,
      gap: 8,
    },
    logoWrap: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: isDark ? "#111827" : "#ffffff",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: isDark ? "#1f2937" : "#e5e7eb",
      shadowColor: "#000",
      shadowOpacity: isDark ? 0.4 : 0.12,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: themeColors.text,
    },
    subtitle: {
      fontSize: 15,
      color: themeColors.muted,
      textAlign: "center",
    },
    card: {
      backgroundColor: isDark ? "#0f172a" : "#ffffff",
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: isDark ? "#1f2937" : "#e5e7eb",
      shadowColor: "#000",
      shadowOpacity: isDark ? 0.45 : 0.15,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
      gap: 16,
    },
    field: {
      gap: 8,
    },
    label: {
      fontSize: 13,
      color: themeColors.muted,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    inputWrap: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark ? "#0b1220" : "#f3f4f6",
      borderRadius: 12,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: isDark ? "#1f2937" : "#e5e7eb",
    },
    input: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
      color: themeColors.text,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    remember: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    checkbox: {
      width: 18,
      height: 18,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: isDark ? "#2f3a4f" : "#cbd5f5",
      backgroundColor: isDark ? "#111827" : "#eef2ff",
    },
    linkText: {
      color: themeColors.primary,
      fontWeight: "600",
      fontSize: 13,
    },
    primaryButton: {
      borderRadius: 14,
      overflow: "hidden",
    },
    primaryButtonInner: {
      paddingVertical: 14,
      alignItems: "center",
    },
    primaryButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "700",
    },
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: isDark ? "#1f2937" : "#e5e7eb",
    },
    dividerText: {
      fontSize: 12,
      color: themeColors.muted,
    },
    socialRow: {
      flexDirection: "row",
      gap: 12,
    },
    socialButton: {
      flex: 1,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? "#1f2937" : "#e5e7eb",
      paddingVertical: 12,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
      backgroundColor: isDark ? "#0b1220" : "#ffffff",
    },
    socialText: {
      color: themeColors.text,
      fontWeight: "600",
      fontSize: 14,
    },
    footerRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
    },
    footerText: {
      color: themeColors.muted,
      fontSize: 14,
    },
    footerLink: {
      color: themeColors.primary,
      fontWeight: "700",
      fontSize: 14,
    },
  });

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <View style={styles.logoWrap}>
                <Ionicons name="barbell-outline" size={28} color={themeColors.primary} />
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to keep your training on track.</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name="mail-outline" size={18} color={themeColors.muted} />
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor={themeColors.muted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    selectionColor={themeColors.primary}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name="lock-closed-outline" size={18} color={themeColors.muted} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={themeColors.muted}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    selectionColor={themeColors.primary}
                  />
                  <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color={themeColors.muted}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.remember}>
                  <View style={styles.checkbox} />
                  <Text style={styles.footerText}>Remember me</Text>
                </View>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.linkText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              <LinearGradient
                colors={[themeColors.primary, isDark ? "#3b82f6" : "#1d4ed8"]}
                style={styles.primaryButton}
              >
                <TouchableOpacity style={styles.primaryButtonInner} activeOpacity={0.85}>
                  <Text style={styles.primaryButtonText}>Sign In</Text>
                </TouchableOpacity>
              </LinearGradient>

              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialButton} activeOpacity={0.85}>
                  <Ionicons name="logo-google" size={18} color={themeColors.text} />
                  <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton} activeOpacity={0.85}>
                  <Ionicons name="logo-apple" size={18} color={themeColors.text} />
                  <Text style={styles.socialText}>Apple</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>New here?</Text>
                <Link href="/auth/register" asChild>
                  <Text style={styles.footerLink}>Create an account</Text>
                </Link>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
