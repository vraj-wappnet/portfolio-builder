<script setup lang="ts">
import { ref, reactive } from 'vue'
import { usePortfolioStore, type Project } from '../../stores/portfolio'

const portfolioStore = usePortfolioStore()

// State for adding/editing a project
const isEditing = ref(false)
const editingProjectId = ref('')
const showForm = ref(false)
const techInput = ref('')

// New project form
const newProject = reactive<Project>({
  id: '',
  name: '',
  images: [],
  techStack: [],
  description: ''
})

const errors = reactive({
  name: '',
  images: '',
  techStack: '',
  description: ''
})

// Handle image uploads
const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    for (let i = 0; i < input.files.length; i++) {
      if (newProject.images.length >= 5) {
        errors.images = 'Maximum 5 images allowed'
        break
      }
      
      const file = input.files[i]
      if (file.size > 5 * 1024 * 1024) {
        errors.images = 'Image size should be less than 5MB'
        continue
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          newProject.images.push(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }
}

// Add tech stack item
const addTechItem = () => {
  if (!techInput.value.trim()) return
  
  // Check for duplicates
  if (newProject.techStack.includes(techInput.value.trim())) {
    errors.techStack = 'This technology is already added'
    return
  }
  
  newProject.techStack.push(techInput.value.trim())
  techInput.value = ''
  errors.techStack = ''
}

// Remove tech stack item
const removeTechItem = (tech: string) => {
  newProject.techStack = newProject.techStack.filter(item => item !== tech)
}

// Remove image
const removeImage = (index: number) => {
  newProject.images.splice(index, 1)
  errors.images = ''
}

const resetForm = () => {
  newProject.id = ''
  newProject.name = ''
  newProject.images = []
  newProject.techStack = []
  newProject.description = ''
  techInput.value = ''
  isEditing.value = false
  editingProjectId.value = ''
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

const validateForm = () => {
  let isValid = true
  
  if (!newProject.name.trim()) {
    errors.name = 'Project name is required'
    isValid = false
  }
  
  if (newProject.images.length === 0) {
    errors.images = 'At least one image is required'
    isValid = false
  }
  
  if (newProject.techStack.length === 0) {
    errors.techStack = 'At least one technology is required'
    isValid = false
  }
  
  if (!newProject.description.trim()) {
    errors.description = 'Description is required'
    isValid = false
  } else if (newProject.description.length > 300) {
    errors.description = 'Description cannot exceed 300 characters'
    isValid = false
  }
  
  return isValid
}

const addProject = () => {
  if (!validateForm()) return
  
  if (isEditing.value) {
    portfolioStore.updateProject(editingProjectId.value, { ...newProject })
  } else {
    portfolioStore.addProject({
      ...newProject,
      id: Date.now().toString()
    })
  }
  
  resetForm()
  showForm.value = false
}

const cancelForm = () => {
  resetForm()
  showForm.value = false
}

const editProject = (project: Project) => {
  Object.assign(newProject, JSON.parse(JSON.stringify(project)))
  isEditing.value = true
  editingProjectId.value = project.id
  showForm.value = true
}

const deleteProject = (projectId: string) => {
  if (confirm('Are you sure you want to delete this project?')) {
    portfolioStore.removeProject(projectId)
  }
}

const startAddingProject = () => {
  showForm.value = true
  resetForm()
}
</script>

<template>
  <div class="project-gallery">
    <h2>Project Gallery</h2>
    <p class="subtitle">Showcase your best work to potential clients.</p>
    
    <div v-if="portfolioStore.projects.length > 0" class="projects-list">
      <div v-for="project in portfolioStore.projects" :key="project.id" class="project-card">
        <div class="project-images">
          <img v-if="project.images.length > 0" :src="project.images[0]" alt="Project thumbnail" />
          <div v-else class="image-placeholder">No image</div>
          <div class="image-count" v-if="project.images.length > 1">+{{ project.images.length - 1 }}</div>
        </div>
        <div class="project-content">
          <div class="project-header">
            <h3>{{ project.name }}</h3>
            <div class="project-actions">
              <button @click="editProject(project)" class="btn-icon" aria-label="Edit project">
                ✏️
              </button>
              <button @click="deleteProject(project.id)" class="btn-icon" aria-label="Delete project">
                🗑️
              </button>
            </div>
          </div>
          <p class="project-description">{{ project.description }}</p>
          <div class="tech-stack">
            <span v-for="tech in project.techStack" :key="tech" class="tech-tag">
              {{ tech }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-state">
      <div class="empty-icon">🖼️</div>
      <h3>No Projects Added Yet</h3>
      <p>Add your first project to showcase your portfolio.</p>
    </div>
    
    <div v-if="!showForm" class="add-project">
      <button @click="startAddingProject" class="btn btn-primary">
        Add Project
      </button>
    </div>
    
    <div v-if="showForm" class="project-form-container">
      <h3>{{ isEditing ? 'Edit' : 'Add' }} Project</h3>
      <form @submit.prevent="addProject" class="project-form">
        <div class="form-group">
          <label for="project-name" class="form-label">Project Name*</label>
          <input
            id="project-name"
            v-model="newProject.name"
            type="text"
            class="form-input"
            :class="{ 'error': errors.name }"
            placeholder="E-commerce Website"
          />
          <div v-if="errors.name" class="form-error">{{ errors.name }}</div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Project Images* (Max 5)</label>
          <div class="image-upload-container">
            <label for="image-upload" class="image-upload-btn">
              <span>Upload Images</span>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              class="visually-hidden"
              @change="handleImageUpload"
            />
          </div>
          <div v-if="errors.images" class="form-error">{{ errors.images }}</div>
          
          <div v-if="newProject.images.length > 0" class="image-previews">
            <div v-for="(image, index) in newProject.images" :key="index" class="image-preview">
              <img :src="image" alt="Project image preview" />
              <button 
                type="button" 
                @click="removeImage(index)" 
                class="remove-image" 
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Tech Stack*</label>
          <div class="tech-input">
            <input
              v-model="techInput"
              type="text"
              class="form-input"
              placeholder="React, Node.js, etc."
              @keydown.enter.prevent="addTechItem"
            />
            <button type="button" @click="addTechItem" class="btn btn-primary">Add</button>
          </div>
          <div v-if="errors.techStack" class="form-error">{{ errors.techStack }}</div>
          
          <div v-if="newProject.techStack.length > 0" class="tech-stack-list">
            <span v-for="tech in newProject.techStack" :key="tech" class="tech-tag">
              {{ tech }}
              <button 
                type="button" 
                @click="removeTechItem(tech)" 
                class="remove-tech" 
                aria-label="Remove technology"
              >
                ✕
              </button>
            </span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="project-description" class="form-label">Description*</label>
          <textarea
            id="project-description"
            v-model="newProject.description"
            class="form-textarea"
            :class="{ 'error': errors.description }"
            placeholder="Describe your project..."
            rows="3"
          ></textarea>
          <div class="character-count">
            {{ newProject.description.length }}/300
          </div>
          <div v-if="errors.description" class="form-error">{{ errors.description }}</div>
        </div>
        
        <div class="form-actions">
          <button type="button" @click="cancelForm" class="btn btn-outline">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            {{ isEditing ? 'Update' : 'Add' }} Project
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.project-gallery {
  max-width: 800px;
  margin: 0 auto;
}

.subtitle {
  color: var(--color-neutral-600);
  margin-bottom: var(--space-4);
}

.projects-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.project-card {
  background-color: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-neutral-200);
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

.project-images {
  height: 180px;
  overflow: hidden;
  position: relative;
  background-color: var(--color-neutral-200);
}

.project-images img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-neutral-600);
}

.image-count {
  position: absolute;
  bottom: var(--space-2);
  right: var(--space-2);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
}

.project-content {
  padding: var(--space-3);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-2);
}

.project-header h3 {
  margin: 0;
  color: var(--color-primary);
}

.project-actions {
  display: flex;
  gap: var(--space-1);
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: var(--space-1);
  border-radius: var(--radius-md);
  transition: background-color 0.2s;
}

.btn-icon:hover {
  background-color: var(--color-neutral-200);
}

.project-description {
  color: var(--color-neutral-700);
  margin-bottom: var(--space-3);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: var(--text-sm);
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.tech-tag {
  background-color: var(--color-neutral-200);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  color: var(--color-neutral-700);
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

.add-project {
  margin-top: var(--space-4);
  text-align: center;
}

.project-form-container {
  background-color: var(--color-neutral-100);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-top: var(--space-4);
}

.project-form {
  margin-top: var(--space-3);
}

.image-upload-container {
  margin-bottom: var(--space-3);
}

.image-upload-btn {
  display: inline-block;
  padding: var(--space-2) var(--space-3);
  background-color: var(--color-neutral-300);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color 0.2s;
}

.image-upload-btn:hover {
  background-color: var(--color-neutral-400);
}

.image-previews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.image-preview {
  width: 100%;
  height: 100px;
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: var(--space-1);
  right: var(--space-1);
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  cursor: pointer;
}

.tech-input {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.tech-stack-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.tech-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: var(--color-neutral-200);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
}

.remove-tech {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.7rem;
  padding: 0;
  color: var(--color-neutral-700);
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

.dark-mode .project-card {
  background-color: var(--color-neutral-100);
  border-color: var(--color-neutral-300);
}

.dark-mode .empty-state,
.dark-mode .project-form-container {
  background-color: var(--color-neutral-200);
}

.dark-mode .tech-tag {
  background-color: var(--color-neutral-300);
}
</style>