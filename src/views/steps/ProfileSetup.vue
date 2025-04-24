<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { usePortfolioStore, type Profile } from "../../stores/portfolio";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

const portfolioStore = usePortfolioStore();

// Form state
const form = reactive<Profile>({
  fullName: portfolioStore.profile.fullName || "",
  tagline: portfolioStore.profile.tagline || "",
  location: portfolioStore.profile.location || "",
  socialLinks: {
    linkedin: portfolioStore.profile.socialLinks.linkedin || "",
    github: portfolioStore.profile.socialLinks.github || "",
    website: portfolioStore.profile.socialLinks.website || "",
  },
});

// Avatar handling
const showCropper = ref(false);
const imageSource = ref("");
const previewImage = ref(portfolioStore.profile.avatar || "");
const cropResult = ref(null); // Store cropper result

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        imageSource.value = e.target.result as string;
        showCropper.value = true;
      }
    };
    reader.readAsDataURL(file);
  }
};

// Handle cropper changes
const handleCropChange = (result: any) => {
  cropResult.value = result; // Store the cropper result without closing modal
};

// Apply crop and save to store
const applyCrop = () => {
  if (!cropResult.value) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const image = new Image();

  canvas.width = 300;
  canvas.height = 300;

  image.onload = () => {
    if (!ctx) return;

    ctx.drawImage(
      image,
      cropResult.value.coordinates.left,
      cropResult.value.coordinates.top,
      cropResult.value.coordinates.width,
      cropResult.value.coordinates.height,
      0,
      0,
      300,
      300
    );

    previewImage.value = canvas.toDataURL("image/jpeg");
    showCropper.value = false; // Close modal after applying crop

    // Save the cropped image to the store
    portfolioStore.updateProfile({
      ...form,
      avatar: previewImage.value,
    });
  };

  image.src = imageSource.value;
};

// Form validation
const errors = ref({
  fullName: "",
  tagline: "",
  linkedin: "",
  github: "",
  website: "",
});

const validateForm = () => {
  let isValid = true;
  errors.value = {
    fullName: "",
    tagline: "",
    linkedin: "",
    github: "",
    website: "",
  };

  if (!form.fullName.trim()) {
    errors.value.fullName = "Full name is required";
    isValid = false;
  }

  if (!form.tagline.trim()) {
    errors.value.tagline = "Tagline is required";
    isValid = false;
  } else if (form.tagline.length > 150) {
    errors.value.tagline = "Tagline must be 150 characters or less";
    isValid = false;
  }

  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  if (form.socialLinks.linkedin && !urlRegex.test(form.socialLinks.linkedin)) {
    errors.value.linkedin = "Please enter a valid URL";
    isValid = false;
  }

  if (form.socialLinks.github && !urlRegex.test(form.socialLinks.github)) {
    errors.value.github = "Please enter a valid URL";
    isValid = false;
  }

  if (form.socialLinks.website && !urlRegex.test(form.socialLinks.website)) {
    errors.value.website = "Please enter a valid URL";
    isValid = false;
  }

  return isValid;
};

const saveProfile = () => {
  if (validateForm()) {
    portfolioStore.updateProfile({
      ...form,
      avatar: previewImage.value,
    });
  }
};

const autoSave = () => {
  if (form.fullName && form.tagline) {
    saveProfile();
  }
};

onMounted(() => {
  const formElements = document.querySelectorAll(
    ".profile-form input, .profile-form textarea"
  );
  formElements.forEach((el) => {
    el.addEventListener("blur", autoSave);
  });
});
</script>

<template>
  <div class="profile-setup">
    <h2>Profile Setup</h2>
    <p class="subtitle">
      Create your professional profile to showcase who you are.
    </p>

    <div class="form-container">
      <div class="avatar-section">
        <div class="avatar-preview" :class="{ 'has-image': previewImage }">
          <img v-if="previewImage" :src="previewImage" alt="Avatar Preview" />
          <div v-else class="avatar-placeholder">
            <span class="avatar-icon">🧑🏽‍🦳</span>
          </div>
        </div>
        <div class="avatar-controls">
          <label for="avatar-upload" class="btn btn-outline"
            >Upload Photo</label
          >
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            class="visually-hidden"
            @change="handleFileUpload"
          />
        </div>
      </div>

      <form class="profile-form" @submit.prevent="saveProfile">
        <!-- Form fields remain unchanged -->
        <div class="form-group">
          <label for="fullName" class="form-label">Full Name*</label>
          <input
            id="fullName"
            v-model="form.fullName"
            type="text"
            class="form-input"
            :class="{ error: errors.fullName }"
            placeholder="John Doe"
          />
          <div v-if="errors.fullName" class="form-error">
            {{ errors.fullName }}
          </div>
        </div>

        <div class="form-group">
          <label for="tagline" class="form-label">Tagline / Short Bio*</label>
          <textarea
            id="tagline"
            v-model="form.tagline"
            class="form-textarea"
            :class="{ error: errors.tagline }"
            placeholder="Senior UX Designer specializing in mobile applications"
            rows="3"
            maxlength="150"
          ></textarea>
          <div
            class="character-count"
            :class="{ error: form.tagline.length > 150 }"
          >
            {{ form.tagline.length }}/150
          </div>
          <div v-if="errors.tagline" class="form-error">
            {{ errors.tagline }}
          </div>
        </div>

        <div class="form-group">
          <label for="location" class="form-label">Location</label>
          <input
            id="location"
            v-model="form.location"
            type="text"
            class="form-input"
            placeholder="India"
          />
        </div>

        <h3 class="social-heading">Social Links</h3>
        <div class="form-group">
          <label for="linkedin" class="form-label">LinkedIn</label>
          <input
            id="linkedin"
            v-model="form.socialLinks.linkedin"
            type="url"
            class="form-input"
            :class="{ error: errors.linkedin }"
            placeholder="https://linkedin.com/in/username"
          />
          <div v-if="errors.linkedin" class="form-error">
            {{ errors.linkedin }}
          </div>
        </div>

        <div class="form-group">
          <label for="github" class="form-label">GitHub</label>
          <input
            id="github"
            v-model="form.socialLinks.github"
            type="url"
            class="form-input"
            :class="{ error: errors.github }"
            placeholder="https://github.com/username"
          />
          <div v-if="errors.github" class="form-error">{{ errors.github }}</div>
        </div>

        <div class="form-group">
          <label for="website" class="form-label">Personal Website</label>
          <input
            id="website"
            v-model="form.socialLinks.website"
            type="url"
            class="form-input"
            :class="{ error: errors.website }"
            placeholder="https://yourwebsite.com"
          />
          <div v-if="errors.website" class="form-error">
            {{ errors.website }}
          </div>
        </div>
      </form>
    </div>

    <!-- Image Cropper Modal -->
    <div v-if="showCropper" class="modal-overlay">
      <div class="modal-content">
        <h3>Crop Image</h3>
        <div class="cropper-container">
          <Cropper
            :src="imageSource"
            :stencil-props="{
              aspectRatio: 1,
            }"
            @change="handleCropChange"
          />
        </div>
        <div class="modal-actions">
          <button @click="showCropper = false" class="btn btn-outline">
            Cancel
          </button>
          <button @click="applyCrop" class="btn btn-primary">Apply Crop</button>
          <!-- Updated to use applyCrop -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-setup {
  max-width: 800px;
  margin: 0 auto;
}

.subtitle {
  color: var(--color-neutral-600);
  margin-bottom: var(--space-4);
}

.form-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--space-5);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-preview {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: var(--space-3);
  background-color: var(--color-neutral-200);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.avatar-icon {
  font-size: 4rem;
  color: var(--color-neutral-400);
}

.character-count {
  text-align: right;
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
}

.character-count.error {
  color: var(--color-error);
}

.social-heading {
  margin-top: var(--space-4);
  margin-bottom: var(--space-3);
  font-size: var(--text-lg);
  color: var(--color-primary);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  width: 90%;
  max-width: 600px;
}

.cropper-container {
  height: 400px;
  margin: var(--space-4) 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@media (max-width: 768px) {
  .form-container {
    grid-template-columns: 1fr;
  }

  .avatar-section {
    margin-bottom: var(--space-4);
  }
}

.dark-mode .modal-content {
  background-color: var(--color-neutral-100);
}

.dark-mode .form-input,
.dark-mode .form-textarea {
  color: white;
}
</style>
