import ScreenWrapper from "@/src/components/ScreenWrapper";
import { useTheme } from "@/src/context/ThemeContext";
import { typography } from "@/src/theme/typography";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AICoachScreen() {
  const { themeColors } = useTheme();

  const [messages, setMessages] = useState([
    { id: "1", sender: "ai", text: "Hey! I'm your AI fitness trainer. How can I help you today? 💪" },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: dayjs().format("h:mm A")
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // TODO: integrate AI response here
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "ai",
          text: "This is where the AI reply will appear once integrated! 😊",
          timestamp: dayjs().format("h:mm A")
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const renderItem = ({ item }: { item: { id: string; sender: string; text: string; timestamp?: string } }) => {
    const isUser = item.sender === "user";

    return (
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text style={{ color: isUser ? "white" : themeColors.text }}>{item.text}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    messageBubble: {
      maxWidth: "75%",
      padding: 12,
      marginVertical: 6,
      borderRadius: 12,
    },

    userBubble: {
      backgroundColor: themeColors.primary,
      alignSelf: "flex-end",
    },

    aiBubble: {
      backgroundColor: themeColors.card,
      alignSelf: "flex-start",
    },

    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: themeColors.card,
      padding: 10,
      borderRadius: 14,
      marginTop: 10,
    },

    input: {
      flex: 1,
      fontSize: 16,
      paddingHorizontal: 10,
      color: themeColors.text,
    },

    sendButton: {
      backgroundColor: themeColors.primary,
      padding: 12,
      borderRadius: 12,
      marginLeft: 8,
    },

    timestamp: {
      fontSize: 10,
      marginTop: 4,
      color: themeColors.muted,
    },

    typingBubble: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 10,
      paddingHorizontal: 10,
    },

    quickRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 14,
    },

    quickButton: {
      backgroundColor: themeColors.card,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 12,
    },

    quickText: {
      fontSize: 13,
      color: themeColors.text,
    },
  });

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={typography.h2}>AI Coach</Text>
        <Text style={[typography.small, { marginBottom: 14, color: themeColors.muted }]}>
          Ask anything about workouts, diet, or training.
        </Text>

        <View style={styles.quickRow}>
          {["Give me today's workout", "Suggest a diet", "Fix my form"].map((q) => (
            <TouchableOpacity
              key={q}
              style={styles.quickButton}
              onPress={() => setInput(q)}
            >
              <Text style={styles.quickText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 10 }}
        />

        {isTyping && (
          <View style={styles.typingBubble}>
            <Ionicons name="ellipsis-horizontal" size={24} color={themeColors.muted} />
            <Text style={{ color: themeColors.muted }}>AI is typing...</Text>
          </View>
        )}

        {/* Input Box */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask your coach..."
            placeholderTextColor={themeColors.muted}
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
