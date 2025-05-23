<script setup lang="ts">
import { ref, reactive } from "vue";
import { usePortfolioStore, type Testimonial } from "../../stores/portfolio";
import '@fortawesome/fontawesome-free/css/all.css';

const portfolioStore = usePortfolioStore();

// State for adding/editing a testimonial
const isEditing = ref(false);
const editingTestimonialId = ref("");
const showForm = ref(false);

// New testimonial form
const newTestimonial = reactive<Testimonial>({
  id: "",
  clientName: "",
  company: "",
  rating: 5,
  feedback: "",
});

const errors = reactive({
  clientName: "",
  company: "",
  rating: "",
  feedback: "",
});

const resetForm = () => {
  newTestimonial.id = "";
  newTestimonial.clientName = "";
  newTestimonial.company = "";
  newTestimonial.rating = 5;
  newTestimonial.feedback = "";
  isEditing.value = false;
  editingTestimonialId.value = "";
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });
};

const validateForm = () => {
  let isValid = true;

  if (!newTestimonial.clientName.trim()) {
    errors.clientName = "Client name is required";
    isValid = false;
  }

  if (!newTestimonial.feedback.trim()) {
    errors.feedback = "Feedback is required";
    isValid = false;
  }

  return isValid;
};

const addTestimonial = () => {
  if (!validateForm()) return;

  if (isEditing.value) {
    portfolioStore.updateTestimonial(editingTestimonialId.value, {
      ...newTestimonial,
    });
  } else {
    portfolioStore.addTestimonial({
      ...newTestimonial,
      id: Date.now().toString(),
    });
  }

  resetForm();
  showForm.value = false;
};

const cancelForm = () => {
  resetForm();
  showForm.value = false;
};

const editTestimonial = (testimonial: Testimonial) => {
  Object.assign(newTestimonial, { ...testimonial });
  isEditing.value = true;
  editingTestimonialId.value = testimonial.id;
  showForm.value = true;
};

const deleteTestimonial = (testimonialId: string) => {
  if (confirm("Are you sure you want to delete this testimonial?")) {
    portfolioStore.removeTestimonial(testimonialId);
  }
};

const startAddingTestimonial = () => {
  showForm.value = true;
  resetForm();
};

// Update rating
const updateRating = (value: number) => {
  newTestimonial.rating = value;
};
</script>

<template>
  <div class="testimonials">
    <h2>
      Client Testimonials
    </h2> 
    <p class="subtitle">Add testimonials from your satisfied clients.</p>

    <div
      v-if="portfolioStore.testimonials.length > 0"
      class="testimonials-list"
    >
      <div
        v-for="testimonial in portfolioStore.testimonials"
        :key="testimonial.id"
        class="testimonial-card"
      >
        <div class="testimonial-header">
          <div class="client-info">
            <h3><i class="fas fa-user me-2"></i>{{ testimonial.clientName }}</h3>
            <p v-if="testimonial.company" class="company">
              <i class="fas fa-building me-2"></i>{{ testimonial.company }}
            </p>
          </div>
          <div class="testimonial-actions">
            <button
              @click="editTestimonial(testimonial)"
              class="btn-icon"
              aria-label="Edit testimonial"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              @click="deleteTestimonial(testimonial.id)"
              class="btn-icon"
              aria-label="Delete testimonial"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>

        <div class="rating">
          <span class="stars" :title="`${testimonial.rating} out of 5 stars`">
            <i v-for="n in 5" :key="n" 
               :class="['fas', n <= testimonial.rating ? 'fa-star' : 'fa-star-o']"
            ></i>
          </span>
        </div>

        <blockquote class="feedback">
          <i class="fas fa-quote-left quote-icon"></i>
          {{ testimonial.feedback }}
        </blockquote>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-comment-dots"></i>
      </div>
      <h3>No Testimonials Added Yet</h3>
      <p>
        <i class="fas fa-info-circle me-2"></i>
        Add testimonials from your clients to build trust with potential new clients.
      </p>
    </div>

    <div v-if="!showForm" class="add-testimonial">
      <button @click="startAddingTestimonial" class="btn btn-primary">
        <i class="fas fa-plus me-2"></i> Add Testimonial
      </button>
    </div>

    <div v-if="showForm" class="testimonial-form-container">
      <h3>
        <i class="fas" :class="isEditing ? 'fa-edit' : 'fa-plus-circle'"></i>
        {{ isEditing ? "Edit" : "Add" }} Testimonial
      </h3>
      <form @submit.prevent="addTestimonial" class="testimonial-form">
        <div class="form-group">
          <label for="client-name" class="form-label">
            <i class="fas fa-user me-2"></i>Client Name*
          </label>
          <input
            id="client-name"
            v-model="newTestimonial.clientName"
            type="text"
            class="form-input"
            :class="{ error: errors.clientName }"
            placeholder="John Smith"
          />
          <div v-if="errors.clientName" class="form-error">
            <i class="fas fa-exclamation-circle me-1"></i>
            {{ errors.clientName }}
          </div>
        </div>

        <div class="form-group">
          <label for="company" class="form-label">
            <i class="fas fa-building me-2"></i>Company
          </label>
          <input
            id="company"
            v-model="newTestimonial.company"
            type="text"
            class="form-input"
            placeholder="Acme Inc."
          />
        </div>

        <div class="form-group">
          <label class="form-label">
            <i class="fas fa-star me-2"></i>Rating
          </label>
          <div class="rating-input">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="updateRating(star)"
              class="star-btn"
              :class="{ active: star <= newTestimonial.rating }"
            >
              <i class="fas" :class="star <= newTestimonial.rating ? 'fa-star' : 'fa-star-o'"></i>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="feedback" class="form-label">
            <i class="fas fa-comment me-2"></i>Client Feedback*
          </label>
          <textarea
            id="feedback"
            v-model="newTestimonial.feedback"
            class="form-textarea"
            :class="{ error: errors.feedback }"
            placeholder="What did your client say about your work?"
            rows="4"
          ></textarea>
          <div v-if="errors.feedback" class="form-error">
            <i class="fas fa-exclamation-circle me-1"></i>
            {{ errors.feedback }}
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="cancelForm" class="btn btn-outline">
            <i class="fas fa-times me-2"></i>Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            <i class="fas" :class="isEditing ? 'fa-save' : 'fa-plus'"></i>
            {{ isEditing ? "Update" : "Add" }} Testimonial
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Enhanced UI styles */
.testimonials {
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

.testimonials-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.testimonial-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  border: 1px solid var(--color-neutral-200);
  transition: transform 0.2s, box-shadow 0.2s;
}

.testimonial-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

.testimonial-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-2);
}

.client-info h3 {
  margin: 0;
  color: var(--color-primary);
}

.company {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
}

.testimonial-actions {
  display: flex;
  gap: var(--space-2);
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: var(--space-1);
  border-radius: var(--radius-md);
  transition: background-color 0.2s;
}

.btn-icon:hover {
  background-color: var(--color-neutral-200);
}

.rating {
  margin-bottom: var(--space-3);
}

.stars {
  color: var(--color-warning);
  letter-spacing: 2px;
}

.feedback {
  color: var(--color-neutral-700);
  font-style: italic;
  margin: 0;
  padding-left: var(--space-3);
  border-left: 3px solid var(--color-neutral-300);
}

.empty-state {
  background-color: var(--color-neutral-100);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-5);
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--space-3);
}

.add-testimonial {
  margin-top: var(--space-4);
  text-align: center;
}

.testimonial-form-container {
  background-color: var(--color-neutral-100);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-top: var(--space-4);
  box-shadow: var(--shadow-md);
}

.testimonial-form {
  margin-top: var(--space-3);
}

.rating-input {
  display: flex;
  gap: var(--space-1);
}

.star-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-neutral-300);
  cursor: pointer;
  transition: color 0.2s;
}

.star-btn.active {
  color: var(--color-warning);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.dark-mode .testimonial-card {
  background-color: var(--color-neutral-100);
  border-color: var(--color-neutral-300);
}

.dark-mode .empty-state,
.dark-mode .testimonial-form-container {
  background-color: var(--color-neutral-200);
}

.dark-mode .form-input,
.dark-mode .form-textarea {
  color: white;
}

.me-1 {
  margin-right: 0.25rem;
}

.me-2 {
  margin-right: 0.5rem;
}

.quote-icon {
  color: var(--color-neutral-400);
  font-size: 1.2rem;
  margin-right: 0.5rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--space-3);
  color: var(--color-primary);
}

.btn i {
  vertical-align: middle;
}

.form-label i {
  color: var(--color-primary);
}

.form-error i {
  color: var(--color-error);
}

.stars i {
  color: var(--color-warning);
}

.btn-icon i {
  font-size: 1rem;
}

.btn-icon:hover i {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style>
