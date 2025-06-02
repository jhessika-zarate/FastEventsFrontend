<template>
    <section>
      <img  class="banner" src="https://picsum.photos/300/50"></img>
      
    <router-link :to="`/conferencia/detalle/${conference.id}`" class="conference-card">
     
      <div class="card-header">
        
        <span class="modality-badge" :class="conference.modality.toLowerCase()">
          {{ conference.modality }}
        </span>
        <h3 class="title">{{ conference.titulo }}</h3>
      </div>
      
      <div class="card-body">
        <div class="info-item">
          <i class="fas fa-calendar-alt"></i>
          {{ formatDate(conference.date) }}
        </div>
        <div class="time-location">
          <span><i class="fas fa-clock"></i> {{ conference.time }}</span>
          <span><i class="fas fa-map-marker-alt"></i> {{ conference.departamento }}</span>
        </div>
        
        <div class="topics-container">
          <span 
            v-for="(topic, index) in conference.tema" 
            :key="index" 
            class="topic-tag"
          >
            {{ topic }}
          </span>
        </div>
        
        <p class="description">{{ conference.description }}</p>
      </div>
    </router-link>
  </section>
  </template>
  
  <script>
  export default {
    props: {
      conference: {
        type: Object,
        required: true
      }
    },
    methods: {
      formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(dateString).toLocaleDateString('es-ES', options)
      }
    }
  }
  </script>
  
  <style scoped>
  .banner {
  width: 100%; 
  height: auto; 
  border-top-left-radius: 12px; 
  border-top-right-radius: 12px; 
  display: block; 
}

.conference-card {
  background: white;
  border-bottom-left-radius: 12px; 
  border-bottom-right-radius: 12px; 
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  display: block;
  color: inherit;
  
  text-decoration: none;
}
  .conference-card:hover {
    transform: translateY(-5px);
  }
  
  .modality-badge {
    float: right;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.75rem;
    font-weight: bold;
  }
  
.conference-card:hover {
  transform: translateY(-5px);
}

.card-header {
  padding-top: 1rem; /* Opcional: Padding específico para la parte del encabezado */
}

.card-body {
  padding-top: 1rem; /* Opcional: Padding específico para el cuerpo de la tarjeta */
}
  .modality-badge.presencial {
    background: #4CAF50;
    color: white;
  }
  
  .modality-badge.virtual {
    background: #2196F3;
    color: white;
  }
  
  .title {
    font-size: 1.25rem;
    margin: 0.5rem 0;
    color: #1a237e;
  }
  
  .time-location {
    display: flex;
    justify-content: space-between;
    margin: 1rem 0;
    color: #666;
    font-size: 0.9rem;
  }
  
  .description {
    font-size: 0.95rem;
    line-height: 1.4;
    color: #444;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>