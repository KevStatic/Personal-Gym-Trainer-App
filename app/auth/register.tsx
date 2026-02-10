import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
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

import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";

export default function RegisterScreen() {
  const { signUp, isAuthLoading, isBackendConfigured } = useAuth();
  const { themeColors } = useTheme();
  const isDark = themeColors.background === "#0A0A0A";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);

  const handleCreateAccount = async () => {
    const result = await signUp(name, email, password);

    if (!result.ok) {
      setFormSuccess("");
      setVerificationSent(false);
      setFormError(result.error ?? "Unable to create account. Please try again.");
      return;
    }

    if (result.requiresEmailVerification) {
      setFormError("");
      setVerificationSent(true);
      setFormSuccess(result.message ?? "Verify your email before signing in.");
      return;
    }

    setVerificationSent(false);
    setFormSuccess(result.message ?? "");
    setFormError("");
    router.replace("/");
  };

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
    errorText: {
      color: "#ef4444",
      fontSize: 13,
      fontWeight: "600",
    },
    successText: {
      color: "#22c55e",
      fontSize: 13,
      fontWeight: "600",
    },
    warningText: {
      color: "#f59e0b",
      fontSize: 13,
      fontWeight: "600",
    },
    helperText: {
      fontSize: 12,
      color: themeColors.muted,
      textAlign: "center",
    },
    infoText: {
      fontSize: 12,
      color: themeColors.muted,
      textAlign: "center",
    },
    footerRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
      marginTop: 10,
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
                <Ionicons name="sparkles-outline" size={26} color={themeColors.primary} />
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Start building your best routine today.</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.field}>
                <Text style={styles.label}>Full name</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name="person-outline" size={18} color={themeColors.muted} />
                  <TextInput
                    style={styles.input}
                    placeholder="Jane Athlete"
                    placeholderTextColor={themeColors.muted}
                    value={name}
                    onChangeText={setName}
                    selectionColor={themeColors.primary}
                  />
                </View>
              </View>

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
                    placeholder="Create a strong password"
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

              <LinearGradient
                colors={[themeColors.primary, isDark ? "#3b82f6" : "#1d4ed8"]}
                style={styles.primaryButton}
              >
                <TouchableOpacity
                  style={styles.primaryButtonInner}
                  activeOpacity={0.85}
                  onPress={handleCreateAccount}
                  disabled={isAuthLoading || verificationSent}
                >
                  <Text style={styles.primaryButtonText}>
                    {verificationSent
                      ? "Verification Email Sent"
                      : isAuthLoading
                        ? "Creating Account..."
                        : "Create Account"}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>

              {!isBackendConfigured && (
                <Text style={styles.warningText}>
                  Add Supabase keys in your .env to enable real authentication.
                </Text>
              )}

              {!!formError && <Text style={styles.errorText}>{formError}</Text>}
              {!!formSuccess && <Text style={styles.successText}>{formSuccess}</Text>}
              {verificationSent && (
                <Text style={styles.infoText}>
                  Open your inbox, verify your account, then use Sign in.
                </Text>
              )}

              <Text style={styles.helperText}>
                By continuing, you agree to our Terms and Privacy Policy.
              </Text>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <Link href="/auth/login" asChild>
                  <Text style={styles.footerLink}>Sign in</Text>
                </Link>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
