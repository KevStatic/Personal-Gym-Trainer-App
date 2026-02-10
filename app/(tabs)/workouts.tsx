import ScreenWrapper from "@/src/components/ScreenWrapper";
import { useTheme } from "@/src/context/ThemeContext";
import { typography } from "@/src/theme/typography";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type WorkoutIconName = ComponentProps<typeof Ionicons>["name"];

const workouts: { id: string; title: string; subtitle: string; icon: WorkoutIconName }[] = [
  { id: "1", title: "Push Day", subtitle: "Chest • Shoulders • Triceps", icon: "barbell-outline" },
  { id: "2", title: "Pull Day", subtitle: "Back • Biceps", icon: "fitness-outline" },
  { id: "3", title: "Leg Day", subtitle: "Quads • Hamstrings • Glutes", icon: "walk-outline" },
  { id: "4", title: "Core Strength", subtitle: "Abs • Lower Back", icon: "body-outline" },
];

type WorkoutItem = (typeof workouts)[number];

export default function WorkoutsScreen() {
  const { themeColors } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: themeColors.card,
      padding: 16,
      borderRadius: 16,
      marginBottom: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    cardLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 2,
      color: themeColors.text,
    },

    cardSubtitle: {
      fontSize: 13,
      color: themeColors.muted,
    },

    dayBubble: {
      backgroundColor: "#e5e7eb",
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 20,
      marginRight: 10,
    },

    dayBubbleActive: {
      backgroundColor: themeColors.primary,
    },

    dayText: {
      fontSize: 14,
      color: themeColors.text,
    },

    dayTextActive: {
      color: "white",
      fontWeight: "600",
    },
  });

  const renderItem = ({ item }: { item: WorkoutItem }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardLeft}>
        <Ionicons name={item.icon} size={28} color={themeColors.primary} />
        <View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={themeColors.muted} />
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <Text style={typography.h2}>Workouts</Text>
      <Text style={[typography.small, { marginBottom: 20 }]}>
        Your weekly training plan
      </Text>

      {/* Weekly Calendar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20 }}
      >
        {[
          { day: "Mon", active: true },
          { day: "Tue" },
          { day: "Wed" },
          { day: "Thu" },
          { day: "Fri" },
          { day: "Sat" },
          { day: "Sun" },
        ].map((d, index) => (
          <View
            key={index}
            style={[
              styles.dayBubble,
              d.active && styles.dayBubbleActive
            ]}
          >
            <Text
              style={[
                styles.dayText,
                d.active && styles.dayTextActive
              ]}
            >
              {d.day}
            </Text>
          </View>
        ))}
      </ScrollView>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}
