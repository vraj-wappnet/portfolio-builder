<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { usePortfolioStore } from "../../stores/portfolio";

const portfolioStore = usePortfolioStore();
const router = useRouter();

// State for currently editing section

// Get data from store
const profile = computed(() => portfolioStore.profile);
const services = computed(() => portfolioStore.services);
const projects = computed(() => portfolioStore.projects);
const testimonials = computed(() => portfolioStore.testimonials);
const availability = computed(() => portfolioStore.availability);
const stats = computed(() => portfolioStore.portfolioStats);

// Format time for display
const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minutes} ${period}`;
};

// Compute availability summary
const availabilitySummary = computed(() => {
  if (availability.value.slots.length === 0) return "Not specified";

  // Group slots by day
  const dayMap = new Map<string, string[]>();

  availability.value.slots.forEach((slot) => {
    if (!dayMap.has(slot.day)) {
      dayMap.set(slot.day, []);
    }
    dayMap
      .get(slot.day)
      ?.push(`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`);
  });

  // Convert to readable format
  const parts = [];
  for (const [day, times] of dayMap.entries()) {
    parts.push(`${day}: ${times.join(", ")}`);
  }

  return parts.join(" • ");
});

// Edit section
const editSection = (section: string) => {
  router.push(`/portfolio-builder/${section}`);
};

// Format communication preference
const communicationPreference = computed(() => {
  switch (availability.value.preferredCommunication) {
    case "email":
      return "Email";
    case "call":
      return "Phone Call";
    case "zoom":
      return "Video Call (Zoom)";
    default:
      return "Not specified";
  }
});

// Statistics
const portfolioStatsSummary = computed(() => {
  const parts = [];

  if (services.value.length) {
    parts.push(
      `${services.value.length} Service${services.value.length > 1 ? "s" : ""}`
    );
  }

  if (projects.value.length) {
    parts.push(
      `${projects.value.length} Project${projects.value.length > 1 ? "s" : ""}`
    );
  }

  if (testimonials.value.length) {
    parts.push(
      `${testimonials.value.length} Testimonial${
        testimonials.value.length > 1 ? "s" : ""
      }`
    );
  }

  if (testimonials.value.length) {
    parts.push(`${stats.value.avgRating}★ Avg Rating`);
  }

  return parts.join(" • ");
});
</script>

<template>
  <div class="portfolio-preview">
    <h2>Portfolio Preview</h2>
    <p class="subtitle">Review your portfolio and make any final edits.</p>

    <div class="stats-summary">
      <h3>Portfolio Summary</h3>
      <p v-if="portfolioStatsSummary">{{ portfolioStatsSummary }}</p>
      <p v-else>No content added yet</p>
    </div>

    <div class="preview-content">
      <!-- Profile Section -->
      <section class="preview-section">
        <div class="section-header">
          <h3>Profile</h3>
          <button @click="editSection('profile-setup')" class="btn-edit">
            Edit
          </button>
        </div>

        <div class="profile-preview">
          <div class="profile-avatar">
            <img
              v-if="profile.avatar"
              :src="profile.avatar"
              alt="Profile avatar"
            />
            <div v-else class="avatar-placeholder">👤</div>
          </div>

          <div class="profile-details">
            <h2 class="profile-name">{{ profile.fullName || "Your Name" }}</h2>
            <p class="profile-tagline">
              {{ profile.tagline || "Your professional tagline" }}
            </p>

            <div v-if="profile.location" class="profile-location">
              📍 {{ profile.location }}
            </div>

            <div
              v-if="Object.values(profile.socialLinks).some(Boolean)"
              class="profile-social"
            >
              <a
                v-if="profile.socialLinks.linkedin"
                :href="profile.socialLinks.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link"
              >
                LinkedIn
              </a>
              <a
                v-if="profile.socialLinks.github"
                :href="profile.socialLinks.github"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link"
              >
                GitHub
              </a>
              <a
                v-if="profile.socialLinks.website"
                :href="profile.socialLinks.website"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link"
              >
                Website
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Services Section -->
      <section class="preview-section">
        <div class="section-header">
          <h3>Services</h3>
          <button @click="editSection('services')" class="btn-edit">
            Edit
          </button>
        </div>

        <div v-if="services.length > 0" class="services-preview">
          <div
            v-for="service in services"
            :key="service.id"
            class="service-preview-card"
          >
            <h4>{{ service.title }}</h4>
            <p>{{ service.description }}</p>
            <div class="service-meta">
              <span class="service-price">
                {{ service.pricing.amount }} USD /
                {{ service.pricing.type === "hourly" ? "hour" : "project" }}
              </span>
              <span class="service-delivery">
                Delivery: {{ service.deliveryTime }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="empty-preview">
          <p>No services added yet</p>
        </div>
      </section>

      <!-- Projects Section -->
      <section class="preview-section">
        <div class="section-header">
          <h3>Projects</h3>
          <button @click="editSection('projects')" class="btn-edit">
            Edit
          </button>
        </div>

        <div v-if="projects.length > 0" class="projects-preview">
          <div
            v-for="project in projects"
            :key="project.id"
            class="project-preview-card"
          >
            <div v-if="project.images.length > 0" class="project-images">
              <img :src="project.images[0]" alt="Project thumbnail" />
            </div>
            <div class="project-preview-content">
              <h4>{{ project.name }}</h4>
              <p>{{ project.description }}</p>
              <div class="tech-stack">
                <span
                  v-for="tech in project.techStack"
                  :key="tech"
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-preview">
          <p>No projects added yet</p>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="preview-section">
        <div class="section-header">
          <h3>Testimonials</h3>
          <button @click="editSection('testimonials')" class="btn-edit">
            Edit
          </button>
        </div>

        <div v-if="testimonials.length > 0" class="testimonials-preview">
          <div
            v-for="testimonial in testimonials"
            :key="testimonial.id"
            class="testimonial-preview-card"
          >
            <blockquote>
              <p>"{{ testimonial.feedback }}"</p>
              <footer>
                <div class="testimonial-author">
                  <strong>{{ testimonial.clientName }}</strong>
                  <span v-if="testimonial.company"
                    >, {{ testimonial.company }}</span
                  >
                </div>
                <div class="testimonial-rating">
                  {{ "★".repeat(testimonial.rating)
                  }}{{ "☆".repeat(5 - testimonial.rating) }}
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
        <div v-else class="empty-preview">
          <p>No testimonials added yet</p>
        </div>
      </section>

      <!-- Availability Section -->
      <section class="preview-section">
        <div class="section-header">
          <h3>Availability</h3>
          <button @click="editSection('availability')" class="btn-edit">
            Edit
          </button>
        </div>

        <div class="availability-preview">
          <div class="availability-item">
            <strong>Timezone:</strong>
            {{ availability.timezone || "Not specified" }}
          </div>
          <div class="availability-item">
            <strong>Schedule:</strong> {{ availabilitySummary }}
          </div>
          <div class="availability-item">
            <strong>Preferred Communication:</strong>
            {{ communicationPreference }}
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Enhanced UI styles */
.portfolio-preview {
  max-width: 900px; /* Increased width for better layout */
  margin: 0 auto;
  padding: var(--space-4);
  background-color: var(--color-neutral-50);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}
.subtitle {
  color: var(--color-neutral-700);
  font-size: var(--text-lg);
  margin-bottom: var(--space-5);
}

.stats-summary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: white;
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-5);
  box-shadow: var(--shadow-md);
}

.stats-summary h3 {
  margin-bottom: var(--space-3);
  font-size: var(--text-xl);
}

.preview-section {
  background-color: var(--color-neutral-50);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-5);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.preview-section:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  background-color: var(--color-neutral-100);
  border-bottom: 1px solid var(--color-neutral-200);
}

.section-header h3 {
  margin: 0;
  color: var(--color-primary-dark);
  font-size: var(--text-lg);
}

.btn-edit {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--text-sm);
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.btn-edit:hover {
  background-color: var(--color-primary-dark);
  transform: scale(1.05);
}

.profile-preview {
  padding: var(--space-5);
  display: flex;
  gap: var(--space-5);
  align-items: center;
}

.profile-avatar {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-neutral-200);
  font-size: 3.5rem;
  color: var(--color-neutral-600);
}

.profile-details {
  flex: 1;
}

.profile-name {
  margin: 0 0 var(--space-2) 0;
  color: var(--color-primary);
  font-size: var(--text-xl);
}

.profile-tagline {
  margin: 0 0 var(--space-3) 0;
  color: var(--color-neutral-700);
  font-size: var(--text-md);
}

.profile-location {
  margin-bottom: var(--space-2);
  color: var(--color-neutral-600);
  font-size: var(--text-sm);
}

.profile-social {
  display: flex;
  gap: var(--space-4);
}

.social-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 500;
}

.social-link:hover {
  text-decoration: underline;
}

.services-preview,
.projects-preview,
.testimonials-preview,
.availability-preview {
  padding: var(--space-5);
}

.service-preview-card,
.project-preview-card,
.testimonial-preview-card {
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-md);
  background-color: var(--color-neutral-50);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.service-preview-card:hover,
.project-preview-card:hover,
.testimonial-preview-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.service-meta {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
}

.service-price {
  color: var(--color-primary);
  font-weight: 600;
}

.project-preview-card {
  display: flex;
  gap: var(--space-4);
}

.project-images {
  width: 140px;
  height: 100px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.project-images img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-preview-content {
  flex: 1;
}

.project-preview-content h4 {
  margin: 0 0 var(--space-2) 0;
  font-size: var(--text-md);
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.tech-tag {
  background-color: var(--color-neutral-200);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  color: var(--color-neutral-700);
}

.testimonial-preview-card blockquote {
  margin: 0;
  font-style: italic;
  font-size: var(--text-md);
}

.testimonial-preview-card footer {
  margin-top: var(--space-3);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.testimonial-rating {
  color: var(--color-warning);
  letter-spacing: 2px;
  font-size: var(--text-sm);
}

.availability-item {
  margin-bottom: var(--space-4);
  font-size: var(--text-sm);
}

.availability-item:last-child {
  margin-bottom: 0;
}

.empty-preview {
  padding: var(--space-5);
  text-align: center;
  color: var(--color-neutral-600);
  background-color: var(--color-neutral-100);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 768px) {
  .profile-preview {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .profile-social {
    justify-content: center;
  }

  .project-preview-card {
    flex-direction: column;
  }

  .project-images {
    width: 100%;
    height: 180px;
  }
}

.dark-mode .preview-section {
  background-color: var(--color-neutral-100);
}

.dark-mode .section-header {
  background-color: var(--color-neutral-200);
  border-color: var(--color-neutral-300);
}

.dark-mode .empty-preview {
  background-color: var(--color-neutral-200);
}

.dark-mode .stats-summary {
  background-color: var(--color-primary-dark);
}

.dark-mode .service-preview-card,
.dark-mode .project-preview-card,
.dark-mode .testimonial-preview-card {
  border-color: var(--color-neutral-300);
}

.dark-mode .btn-edit {
  color: white;
}
</style>
