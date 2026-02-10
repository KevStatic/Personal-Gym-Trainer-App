import { useTheme } from "@/src/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenWrapperProps = PropsWithChildren;

export default function ScreenWrapper({ children }: ScreenWrapperProps) {
  const { themeColors } = useTheme();
  const gradientColors =
    themeColors.background === "#0A0A0A"
      ? (["#0b1220", "#0A0A0A"] as const)
      : (["#e0e7ff", "#ffffff"] as const);

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 14 }}>{children}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}
