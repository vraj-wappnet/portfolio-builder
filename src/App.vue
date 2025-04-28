<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useThemeStore } from "./stores/themeStore";

const router = useRouter();
const themeStore = useThemeStore();

onMounted(() => {
  themeStore.initializeTheme(); // Apply theme on mount
});
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
        @click="themeStore.toggleDarkMode"
        aria-label="Toggle dark mode"
      >
        <span v-if="themeStore.darkMode">🔆</span>
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
