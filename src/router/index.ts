import Home from '../views/Home.vue'
import PortfolioBuilder from '../views/PortfolioBuilder.vue'
import ProfileSetup from '../views/steps/ProfileSetup.vue'
import ServicesOffered from '../views/steps/ServicesOffered.vue'
import ProjectGallery from '../views/steps/ProjectGallery.vue'
import Testimonials from '../views/steps/Testimonials.vue'
import Availability from '../views/steps/Availability.vue'
import PortfolioPreview from '../views/steps/PortfolioPreview.vue'
import ExportPublish from '../views/steps/ExportPublish.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/portfolio-builder',
    component: PortfolioBuilder,
    children: [
      {
        path: '',
        redirect: { name: 'ProfileSetup' }
      },
      {
        path: 'profile-setup',
        name: 'ProfileSetup',
        component: ProfileSetup
      },
      {
        path: 'services',
        name: 'ServicesOffered',
        component: ServicesOffered
      },
      {
        path: 'projects',
        name: 'ProjectGallery',
        component: ProjectGallery
      },
      {
        path: 'testimonials',
        name: 'Testimonials',
        component: Testimonials
      },
      {
        path: 'availability',
        name: 'Availability',
        component: Availability
      },
      {
        path: 'preview',
        name: 'PortfolioPreview',
        component: PortfolioPreview
      },
      {
        path: 'export',
        name: 'ExportPublish',
        component: ExportPublish
      }
    ]
  }
]

export default routes