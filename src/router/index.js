import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import Conferencias from '@/views/Conferencias.vue'
import DetalleView from '@/views/DetalleConferencia.vue'
import SignupView from '@/views/SignupView.vue'
import ConferenciasView from '@/views/ConferenciasView.vue'
// Asistente
import HomeAsistenteView from '@/views/Asistente/HomeAsistenteView.vue'
import ConferenciaAsistente from '@/views/Asistente/ConferenciaAsistente.vue'
import ConferenciasPosibles from '@/views/Asistente/ConferenciasPosiblesAsistente.vue'

import CompraEntrada from '@/views/CompraEntrada.vue'


// Administrador
import RegistroConferencistaAdministrador from '@/views/Administrador/RegistroConferencistaAdministrador.vue'
import SolicitudConferencistaAdministrador from '@/views/Administrador/SolicitudConferencistaAdministrador.vue'
import RegistroAsistenteAdministrador from '@/views/Administrador/RegistroAsistenteAdministrador.vue'
import ConferenciasAdministradorVue from '@/views/Administrador/ConferenciasAdministrador.vue'
import SolicitudConferenciaAdministrador from '@/views/Administrador/SolicitudConferenciaAdminitrador.vue'
// Conferencista
import HomeConferencistaView from '@/views/Conferencista/HomeConferencistaView.vue'
import ConferenciaConferencista from '@/views/Conferencista/ConferenciaConferencista.vue'

import DetalleEvento from '@/views/Conferencista/DetalleEvento.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/conferencias',
      name: 'Conferencias',
      component: Conferencias,},
      {
      path: '/CompraEntrada',
      name: 'CompraEntrada',
      component: CompraEntrada,},
   
    
   
    {
      
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/conferencias/general',
      name: 'ConferenciasView',
      component: ConferenciasView,
    },



    // Asistente
    {
    path: '/asistente/home',
    name: 'homeAsistente',
    component: HomeAsistenteView,
    meta: { showAsistenteNav: true }, // Mostrar navbar de asist
    },
    {
      path: '/asistente/conferencias',
      name: 'conferenciasAsistente',
      component: ConferenciasPosibles,
      meta: { showAsistenteNav: true }, // Mostrar navbar de asist
      },
    
    {
      path: '/asistente/conferencia/:id',
      name: 'conferenciaAsistente',
      component: ConferenciaAsistente,
      meta: { showAsistenteNav: true },
    },    
    {
      path: '/conferencia/detalle/:id',
      name: 'ConferenciaDetalle',
      component: DetalleView,
      meta: { showAsistenteNav: true },
    },
    



    

    // Administrador
    {
      path: '/admin/registro/conferencista',
      name: 'registroConferencista',
      component: RegistroConferencistaAdministrador,
      meta: { showAdminNav: true }, // Mostrar navbar de administrador
    },
    {
      path: '/admin/solicitud/conferencista',
      name: 'solicitudConferencista',
      component: SolicitudConferencistaAdministrador,
      meta: { showAdminNav: true }, // Mostrar navbar de administrador
    },
    {
      path: '/admin/solicitud/charla',
      name: 'solicitudCharla',
      component: SolicitudConferenciaAdministrador,
      meta: { showAdminNav: true }, // Mostrar navbar de administrador
    },
    {
      path: '/admin/registro/asistente',
      name: 'registroAsistenteAdministrador',
      component: RegistroAsistenteAdministrador,
      meta: { showAdminNav: true }, // Mostrar navbar de administrador
    },
    {
      path: '/admin/conferencias',
      name: 'ConferenciasAdministradorVue',
      component: ConferenciasAdministradorVue,
      meta: { showAdminNav: true }, // Mostrar navbar de administrador
    },

    // Conferencista
    {
      path: '/conferencista/home',
      name: 'homeConferencista',
      component: HomeConferencistaView,
      meta: { showConferencistaNav: true }, // Mostrar navbar de conferencista

    },
    {
      path: '/conferencista/conferencia/:id',
      name: 'conferenciaConferencista',
      component: ConferenciaConferencista,
      meta: { showConferencistaNav: true }, // Mostrar navbar de conferencista
    },
    {
      path: '/conferencista/detalle',
      name: 'detalleEvento',
      component: DetalleEvento,
      meta: { showConferencistaNav: true }, // Mostrar navbar de conferencista
    }

  ],
})

export default router
