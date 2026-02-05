import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import { lightColors, darkColors } from "@/src/theme/color";

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

type ThemeProviderProps = React.PropsWithChildren;

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemScheme = Appearance.getColorScheme(); // "light" or "dark"
  const [theme, setTheme] = useState<ThemeType>("system");
  const [themeColors, setThemeColors] = useState(
    systemScheme === "dark" ? darkColors : lightColors
  );

  useEffect(() => {
    const resolvedTheme = theme === "system" ? systemScheme : theme;

    setThemeColors(resolvedTheme === "dark" ? darkColors : lightColors);

    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === "system") {
        setThemeColors(colorScheme === "dark" ? darkColors : lightColors);
      }
    });

    return () => listener.remove();
  }, [theme, systemScheme]);

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
