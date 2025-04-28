<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  UserCircleIcon,
  WrenchScrewdriverIcon,
  PhotoIcon,
  StarIcon,
  CalendarDaysIcon,
  ShareIcon,
  ArrowRightIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();

const startBuilding = () => {
  router.push("/portfolio-builder/profile-setup");
};

const features = ref([
  {
    title: "Professional Profile Setup",
    description:
      "Create your personal brand with a professional bio, avatar, and essential contact information",
    icon: UserCircleIcon,
  },
  {
    title: "Showcase Your Services",
    description:
      "Highlight your offerings with detailed service descriptions, pricing, and delivery times",
    icon: WrenchScrewdriverIcon,
  },
  {
    title: "Project Gallery",
    description:
      "Display your best work with an impressive portfolio of projects with images and descriptions",
    icon: PhotoIcon,
  },
  {
    title: "Client Testimonials",
    description:
      "Build trust with potential clients by showcasing feedback from satisfied customers",
    icon: StarIcon,
  },
  {
    title: "Availability Calendar",
    description:
      "Let clients know when you're available with an interactive schedule display",
    icon: CalendarDaysIcon,
  },
  {
    title: "Export & Share",
    description:
      "Download your portfolio as a PDF or share it online with a dedicated link",
    icon: ShareIcon,
  },
]);
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            Create Your Professional Freelancer Portfolio
          </h1>
          <p class="hero-subtitle">
            Build an impressive online presence in minutes with our easy-to-use
            portfolio builder
          </p>
          <div class="hero-actions">
            <button @click="startBuilding" class="btn btn-primary">
              Start Building Portfolio Now
              <ArrowRightIcon class="btn-icon" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2 class="section-title">What You Can Create</h2>
        <div class="features-grid">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="feature-card"
          >
            <div class="feature-icon">
              <component :is="feature.icon" class="icon" />
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  padding: var(--space-8) 0;
  text-align: center;
  margin-bottom: var(--space-8);
}

.hero-title {
  font-size: var(--text-4xl);
  margin-bottom: var(--space-3);
  color: var(--color-primary);
}

.hero-subtitle {
  font-size: var(--text-xl);
  max-width: 600px;
  margin: 0 auto var(--space-5) auto;
  color: var(--color-neutral-700);
}

.hero-actions {
  margin-top: var(--space-4);
}

.btn-icon {
  width: 1.2rem;
  height: 1.2rem;
  margin-left: 0.5rem;
  vertical-align: middle;
}

.section-title {
  text-align: center;
  margin-bottom: var(--space-5);
}

.features {
  padding: var(--space-8) 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-4);
}

.feature-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  margin-bottom: var(--space-3);
  color: var(--color-primary);
}

.icon {
  width: 2.5rem;
  height: 2.5rem;
}

.feature-title {
  margin-bottom: var(--space-2);
  color: var (--color-primary);
}

.feature-description {
  color: var(--color-neutral-700);
}

.dark-mode .feature-card {
  background-color: var(--color-neutral-100);
}

.dark-mode .feature-icon {
  color: var(--color-primary-light);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: var(--text-3xl);
  }

  .hero-subtitle {
    font-size: var(--text-lg);
  }

  .icon {
    width: 2rem;
    height: 2rem;
  }
}
</style>
