<template>
    <nav class="navbar">
      <div class="container">
        <!-- Logo -->
        <router-link to="/asistente/home" class="logo">
          <img src="/images/FASTEVENTSAsistente.png" alt="Logo">
        </router-link>
  
        <!-- Navegación principal -->
        <ul class="nav-links">
            <li><router-link to="/asistente/home">Inicio</router-link></li>
            <li><router-link to="/asistente/conferencias">Conferencias</router-link></li>
          <li><a @click="salir">Salir</a></li>
          
        </ul>
  
        <!-- Controles de búsqueda y ubicació   n -->
                 <!-- Controles de búsqueda y ubicació   n -->
      
        
        <!-- Menú móvil -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <i class="fas fa-bars"></i>
        </button>
      </div>
  
      <!-- Menú móvil desplegable -->
      <transition name="slide-down">
        <div v-if="showMobileMenu" class="mobile-menu">
            

            <router-link to="/asistente/home">Inicio</router-link>
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
    height: 9%;
    
  }
  .logo{
    color: #000000;
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
    background: #1a237e;
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