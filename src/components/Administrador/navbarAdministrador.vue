<template>
  <nav class="navbar">
    <div class="container">
      <!-- Logo -->
      <router-link to="/admin/conferencias" class="logo">
        <img src="/images/FASTEVENTSAdmin.png" alt="Logo">
      </router-link>

      <!-- Navegación principal -->
      <ul class="nav-links">
        <li class="dropdown">
          <a>Registrar </a>
          <div class="dropdown-content">
            <router-link to="/admin/registro/conferencista">Empresas</router-link>
            <router-link to="/admin/registro/asistente">Asistentes</router-link>
          </div>
        </li>
        <li><router-link to="/admin/conferencias">Eventos</router-link></li>
        <li><router-link to="/admin/solicitud/conferencista">Solicitud de empresas</router-link></li>
        <li><router-link to="/admin/solicitud/charla">Solicitud de eventos</router-link></li>
        <li><a @click="salir" class="logout">Salir</a></li>
      </ul>

      <!-- Menú móvil -->
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <i class="fas fa-bars"></i>
      </button>
    </div>

    <!-- Menú móvil desplegable -->
    <transition name="slide-down">
      <div v-if="showMobileMenu" class="mobile-menu">
          <div class="mobile-registros" @click="toggleRegistrosMobile">
            <span>Registros</span>
            <div v-if="showRegistrosMobile" class="mobile-registros-options">
              <router-link to="/admin/registro/conferencista">Empresas</router-link>
              <router-link to="/admin/registro/asistente">Asistentes</router-link>
            </div>
          </div>
          <router-link to="/admin/solicitud/conferencista">Solicitud de empresas</router-link>
          <a @click="salir">Salir</a>
      </div>
    </transition>
  </nav>
</template>
  
  <script>

import { useAuthStore } from "@/stores/AuthStore";
  export default {
    setup() {
      const authStore = useAuthStore();
      return { authStore };
    },
    data() {
      return {
        searchQuery: '',
        selectedDepartment: '',
        showMobileMenu: false,
        showRegistrosMobile: false,
        bolivianDepartments: [
          'La Paz',
          'Cochabamba',
          'Santa Cruz',
          'Oruro',
          'Potosí',
          'Tarija',
          'Chuquisaca',
          'Beni',
          'Pando'
        ]
      }
    },
    methods: {
      handleSearch() {
        this.$emit('search', this.searchQuery)
      },
      handleLocationChange() {
        this.$emit('location-change', this.selectedDepartment)
      },
      toggleMobileMenu() {
        this.showMobileMenu = !this.showMobileMenu
      },
      toggleRegistrosMobile() {
      this.showRegistrosMobile = !this.showRegistrosMobile;
    },
        salir() {
            this.authStore.logout();
            this.$router.push("/login");
        }
    }
  }
  </script>
  
  <style scoped>
  img {
    max-width: 100%;
    height: auto;
    scale: 1.6;
  }
  .navbar {
    background: #ffffff;
    color: rgb(17, 16, 16);
    padding: 1rem 0;
    position: fixed;
    font-size: 1.3rem;
    top: 0;
    width: 100%;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  .container {
    max-width: 1800px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
  }
  
  .logo img {
    height: 70px;
  }
  
  .nav-links {
    display: flex;
    margin-right: 2rem;
    gap: 2rem;
    list-style: none;
  }
  
  .nav-links a {
    color: rgb(2, 2, 2);
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .nav-links a:hover {
    color: #84b7c2;
  }
  
  .nav-controls {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
.dropdown {
  position: relative;
  display: inline-block;
  border-radius: 5px;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #ffffff;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  top: 100%;
  left: 0;
  border-radius: 5px;
}

.dropdown:hover .dropdown-content {
  display: block;
  border-radius: 5px;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
  border-radius: 5px;
}

/* Estilos para mobile */
.mobile-registros {
  padding: 1rem;
  cursor: pointer;
}

.mobile-registros-options {
  padding-left: 1.5rem;
}

.mobile-registros-options a {
  display: block;
  padding: 0.5rem 0;
}

  .logout {
      padding: 5px 15px;
      border-radius: 10px;
      color: white !important;
      cursor: pointer;
      background-color: #052c80;
    }

    .logout:hover{
      padding: 5px 15px;
      border-radius: 10px;
      color: white !important;
      cursor: pointer;
      background-color: #84b7c2;
    }

  .search-box {
    display: flex;
    align-items: center;
    font-size: 1.7rem;
    background: rgba(255,255,255,0.1);
    border-radius: 25px;
    padding: 0.3rem 0.8rem;
  }
  
  .search-box input {
    background: transparent;
    border: none;
    color: rgb(16, 15, 15);
    font-size: 1.3rem;
    padding: 0.5rem;
    min-width: 200px;
  }
  
  .search-box button {
    background: none;
    border: none;
    font-size: 1.3rem;
    color: rgb(14, 12, 12);
    cursor: pointer;
  }
  
  .location-selector select {
    background: rgba(255,255,255,0.1);
    font-size: 1.3rem;
    border: 1px solid rgba(255,255,255,0.3);
    color: rgb(12, 10, 10);
    padding: 0.5rem;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    color: rgb(1, 1, 1);
    font-size: 1.3rem;
  }
  
  .mobile-menu {
    display: none;
    background: #cbccd4;
    padding: 1rem;
    text-align: center;
  }
  
  .mobile-menu a {
    display: block;
    color: rgb(15, 12, 12);
    text-decoration: none;
    padding: 1rem;
  }
  
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: all 0.3s ease;
  }
  
  .slide-down-enter-from,
  .slide-down-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
  
  @media (max-width: 768px) {
    .nav-links,
    .nav-controls {
      display: none;
    }
  
    .mobile-menu-btn {
      display: block;
    }
  
    .mobile-menu {
      display: block;
    }
  }
  </style>