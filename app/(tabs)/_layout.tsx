import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, Tabs } from "expo-router";

export default function TabsLayout() {
  const { isAuthenticated, isAuthInitializing } = useAuth();
  const { themeColors } = useTheme();

  if (isAuthInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={
        themeColors.background === "#0A0A0A"
          ? ["#0A0A0A", "#151515"]  // dark mode
          : ["#e0e7ff", "#ffffff"]  // light mode
      }
    >
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: themeColors.tabActive,
          tabBarInactiveTintColor: themeColors.tabInactive,
          tabBarStyle: {
            backgroundColor: themeColors.tabBackground,
            borderTopWidth: 0.4,
            borderTopColor: themeColors.border,
            height: 70,
            paddingBottom: 14,
            paddingTop: 6,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName: any;

            if (route.name === "index") iconName = "home-outline";
            if (route.name === "coach") iconName = "chatbubble-ellipses-outline";
            if (route.name === "workouts") iconName = "barbell-outline";
            if (route.name === "profile") iconName = "person-outline";

            return <Ionicons name={iconName} size={22} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="coach" options={{ title: "Coach" }} />
        <Tabs.Screen name="workouts" options={{ title: "Workouts" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
    </LinearGradient>
  );
}
