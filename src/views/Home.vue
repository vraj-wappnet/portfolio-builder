<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const startBuilding = () => {
  router.push("/portfolio-builder/profile-setup");
};

const features = ref([
  {
    title: "Professional Profile Setup",
    description:
      "Create your personal brand with a professional bio, avatar, and essential contact information",
    icon: "👤",
  },
  {
    title: "Showcase Your Services",
    description:
      "Highlight your offerings with detailed service descriptions, pricing, and delivery times",
    icon: "🛠️",
  },
  {
    title: "Project Gallery",
    description:
      "Display your best work with an impressive portfolio of projects with images and descriptions",
    icon: "🖼️",
  },
  {
    title: "Client Testimonials",
    description:
      "Build trust with potential clients by showcasing feedback from satisfied customers",
    icon: "⭐",
  },
  {
    title: "Availability Calendar",
    description:
      "Let clients know when you're available with an interactive schedule display",
    icon: "📅",
  },
  {
    title: "Export & Share",
    description:
      "Download your portfolio as a PDF or share it online with a dedicated link",
    icon: "🔗",
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
              Start Building Now
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
            <div class="feature-icon">{{ feature.icon }}</div>
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
  font-size: 2.5rem;
  margin-bottom: var(--space-3);
}

.feature-title {
  margin-bottom: var(--space-2);
  color: var(--color-primary);
}

.feature-description {
  color: var(--color-neutral-700);
}

.cta {
  margin: var(--space-8) 0;
  padding: var(--space-6);
  background-color: var(--color-primary-light);
  border-radius: var(--radius-lg);
  color: white;
  text-align: center;
}

.cta h2 {
  margin-bottom: var(--space-3);
}

.cta p {
  margin-bottom: var(--space-4);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.dark-mode .feature-card {
  background-color: var(--color-neutral-100);
}

.dark-mode .cta {
  background-color: var(--color-primary-dark);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: var(--text-3xl);
  }

  .hero-subtitle {
    font-size: var(--text-lg);
  }
}
</style>
