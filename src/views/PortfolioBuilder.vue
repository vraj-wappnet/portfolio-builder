<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePortfolioStore } from "../stores/portfolio";

const route = useRoute();
const router = useRouter();
const portfolioStore = usePortfolioStore();

// Track if PortfolioPreview has been visited
const hasVisitedPreview = ref(false);

// Define the steps for the portfolio builder
const steps = [
  {
    name: "ProfileSetup",
    label: "Profile",
    icon: "🧑🏻‍🦲",
    path: "/portfolio-builder/profile-setup",
  },
  {
    name: "ServicesOffered",
    label: "Services",
    icon: "🛠️",
    path: "/portfolio-builder/services",
  },
  {
    name: "ProjectGallery",
    label: "Projects",
    icon: "🖼️",
    path: "/portfolio-builder/projects",
  },
  {
    name: "Testimonials",
    label: "Testimonials",
    icon: "⭐",
    path: "/portfolio-builder/testimonials",
  },
  {
    name: "Availability",
    label: "Availability",
    icon: "📅",
    path: "/portfolio-builder/availability",
  },
  {
    name: "PortfolioPreview",
    label: "Preview",
    icon: "👁️",
    path: "/portfolio-builder/preview",
  },
  {
    name: "ExportPublish",
    label: "Export",
    icon: "📤",
    path: "/portfolio-builder/export",
  },
];

// Get the current step index based on the route
const currentStepIndex = computed(() => {
  const routeName = route.name as string;
  return steps.findIndex((step) => step.name === routeName);
});

// Watch for route changes to update hasVisitedPreview
watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName === "PortfolioPreview") {
      hasVisitedPreview.value = true;
    }
  }
);

// Determine if steps are completed
const isStepCompleted = computed(() => {
  return {
    ProfileSetup: portfolioStore.isProfileComplete,
    ServicesOffered: portfolioStore.isServicesComplete,
    ProjectGallery: portfolioStore.isProjectsComplete,
    Testimonials: portfolioStore.isTestimonialsComplete,
    Availability: portfolioStore.isAvailabilityComplete,
    PortfolioPreview: hasVisitedPreview.value, // True only if visited
  };
});

// Navigation functions
const goToStep = (stepPath: string) => {
  router.push(stepPath);
};

const goNext = () => {
  if (currentStepIndex.value < steps.length - 1) {
    router.push(steps[currentStepIndex.value + 1].path);
  }
};

const goPrevious = () => {
  if (currentStepIndex.value > 0) {
    router.push(steps[currentStepIndex.value - 1].path);
  }
};

// Auto-save functionality
const autoSaveMessage = ref("");
const showAutoSaveMessage = ref(false);

watch(
  () => portfolioStore.lastUpdated,
  () => {
    if (portfolioStore.lastUpdated) {
      autoSaveMessage.value = `Auto-saved at ${new Date(
        portfolioStore.lastUpdated
      ).toLocaleTimeString()}`;
      showAutoSaveMessage.value = true;
      setTimeout(() => {
        showAutoSaveMessage.value = false;
      }, 3000);
    }
  }
);
</script>
<template>
  <div class="portfolio-builder">
    <div class="stepper-container">
      <div class="stepper">
        <div
          v-for="(step, index) in steps"
          :key="step.name"
          class="step"
          :class="{ 
            'active': index === currentStepIndex,
            'completed': isStepCompleted[step.name as keyof typeof isStepCompleted]
          }"
          @click="goToStep(step.path)"
        >
          <div class="step-icon">
            <span>{{ step.icon }}</span>
          </div>
          <div class="step-label">{{ step.label }}</div>
          <div v-if="index < steps.length - 1" class="step-line"></div>
        </div>
      </div>
    </div>

    <div class="step-content">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>

    <div class="step-navigation">
      <button
        v-if="currentStepIndex > 0"
        @click="goPrevious"
        class="btn btn-outline"
      >
        Previous
      </button>

      <div class="autosave-message" v-if="showAutoSaveMessage">
        {{ autoSaveMessage }}
      </div>

      <button
        v-if="currentStepIndex < steps.length - 1"
        @click="goNext"
        class="btn btn-primary"
      >
        Next
      </button>
    </div>
  </div>
</template>
<style scoped>
.portfolio-builder {
  padding: var(--space-4) 0;
}

.stepper-container {
  margin-bottom: var(--space-6);
  overflow-x: auto;
}

.stepper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  cursor: pointer;
  transition: all 0.3s ease;
}

.step-icon {
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--color-neutral-200);
  color: var(--color-neutral-700);
  margin-bottom: var(--space-2);
  margin-top: var(--space-2);
  font-size: 1.5rem;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  box-shadow: 0 0 0 2px white;
}

.step:hover .step-icon {
  transform: scale(1.05);
  box-shadow: 0 0 0 3px var(--color-primary);
}

.step.active .step-icon {
  background-color: var(--color-primary);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 0 0 4px var(--color-primary-light);
}

.step.completed .step-icon {
  background-color: var(--color-success);
  color: white;
}

.step.completed .step-icon::after {
  content: "✓";
  position: absolute;
  font-size: 1rem;
  font-weight: bold;
  color: white;
}

.step-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-neutral-600);
  text-align: center;
  transition: all 0.3s ease;
}

.step.active .step-label {
  color: var(--color-primary);
  font-weight: 600;
}

.step-line {
  content: "";
  position: absolute;
  top: 26px;
  left: 50%;
  width: 100%;
  height: 3px;
  background: linear-gradient(
    to right,
    var(--color-neutral-300),
    var(--color-neutral-300)
  );
  z-index: 1;
}

.step:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 26px;
  left: 50%;
  width: 100%;
  height: 3px;
  background: linear-gradient(
    to right,
    var(--color-neutral-300),
    var(--color-neutral-300)
  );
  z-index: 1;
}

.step.completed:not(:last-child)::after {
  background: linear-gradient(
    to right,
    var(--color-success),
    var(--color-success)
  );
}

.step-content {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-5);
  margin-bottom: var(--space-5);
  min-height: 400px;
}

.step-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) 0;
}

.autosave-message {
  color: var(--color-neutral-600);
  font-size: var(--text-sm);
  opacity: 0.8;
}

@media (max-width: 768px) {
  .stepper {
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 0.75rem;
  }

  .step-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .step-label {
    font-size: 0.7rem;
  }

  .step-line {
    top: 22px;
  }
}

.dark-mode .step-content {
  background-color: var(--color-neutral-100);
}
</style>
