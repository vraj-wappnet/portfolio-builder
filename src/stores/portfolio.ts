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
  feedback: string;
  rating: number;
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

export const usePortfolioStore = defineStore(
  "portfolio",
  () => {
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
      return testimonials.value.length > 0;
    });

    const isAvailabilityComplete = computed(() => {
      return (
        availability.value.slots.length > 0 && !!availability.value.timezone
      );
    });

    // Update functions for each section
    const updateProfile = (updatedProfile: Profile) => {
      profile.value = { ...updatedProfile };
      draftSaved.value = true;
    };

    const updateServices = (updatedServices: Service[]) => {
      services.value = [...updatedServices];
      draftSaved.value = true;
    };

    const addService = (service: Service) => {
      services.value.push(service);
      draftSaved.value = true;
    };

    const updateService = (serviceId: string, updatedService: Service) => {
      const index = services.value.findIndex((s) => s.id === serviceId);
      if (index !== -1) {
        services.value[index] = { ...updatedService };
        draftSaved.value = true;
      }
    };

    const removeService = (serviceId: string) => {
      services.value = services.value.filter((s) => s.id !== serviceId);
      draftSaved.value = true;
    };

    const updateProjects = (updatedProjects: Project[]) => {
      projects.value = [...updatedProjects];
      draftSaved.value = true;
    };

    const addProject = (project: Project) => {
      projects.value.push(project);
      draftSaved.value = true;
    };

    const updateProject = (projectId: string, updatedProject: Project) => {
      const index = projects.value.findIndex((p) => p.id === projectId);
      if (index !== -1) {
        projects.value[index] = { ...updatedProject };
        draftSaved.value = true;
      }
    };

    const removeProject = (projectId: string) => {
      projects.value = projects.value.filter((p) => p.id !== projectId);
      draftSaved.value = true;
    };

    const updateTestimonials = (updatedTestimonials: Testimonial[]) => {
      testimonials.value = [...updatedTestimonials];
      draftSaved.value = true;
    };

    const addTestimonial = (testimonial: Testimonial) => {
      testimonials.value.push(testimonial);
      draftSaved.value = true;
    };

    const updateTestimonial = (
      testimonialId: string,
      updatedTestimonial: Testimonial
    ) => {
      const index = testimonials.value.findIndex((t) => t.id === testimonialId);
      if (index !== -1) {
        testimonials.value[index] = { ...updatedTestimonial };
        draftSaved.value = true;
      }
    };

    const removeTestimonial = (testimonialId: string) => {
      testimonials.value = testimonials.value.filter(
        (t) => t.id !== testimonialId
      );
      draftSaved.value = true;
    };

    const updateAvailability = (updatedAvailability: Availability) => {
      availability.value = { ...updatedAvailability };
      draftSaved.value = true;
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
      clearAll,
    };
  },
  {
    persist: {
      key: "portfolioData",
      storage: localStorage,
    },
  }
);
