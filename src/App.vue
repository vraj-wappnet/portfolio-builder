<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

const darkMode = ref(false);
const router = useRouter();

onMounted(() => {
  // Check if user has a saved dark mode preference
  const savedDarkMode = localStorage.getItem("darkMode");
  if (savedDarkMode) {
    darkMode.value = JSON.parse(savedDarkMode);
    if (darkMode.value) {
      document.documentElement.classList.add("dark-mode");
    }
  }
});

watch(darkMode, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add("dark-mode");
  } else {
    document.documentElement.classList.remove("dark-mode");
  }
  localStorage.setItem("darkMode", JSON.stringify(newValue));
});

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
};
</script>

<template>
  <header class="app-header">
    <div class="container flex justify-between items-center">
      <div class="logo">
        <h1 @click="router.push('/')" style="cursor: pointer">
          Portfolio Builder
        </h1>
      </div>
      <button
        class="theme-toggle"
        @click="toggleDarkMode"
        aria-label="Toggle dark mode"
      >
        <span v-if="darkMode">🌞</span>
        <span v-else>🌙</span>
      </button>
    </div>
  </header>

  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>

<style scoped>
.app-header {
  padding: var(--space-4) 0;
  margin-bottom: var(--space-4);
}

.theme-toggle {
  background-color: var(--color-neutral-200);
  border-radius: var(--radius-full);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: background-color 0.3s;
}

.theme-toggle:hover {
  background-color: var(--color-neutral-300);
}
</style>
