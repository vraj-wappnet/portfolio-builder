<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import {
  usePortfolioStore,
  type Availability,
  type AvailabilitySlot,
} from "../../stores/portfolio";

const portfolioStore = usePortfolioStore();

// Form data
const availabilityData = reactive<Availability>({
  timezone: portfolioStore.availability.timezone || "",
  slots: [...(portfolioStore.availability.slots || [])],
  preferredCommunication:
    portfolioStore.availability.preferredCommunication || "email",
});

// New time slot
const newSlot = reactive<AvailabilitySlot>({
  day: "Monday",
  startTime: "09:00",
  endTime: "17:00",
});

// Error state
const errors = reactive({
  timezone: "",
  slots: "",
  timeRange: "",
});

// Day options
const dayOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Communication options
const communicationOptions = [
  { value: "email", label: "Email" },
  { value: "call", label: "Phone Call" },
  { value: "zoom", label: "Video Call (Zoom)" },
];

// Timezone options (simplified list)
const timezoneOptions = [
  "UTC-06:00",
  "UTC-05:00",
  "UTC-04:00",
  "UTC-03:00",
  "UTC-02:00",
  "UTC-01:00",
  "UTC+00:00",
  "UTC+01:00",
  "UTC+02:00",
  "UTC+03:00",
  "UTC+04:00",
  "UTC+05:00",
  "UTC+05:30",
  "UTC+06:00",
  "UTC+07:00",
  "UTC+08:00",
  "UTC+09:00",
];

// Add a new time slot
const addTimeSlot = () => {
  // Validate time range
  if (newSlot.startTime >= newSlot.endTime) {
    errors.timeRange = "End time must be after start time";
    return;
  }

  // Check for overlapping slots on the same day
  const hasOverlap = availabilityData.slots.some((slot) => {
    if (slot.day !== newSlot.day) return false;

    return (
      (newSlot.startTime >= slot.startTime &&
        newSlot.startTime < slot.endTime) ||
      (newSlot.endTime > slot.startTime && newSlot.endTime <= slot.endTime) ||
      (newSlot.startTime <= slot.startTime && newSlot.endTime >= slot.endTime)
    );
  });

  if (hasOverlap) {
    errors.timeRange = "This time slot overlaps with an existing slot";
    return;
  }

  errors.timeRange = "";
  availabilityData.slots.push({ ...newSlot });

  // Reset for next input
  newSlot.startTime = "09:00";
  newSlot.endTime = "17:00";
};

// Remove a time slot
const removeTimeSlot = (index: number) => {
  availabilityData.slots.splice(index, 1);
};

// Format time for display
const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minutes} ${period}`;
};

// Save availability data
const saveAvailability = () => {
  if (!availabilityData.timezone) {
    errors.timezone = "Please select a timezone";
    return;
  }

  if (availabilityData.slots.length === 0) {
    errors.slots = "Please add at least one availability slot";
    return;
  }

  errors.timezone = "";
  errors.slots = "";

  portfolioStore.updateAvailability({ ...availabilityData });
};

// Compute availability summary
const availabilitySummary = computed(() => {
  if (availabilityData.slots.length === 0) return "No availability set";

  // Group slots by day
  const dayMap = new Map<string, string[]>();

  availabilityData.slots.forEach((slot) => {
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

// Auto-save when data changes significantly
const autoSave = () => {
  if (availabilityData.timezone && availabilityData.slots.length > 0) {
    saveAvailability();
  }
};
</script>

<template>
  <div class="availability">
    <h2>Set Your Availability</h2>
    <p class="subtitle">Let clients know when you're available for work.</p>

    <div class="form-container">
      <div class="form-group">
        <label for="timezone" class="form-label">Your Timezone*</label>
        <select
          id="timezone"
          v-model="availabilityData.timezone"
          class="form-select"
          :class="{ error: errors.timezone }"
          @change="autoSave"
        >
          <option value="" disabled>Select your timezone</option>
          <option v-for="tz in timezoneOptions" :key="tz" :value="tz">
            {{ tz }}
          </option>
        </select>
        <div v-if="errors.timezone" class="form-error">
          {{ errors.timezone }}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Preferred Communication</label>
        <div class="radio-group">
          <div
            v-for="option in communicationOptions"
            :key="option.value"
            class="radio-option"
          >
            <input
              type="radio"
              :id="option.value"
              :value="option.value"
              v-model="availabilityData.preferredCommunication"
              @change="autoSave"
            />
            <label :for="option.value">{{ option.label }}</label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Weekly Schedule*</label>
        <p class="form-help">Add your available time slots</p>

        <div class="add-slot">
          <div class="slot-form">
            <div class="slot-day">
              <select v-model="newSlot.day" class="form-select">
                <option v-for="day in dayOptions" :key="day" :value="day">
                  {{ day }}
                </option>
              </select>
            </div>
            <div class="slot-time">
              <input
                type="time"
                v-model="newSlot.startTime"
                class="form-input"
              />
              <span class="to">to</span>
              <input type="time" v-model="newSlot.endTime" class="form-input" />
            </div>
            <button type="button" @click="addTimeSlot" class="btn btn-primary">
              Add
            </button>
          </div>
          <div v-if="errors.timeRange" class="form-error">
            {{ errors.timeRange }}
          </div>
        </div>

        <div v-if="errors.slots" class="form-error">{{ errors.slots }}</div>

        <div
          v-if="availabilityData.slots.length > 0"
          class="availability-slots"
        >
          <div
            v-for="(slot, index) in availabilityData.slots"
            :key="index"
            class="slot-item"
          >
            <div class="slot-details">
              <span class="slot-day">{{ slot.day }}</span>
              <span class="slot-time"
                >{{ formatTime(slot.startTime) }} -
                {{ formatTime(slot.endTime) }}</span
              >
            </div>
            <button
              @click="removeTimeSlot(index)"
              class="btn-remove"
              aria-label="Remove time slot"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="availabilityData.slots.length > 0"
        class="availability-summary"
      >
        <h4>Availability Summary</h4>
        <p>{{ availabilitySummary }}</p>
      </div>

      <div class="form-actions">
        <button @click="saveAvailability" class="btn btn-primary">
          Save Availability
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.availability {
  max-width: 800px;
  margin: 0 auto;
}

.subtitle {
  color: var(--color-neutral-600);
  margin-bottom: var(--space-4);
}

.form-container {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.form-help {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
  margin-bottom: var(--space-2);
}

.radio-group {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-3);
}

.radio-option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.add-slot {
  margin-bottom: var(--space-4);
}

.slot-form {
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: var(--space-3);
  align-items: center;
}

.slot-time {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.to {
  color: var(--color-neutral-600);
}

.availability-slots {
  margin-top: var(--space-3);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.slot-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--color-neutral-200);
}

.slot-item:last-child {
  border-bottom: none;
}

.slot-details {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.slot-day {
  font-weight: 500;
  min-width: 100px;
}

.btn-remove {
  background: none;
  border: none;
  color: var(--color-error);
  cursor: pointer;
  font-size: 1rem;
  padding: var(--space-1);
  border-radius: 50%;
  transition: background-color 0.2s;
}

.btn-remove:hover {
  background-color: var(--color-neutral-200);
}

.availability-summary {
  margin-top: var(--space-4);
  padding: var(--space-3);
  background-color: var(--color-neutral-100);
  border-radius: var(--radius-md);
}

.availability-summary h4 {
  color: var(--color-primary);
  margin-bottom: var(--space-2);
}

.form-actions {
  margin-top: var(--space-4);
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .slot-form {
    grid-template-columns: 1fr;
  }

  .radio-group {
    flex-direction: column;
    gap: var(--space-2);
  }

  .slot-details {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-1);
  }
}

.dark-mode .form-container {
  background-color: var(--color-neutral-100);
}

.dark-mode .form-input,
.dark-mode .form-textarea,
.dark-mode .form-select {
  color: white;
}
</style>
