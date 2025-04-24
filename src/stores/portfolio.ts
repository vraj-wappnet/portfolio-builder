import { defineStore } from "pinia";
import { ref, computed } from "vue";

// Define types for our portfolio data
export interface Profile {
  avatar?: string;
  fullName: string;
  tagline: string;
  location: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface Service {
  id: string;
  title: string;
  description: string;
  pricing: {
    type: "hourly" | "project";
    amount: number;
  };
  deliveryTime: string;
}

export interface Project {
  id: string;
  name: string;
  images: string[];
  techStack: string[];
  description: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  rating: number;
  feedback: string;
}

export interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Availability {
  timezone: string;
  slots: AvailabilitySlot[];
  preferredCommunication: "email" | "call" | "zoom";
}

export const usePortfolioStore = defineStore("portfolio", () => {
  // State
  const profile = ref<Profile>({
    fullName: "",
    tagline: "",
    location: "",
    socialLinks: {},
  });

  const services = ref<Service[]>([]);
  const projects = ref<Project[]>([]);
  const testimonials = ref<Testimonial[]>([]);
  const availability = ref<Availability>({
    timezone: "",
    slots: [],
    preferredCommunication: "email",
  });

  const lastUpdated = ref<number | null>(null);
  const draftSaved = ref(false);

  //preview
  // In your portfolio store (stores/portfolio.ts)
  const isPreviewComplete = computed(() => {
    // Consider preview complete if at least one section is complete
    return (
      isProfileComplete.value ||
      isServicesComplete.value ||
      isProjectsComplete.value ||
      isTestimonialsComplete.value ||
      isAvailabilityComplete.value
    );
  });

  // Load data from localStorage on initialization
  const loadSavedData = () => {
    const savedData = localStorage.getItem("portfolioData");
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.profile) profile.value = data.profile;
      if (data.services) services.value = data.services;
      if (data.projects) projects.value = data.projects;
      if (data.testimonials) testimonials.value = data.testimonials;
      if (data.availability) availability.value = data.availability;
      if (data.lastUpdated) lastUpdated.value = data.lastUpdated;
      draftSaved.value = true;
    }
  };

  // Save data automatically
  const saveData = () => {
    lastUpdated.value = Date.now();
    localStorage.setItem(
      "portfolioData",
      JSON.stringify({
        profile: profile.value,
        services: services.value,
        projects: projects.value,
        testimonials: testimonials.value,
        availability: availability.value,
        lastUpdated: lastUpdated.value,
      })
    );
    draftSaved.value = true;
  };

  // Computed properties to check if steps are complete
  const isProfileComplete = computed(() => {
    return !!profile.value.fullName && !!profile.value.tagline;
  });

  const isServicesComplete = computed(() => {
    return services.value.length > 0;
  });

  const isProjectsComplete = computed(() => {
    return projects.value.length > 0;
  });

  const isTestimonialsComplete = computed(() => {
    return true; // Optional step
  });

  const isAvailabilityComplete = computed(() => {
    return availability.value.slots.length > 0 && !!availability.value.timezone;
  });

  // Update functions for each section
  const updateProfile = (updatedProfile: Profile) => {
    profile.value = { ...updatedProfile };
    saveData();
  };

  const updateServices = (updatedServices: Service[]) => {
    services.value = [...updatedServices];
    saveData();
  };

  const addService = (service: Service) => {
    services.value.push(service);
    saveData();
  };

  const updateService = (serviceId: string, updatedService: Service) => {
    const index = services.value.findIndex((s) => s.id === serviceId);
    if (index !== -1) {
      services.value[index] = { ...updatedService };
      saveData();
    }
  };

  const removeService = (serviceId: string) => {
    services.value = services.value.filter((s) => s.id !== serviceId);
    saveData();
  };

  const updateProjects = (updatedProjects: Project[]) => {
    projects.value = [...updatedProjects];
    saveData();
  };

  const addProject = (project: Project) => {
    projects.value.push(project);
    saveData();
  };

  const updateProject = (projectId: string, updatedProject: Project) => {
    const index = projects.value.findIndex((p) => p.id === projectId);
    if (index !== -1) {
      projects.value[index] = { ...updatedProject };
      saveData();
    }
  };

  const removeProject = (projectId: string) => {
    projects.value = projects.value.filter((p) => p.id !== projectId);
    saveData();
  };

  const updateTestimonials = (updatedTestimonials: Testimonial[]) => {
    testimonials.value = [...updatedTestimonials];
    saveData();
  };

  const addTestimonial = (testimonial: Testimonial) => {
    testimonials.value.push(testimonial);
    saveData();
  };

  const updateTestimonial = (
    testimonialId: string,
    updatedTestimonial: Testimonial
  ) => {
    const index = testimonials.value.findIndex((t) => t.id === testimonialId);
    if (index !== -1) {
      testimonials.value[index] = { ...updatedTestimonial };
      saveData();
    }
  };

  const removeTestimonial = (testimonialId: string) => {
    testimonials.value = testimonials.value.filter(
      (t) => t.id !== testimonialId
    );
    saveData();
  };

  const updateAvailability = (updatedAvailability: Availability) => {
    availability.value = { ...updatedAvailability };
    saveData();
  };

  // Clear data (for testing or reset)
  const clearAll = () => {
    profile.value = {
      fullName: "",
      tagline: "",
      location: "",
      socialLinks: {},
    };
    services.value = [];
    projects.value = [];
    testimonials.value = [];
    availability.value = {
      timezone: "",
      slots: [],
      preferredCommunication: "email",
    };
    lastUpdated.value = null;
    draftSaved.value = false;
    localStorage.removeItem("portfolioData");
  };

  // Calculate portfolio statistics
  const portfolioStats = computed(() => {
    const avgRating = testimonials.value.length
      ? testimonials.value.reduce((sum, t) => sum + t.rating, 0) /
        testimonials.value.length
      : 0;

    return {
      services: services.value.length,
      projects: projects.value.length,
      testimonials: testimonials.value.length,
      avgRating: avgRating.toFixed(1),
    };
  });

  // Initialize store
  loadSavedData();

  return {
    // State
    profile,
    services,
    projects,
    testimonials,
    availability,
    lastUpdated,
    draftSaved,

    // Computed
    isProfileComplete,
    isServicesComplete,
    isProjectsComplete,
    isTestimonialsComplete,
    isAvailabilityComplete,
    portfolioStats,

    // Actions
    updateProfile,
    updateServices,
    addService,
    updateService,
    removeService,
    updateProjects,
    addProject,
    updateProject,
    removeProject,
    updateTestimonials,
    addTestimonial,
    updateTestimonial,
    removeTestimonial,
    updateAvailability,
    saveData,
    clearAll,
  };
});
