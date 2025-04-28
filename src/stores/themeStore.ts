import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore(
  "theme",
  () => {
    const darkMode = ref(false);

    // Apply theme to document when darkMode changes
    watch(darkMode, (newValue) => {
      if (newValue) {
        document.documentElement.classList.add("dark-mode");
      } else {
        document.documentElement.classList.remove("dark-mode");
      }
    });

    // Toggle dark mode
    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value;
    };

    // Initialize theme on store creation
    const initializeTheme = () => {
      if (darkMode.value) {
        document.documentElement.classList.add("dark-mode");
      } else {
        document.documentElement.classList.remove("dark-mode");
      }
    };

    return {
      darkMode,
      toggleDarkMode,
      initializeTheme,
    };
  },
  {
    persist: {
      key: "themeData",
      storage: localStorage,
    },
  }
);
