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
import RegistroTecnicoAdministrador from '@/views/Administrador/RegistroTecnicoAdministrador.vue'
import ConferenciasAdministradorVue from '@/views/Administrador/ConferenciasAdministrador.vue'
import SolicitudConferenciaAdministrador from '@/views/Administrador/SolicitudConferenciaAdminitrador.vue'
// Tecnico
import HomeTecnicoView from '@/views/Tecnico/HomeTecnicoView.vue'
import RegistroAsistenteTecnicoView from '@/views/Tecnico/RegistroAsistenteTecnicoView.vue'
import RegistroConferencistaTecnicoView from '@/views/Tecnico/RegistroConferencistaTecnicoView.vue'
import RegistroTecnicoView from '@/views/Tecnico/RegistroTecnicosView.vue'
// Conferencista
import HomeConferencistaView from '@/views/Conferencista/HomeConferencistaView.vue'
import ConferenciaConferencista from '@/views/Conferencista/ConferenciaConferencista.vue'
import CategoriasTecnico from '@/views/Tecnico/CategoriasTecnico.vue'
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
      path: '/admin/registro/tecnico',
      name: 'registroTecnicoAdministrador',
      component: RegistroTecnicoAdministrador,
      meta: { showAdminNav: true }, // Mostrar navbar de administrador
    },
    {
      path: '/admin/conferencias',
      name: 'ConferenciasAdministradorVue',
      component: ConferenciasAdministradorVue,
      meta: { showAdminNav: true }, // Mostrar navbar de administrador
    },

    // Tecnico

    {
      path: '/tecnico/home',
      name: 'homeTecnico',
      component: HomeTecnicoView,
      meta: { showTecnicoNav: true }, // Mostrar navbar de tecnico

    },
    {
      path: '/tecnico/registro/asistente',
      name: 'registroAsistenteTecnico',
      component: RegistroAsistenteTecnicoView,
      meta: { showTecnicoNav: true }, // Mostrar navbar de tecnico
    },
    {
      path: '/tecnico/registro/conferencista',
      name: 'registroConferencistaTecnico',
      component: RegistroConferencistaTecnicoView,
      meta: { showTecnicoNav: true }, // Mostrar navbar de

    },
    {
      path: '/tecnico/registro/tecnico',
      name: 'registroTecnico',
      component: RegistroTecnicoView,
      meta: { showTecnicoNav: true }, // Mostrar navbar de

    },
    {
      path: '/tecnico/categorias',
      name: 'categoriasTecnico',
      component: CategoriasTecnico,
      meta: { showTecnicoNav: true }, // Mostrar navbar de

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
