<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usePortfolioStore } from "../../stores/portfolio";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
// Ensure `qrcode` is installed: `npm install qrcode`
import QRCode from "qrcode";

const portfolioStore = usePortfolioStore();

// State
const agreedToTerms = ref(false);
const isGeneratingPdf = ref(false);
const isGeneratingLink = ref(false);
const isGeneratingQR = ref(false);
const generatedLink = ref("");
const qrCodeUrl = ref("");
const copySuccess = ref(false);
const termsError = ref(false);
const qrError = ref("");

// Generate PDF
const generatePdf = async () => {
  if (!agreedToTerms.value) {
    termsError.value = true;
    return;
  }

  termsError.value = false;
  isGeneratingPdf.value = true;

  try {
    const element = document.getElementById("portfolio-content");
    if (!element) throw new Error("Portfolio content element not found");

    const pdf = new jsPDF("p", "mm", "a4");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    pdf.setFontSize(20);
    pdf.text(portfolioStore.profile.fullName || "Portfolio", 105, 15, {
      align: "center",
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 25, pdfWidth, pdfHeight);

    if (qrCodeUrl.value) {
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text("Scan to View Portfolio Online", 105, 20, { align: "center" });
      pdf.addImage(qrCodeUrl.value, "PNG", 80, 40, 50, 50);
      pdf.text(generatedLink.value || "Portfolio Data", 105, 100, {
        align: "center",
      });
    }

    pdf.save(`${portfolioStore.profile.fullName || "portfolio"}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    isGeneratingPdf.value = false;
  }
};

// Generate shareable link (mock for development)
const generateLink = () => {
  if (!agreedToTerms.value) {
    termsError.value = true;
    return;
  }

  termsError.value = false;
  isGeneratingLink.value = true;

  setTimeout(() => {
    try {
      // Replace with your actual portfolio URL or backend API call
      generatedLink.value = "http://localhost:5173/portfolio-builder/preview";
      isGeneratingLink.value = false;
      generateQRCode();
    } catch (error) {
      console.error("Error generating link:", error);
      qrError.value = "Failed to generate link";
      isGeneratingLink.value = false;
    }
  }, 1500);
};

// Generate QR code
const generateQRCode = async () => {
  isGeneratingQR.value = true;
  qrError.value = "";

  try {
    let qrContent = generatedLink.value;
    if (!qrContent) {
      // Fallback: Encode portfolio data as JSON
      qrContent = JSON.stringify({
        profile: portfolioStore.profile,
        services: portfolioStore.services,
        projects: portfolioStore.projects,
        testimonials: portfolioStore.testimonials,
        availability: portfolioStore.availability,
      });
      console.warn("No link provided; encoding portfolio data in QR code");
    }

    qrCodeUrl.value = await QRCode.toDataURL(qrContent, {
      width: 200,
      margin: 2,
      errorCorrectionLevel: "H", // High error correction for better scanning
    });
    console.log("QR code generated for:", qrContent);
  } catch (error) {
    console.error("Error generating QR code:", error);
    qrError.value = "Failed to generate QR code";
  } finally {
    isGeneratingQR.value = false;
  }
};

// Download QR code as image
const downloadQRCode = () => {
  if (!qrCodeUrl.value) return;

  const link = document.createElement("a");
  link.href = qrCodeUrl.value;
  link.download = `${
    portfolioStore.profile.fullName || "portfolio"
  }-qrcode.png`;
  link.click();
};

// Copy link to clipboard
const copyLink = async () => {
  if (!generatedLink.value) return;

  try {
    await navigator.clipboard.writeText(generatedLink.value);
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (error) {
    console.error("Error copying link:", error);
  }
};

onMounted(() => {
  portfolioStore.saveData();
});
</script>

<template>
  <div class="export-publish">
    <h2>Export & Publish</h2>
    <p class="subtitle">Share your portfolio with the world.</p>

    <div id="portfolio-content" class="portfolio-content">
      <div class="profile-summary">
        <div v-if="portfolioStore.profile.avatar" class="profile-avatar">
          <img :src="portfolioStore.profile.avatar" alt="Profile Avatar" />
        </div>
        <div class="profile-info">
          <h2>{{ portfolioStore.profile.fullName || "Your Name" }}</h2>
          <p class="tagline">
            {{ portfolioStore.profile.tagline || "Your professional tagline" }}
          </p>
          <p v-if="portfolioStore.profile.location" class="location">
            {{ portfolioStore.profile.location }}
          </p>
        </div>
      </div>

      <div v-if="portfolioStore.services.length > 0" class="section">
        <h3>Services</h3>
        <ul class="services-list">
          <li v-for="service in portfolioStore.services" :key="service.id">
            <strong>{{ service.title }}</strong> -
            {{ service.pricing.amount }} USD / {{ service.pricing.type }}
          </li>
        </ul>
      </div>

      <div v-if="portfolioStore.projects.length > 0" class="section">
        <h3>Projects</h3>
        <ul class="projects-list">
          <li v-for="project in portfolioStore.projects" :key="project.id">
            <strong>{{ project.name }}</strong>
            <span class="tech-list">
              {{ project.techStack.join(", ") }}
            </span>
          </li>
        </ul>
      </div>

      <div v-if="portfolioStore.testimonials.length > 0" class="section">
        <h3>Client Testimonials</h3>
        <div class="testimonials-summary">
          <div
            v-for="testimonial in portfolioStore.testimonials.slice(0, 2)"
            :key="testimonial.id"
            class="testimonial-item"
          >
            <div class="rating">{{ "★".repeat(testimonial.rating) }}</div>
            <p class="feedback">"{{ testimonial.feedback }}"</p>
            <p class="client">— {{ testimonial.clientName }}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Contact & Availability</h3>
        <p v-if="portfolioStore.availability.timezone">
          Timezone: {{ portfolioStore.availability.timezone }}
        </p>
        <p v-if="portfolioStore.availability.slots.length > 0">
          Available: {{ portfolioStore.availability.slots.length }} time slots
          per week
        </p>
        <p v-if="portfolioStore.profile.socialLinks.linkedin">
          LinkedIn: {{ portfolioStore.profile.socialLinks.linkedin }}
        </p>
        <p v-if="portfolioStore.profile.socialLinks.website">
          Website: {{ portfolioStore.profile.socialLinks.website }}
        </p>
      </div>
    </div>

    <div class="terms-agreement">
      <label class="terms-checkbox">
        <input type="checkbox" v-model="agreedToTerms" />
        <span
          >I agree to the
          <a href="#" @click.prevent>Terms and Conditions</a> for publishing my
          portfolio.</span
        >
      </label>
      <div v-if="termsError" class="form-error">
        Please agree to the terms and conditions before continuing
      </div>
    </div>

    <div class="export-options">
      <div class="export-option">
        <h3>Download as PDF</h3>
        <p>Get a printable version of your portfolio.</p>
        <button
          @click="generatePdf"
          class="btn btn-primary"
          :disabled="isGeneratingPdf"
        >
          <span v-if="isGeneratingPdf">Generating...</span>
          <span v-else>Download PDF</span>
        </button>
      </div>

      <div class="export-option">
        <h3>Get Shareable Link & QR Code</h3>
        <p>Generate a link and QR code to share with potential clients.</p>
        <button
          @click="generateLink"
          class="btn btn-primary"
          :disabled="isGeneratingLink || isGeneratingQR"
        >
          <span v-if="isGeneratingLink || isGeneratingQR">Generating...</span>
          <span v-else>Generate Link & QR</span>
        </button>

        <div v-if="qrError" class="form-error">
          {{ qrError }}
        </div>

        <div v-if="generatedLink" class="share-link">
          <div class="link-container">
            <input type="text" readonly :value="generatedLink" />
            <button @click="copyLink" class="btn-copy">
              {{ copySuccess ? "Copied!" : "Copy" }}
            </button>
          </div>
        </div>

        <div v-if="qrCodeUrl" class="qr-code">
          <img :src="qrCodeUrl" alt="Portfolio QR Code" />
          <button @click="downloadQRCode" class="btn btn-secondary">
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.export-publish {
  max-width: 800px;
  margin: 0 auto;
}

.subtitle {
  color: var(--color-neutral-600);
  margin-bottom: var(--space-4);
}

.portfolio-content {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  margin-bottom: var(--space-5);
  box-shadow: var(--shadow-md);
}

.profile-summary {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-neutral-200);
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info h2 {
  margin: 0 0 var(--space-1) 0;
  color: var(--color-primary);
}

.tagline {
  margin: 0 0 var(--space-2) 0;
  font-size: var(--text-lg);
}

.location {
  margin: 0;
  color: var(--color-neutral-600);
}

.section {
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-neutral-200);
}

.section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section h3 {
  color: var(--color-primary);
  margin-bottom: var(--space-3);
}

.services-list,
.projects-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.services-list li,
.projects-list li {
  margin-bottom: var(--space-2);
}

.tech-list {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
  margin-left: var(--space-2);
}

.testimonials-summary {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-3);
}

.testimonial-item {
  padding: var(--space-3);
  background-color: var(--color-neutral-100);
  border-radius: var(--radius-md);
}

.rating {
  color: var(--color-warning);
  margin-bottom: var(--space-2);
}

.feedback {
  font-style: italic;
  margin-bottom: var(--space-2);
}

.client {
  text-align: right;
  margin: 0;
  font-weight: 500;
}

.terms-agreement {
  margin-bottom: var(--space-4);
}

.terms-checkbox {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

.export-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.export-option {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
}

.export-option h3 {
  margin-top: 0;
}

.share-link {
  margin-top: var(--space-3);
}

.link-container {
  display: flex;
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.link-container input {
  flex: 1;
  padding: var(--space-2);
  border: none;
  outline: none;
  background-color: var(--color-neutral-100);
}

.btn-copy {
  padding: var(--space-2) var(--space-3);
  background-color: var(--color-neutral-200);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-copy:hover {
  background-color: var(--color-neutral-300);
}

.qr-code {
  margin-top: var(--space-3);
  text-align: center;
}

.qr-code img {
  max-width: 150px;
  margin-bottom: var(--space-2);
}

.btn-secondary {
  padding: var(--space-2) var(--space-4);
  background-color: var(--color-neutral-200);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: var(--color-neutral-300);
}

.form-error {
  color: var(--color-error);
  font-size: var(--text-sm);
  margin-top: var(--space-2);
}

.save-data {
  text-align: center;
  color: var(--color-neutral-600);
  margin-top: var(--space-5);
}

.data-note {
  font-size: var(--text-sm);
  margin-top: var(--space-2);
}

@media (max-width: 768px) {
  .export-options {
    grid-template-columns: 1fr;
  }

  .profile-summary {
    flex-direction: column;
    text-align: center;
  }
}

.dark-mode .portfolio-content,
.dark-mode .export-option {
  background-color: var(--color-neutral-100);
}

.dark-mode .testimonial-item {
  background-color: var(--color-neutral-200);
}

.dark-mode .btn-copy,
.dark-mode .btn-secondary {
  color: white;
}
</style>
