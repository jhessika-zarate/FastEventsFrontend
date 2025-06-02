<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import NavBarAdministrador from './components/Administrador/navbarAdministrador.vue'
import NavBarNormal from './components/navbar.vue'
import NavBarConferencista from './components/Conferencista/navbarConferencista.vue'
import NavBarAsistente from './components/Asistente/navbarAsistente.vue'
import NavBarTecnico from './components/Tecnico/navbarTecnico.vue'
// Usamos `useRoute` para obtener información sobre la ruta activa
const route = useRoute()
</script>

<template>
  <!-- Condicionalmente renderizar el navbar basado en la ruta -->
  <component  :is="
      route.meta.showAdminNav ? NavBarAdministrador :
      route.meta.showConferencistaNav ? NavBarConferencista :
      route.meta.showAsistenteNav ? NavBarAsistente :
      route.meta.showTecnicoNav ? NavBarTecnico :
      NavBarNormal
    "  @search="handleSearch" @location-change="handleLocationChange" />
  <RouterView />
</template>

<style scoped>
:global(body) {
  background-color: #f9f0ed;
  font-family: 'Lato';
}
</style>
