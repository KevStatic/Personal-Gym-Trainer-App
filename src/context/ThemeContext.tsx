import { darkColors, lightColors } from "@/src/theme/color";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

type ThemeType = "light" | "dark" | "system";

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (t: ThemeType) => void;
  themeColors: typeof lightColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "system",
  setTheme: () => {},
  themeColors: lightColors,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>("system");
  const [themeColors, setThemeColors] = useState(lightColors);

  useEffect(() => {
    const currentSystemTheme = Appearance.getColorScheme(); // dynamic value each time

    const resolvedTheme =
      theme === "system" ? currentSystemTheme : theme;

    setThemeColors(resolvedTheme === "dark" ? darkColors : lightColors);

    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === "system") {
        setThemeColors(colorScheme === "dark" ? darkColors : lightColors);
      }
    });

    return () => listener.remove();
  }, [theme]);

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeColors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);