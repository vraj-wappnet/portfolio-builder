<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { usePortfolioStore, type Service } from "../../stores/portfolio";
import { PencilSquareIcon, TrashIcon, WrenchScrewdriverIcon, ClockIcon, CurrencyDollarIcon, DocumentTextIcon } from "@heroicons/vue/24/outline";

const portfolioStore = usePortfolioStore();

// State for adding/editing a service
const isEditing = ref(false);
const editingServiceId = ref("");
const showForm = ref(false);

// New service form
const newService = reactive<Service>({
  id: "",
  title: "",
  description: "",
  pricing: {
    type: "hourly",
    amount: 0,
  },
  deliveryTime: "",
});

const errors = reactive({
  title: "",
  description: "",
  pricing: "",
  deliveryTime: "",
});

const resetForm = () => {
  newService.id = "";
  newService.title = "";
  newService.description = "";
  newService.pricing.type = "hourly";
  newService.pricing.amount = 0;
  newService.deliveryTime = "";
  isEditing.value = false;
  editingServiceId.value = "";
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });
};

const validateForm = () => {
  let isValid = true;

  if (!newService.title.trim()) {
    errors.title = "Title is required";
    isValid = false;
  }

  if (!newService.description.trim()) {
    errors.description = "Description is required";
    isValid = false;
  } else if (newService.description.length < 10) {
    errors.description = "Description must be at least 10 characters";
    isValid = false;
  } else if (newService.description.length > 300) {
    errors.description = "Description cannot exceed 300 characters";
    isValid = false;
  }

  if (newService.pricing.amount <= 0) {
    errors.pricing = "Please enter a valid amount";
    isValid = false;
  }

  if (!newService.deliveryTime.trim()) {
    errors.deliveryTime = "Delivery time is required";
    isValid = false;
  }

  return isValid;
};

const addService = () => {
  if (!validateForm()) return;

  if (isEditing.value) {
    portfolioStore.updateService(editingServiceId.value, {
      ...JSON.parse(JSON.stringify(newService)),
    });
  } else {
    portfolioStore.addService({
      ...JSON.parse(JSON.stringify(newService)),
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

const editService = (service: Service) => {
  newService.id = service.id;
  newService.title = service.title;
  newService.description = service.description;
  newService.pricing.type = service.pricing.type;
  newService.pricing.amount = service.pricing.amount;
  newService.deliveryTime = service.deliveryTime;

  isEditing.value = true;
  editingServiceId.value = service.id;
  showForm.value = true;
};

const deleteService = (serviceId: string) => {
  if (confirm("Are you sure you want to delete this service?")) {
    portfolioStore.removeService(serviceId);
  }
};

const services = computed(() => portfolioStore.services);

const startAddingService = () => {
  showForm.value = true;
  resetForm();
};
</script>

<template>
  <div class="services-offered">
    <h2>Services Offered</h2>
    <p class="subtitle">Add the services you provide to potential clients.</p>

    <div v-if="services.length > 0" class="services-list">
      <div v-for="service in services" :key="service.id" class="service-card">
        <div class="service-header">
          <h3><WrenchScrewdriverIcon class="icon section-icon" /> {{ service.title }}</h3>
          <div class="service-actions">
            <button
              @click="editService(service)"
              class="btn-icon"
              aria-label="Edit service"
            >
              <PencilSquareIcon class="icon edit-icon" />
            </button>
            <button
              @click="deleteService(service.id)"
              class="btn-icon"
              aria-label="Delete service"
            >
              <TrashIcon class="icon delete-icon" />
            </button>
          </div>
        </div>
        <p class="service-description">{{ service.description }}</p>
        <div class="service-meta">
          <div class="service-price">
            <CurrencyDollarIcon class="icon-sm meta-icon" />
            <strong>{{ service.pricing.amount }} USD</strong>
            / {{ service.pricing.type === "hourly" ? "hour" : "project" }}
          </div>
          <div class="service-delivery">
            <ClockIcon class="icon-sm meta-icon" />
            <span>Delivery: {{ service.deliveryTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <WrenchScrewdriverIcon class="empty-state-icon" />
      </div>
      <h3>No Services Added Yet</h3>
      <p>Add your first service to showcase what you offer to clients.</p>
    </div>

    <div v-if="!showForm" class="add-service">
      <button @click="startAddingService" class="btn btn-primary">
      Add Service
      </button>
    </div>

    <div v-if="showForm" class="service-form-container">
      <h3>{{ isEditing ? "Edit" : "Add" }} Service</h3>
      <form @submit.prevent="addService" class="service-form">
        <div class="form-group">
          <label for="service-title" class="form-label">
            <WrenchScrewdriverIcon class="label-icon" /> Service Title*
          </label>
          <input
            id="service-title"
            v-model="newService.title"
            type="text"
            class="form-input"
            :class="{ error: errors.title }"
            placeholder="UI/UX Design"
          />
          <div v-if="errors.title" class="form-error">{{ errors.title }}</div>
        </div>

        <div class="form-group">
          <label for="service-description" class="form-label">
            <DocumentTextIcon class="label-icon" /> Description*
          </label>
          <textarea
            id="service-description"
            v-model="newService.description"
            class="form-textarea"
            :class="{ error: errors.description }"
            placeholder="Describe your service in detail..."
            rows="4"
          ></textarea>
          <div class="character-count">
            {{ newService.description.length }}/500 (min: 10)
          </div>
          <div v-if="errors.description" class="form-error">
            {{ errors.description }}
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              <CurrencyDollarIcon class="label-icon" /> Pricing*
            </label>
            <div class="pricing-input">
              <div class="pricing-type">
                <select v-model="newService.pricing.type" class="form-select">
                  <option value="hourly">Per Hour</option>
                  <option value="project">Per Project</option>
                </select>
              </div>
              <div class="pricing-amount">
                <input
                  v-model.number="newService.pricing.amount"
                  type="number"
                  class="form-input"
                  :class="{ error: errors.pricing }"
                  placeholder="10"
                  min="1"
                />
                <span class="currency">USD</span>
              </div>
            </div>
            <div v-if="errors.pricing" class="form-error">
              {{ errors.pricing }}
            </div>
          </div>

          <div class="form-group">
            <label for="service-delivery" class="form-label">
              <ClockIcon class="label-icon" /> Delivery Time*
            </label>
            <input
              id="service-delivery"
              v-model="newService.deliveryTime"
              type="text"
              class="form-input"
              :class="{ error: errors.deliveryTime }"
              placeholder="3-5 business days"
            />
            <div v-if="errors.deliveryTime" class="form-error">
              {{ errors.deliveryTime }}
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="cancelForm" class="btn btn-outline">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            {{ isEditing ? "Update" : "Add" }} Service
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.services-offered {
  max-width: 800px;
  margin: 0 auto;
}

.subtitle {
  color: var(--color-neutral-600);
  margin-bottom: var(--space-4);
}

.services-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.service-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  border: 1px solid var(--color-neutral-200);
  transition: transform 0.2s, box-shadow 0.2s;
}

.service-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-3);
}

.service-header h3 {
  display: flex;
  align-items: center;
  margin: 0;
  color: var(--color-primary);
}

.service-actions {
  display: flex;
  gap: var(--space-2);
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--radius-md);
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background-color: var(--color-neutral-200);
}

.icon {
  width: 1.2rem;
  height: 1.2rem;
}

.edit-icon {
  color: var(--color-blue-600);
  transition: color 0.2s;
}

.btn-icon:hover .edit-icon {
  color: var(--color-blue-800);
}

.delete-icon {
  color: var(--color-red-600);
  transition: color 0.2s;
}

.btn-icon:hover .delete-icon {
  color: var(--color-red-800);
}

.service-description {
  color: var(--color-neutral-700);
  margin-bottom: var(--space-3);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.service-meta {
  display: flex;
  justify-content: space-between;
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-neutral-200);
  font-size: var(--text-sm);
}

.service-price {
  color: var(--color-primary);
}

.service-delivery {
  color: var(--color-neutral-600);
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

.add-service {
  margin-top: var(--space-4);
  text-align: center;
}

.service-form-container {
  background-color: var(--color-neutral-100);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-top: var(--space-4);
}

.service-form {
  margin-top: var(--space-3);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.pricing-input {
  display: flex;
  gap: var(--space-2);
}

.pricing-type {
  flex: 1;
}

.pricing-amount {
  flex: 1;
  position: relative;
}

.currency {
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-neutral-600);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.character-count {
  text-align: right;
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.dark-mode .service-card {
  background-color: var(--color-neutral-100);
  border-color: var(--color-neutral-300);
}

.dark-mode .empty-state,
.dark-mode .service-form-container {
  background-color: var(--color-neutral-200);
}

.dark-mode .edit-icon {
  color: var(--color-blue-400);
}

.dark-mode .btn-icon:hover .edit-icon {
  color: var(--color-blue-300);
}

.dark-mode .delete-icon {
  color: var(--color-red-400);
}

.dark-mode .btn-icon:hover .delete-icon {
  color: var(--color-red-300);
}

.dark-mode .form-input,
.dark-mode .form-textarea,
.dark-mode .form-select {
  color: white;
}

.icon-sm {
  width: 1rem;
  height: 1rem;
}

.meta-icon {
  margin-right: 0.25rem;
  vertical-align: middle;
  color: currentColor;
}

.section-icon {
  width: 1.2rem;
  height: 1.2rem;
  margin-right: 0.5rem;
  vertical-align: middle;
  color: var(--color-primary);
}

.empty-state-icon {
  width: 4rem;
  height: 4rem;
  color: var(--color-primary);
}

.label-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  vertical-align: middle;
  color: var(--color-primary);
}

.dark-mode .section-icon,
.dark-mode .label-icon {
  color: var(--color-primary-light);
}
</style>
