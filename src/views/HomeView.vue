<template>
    <body>
    <section 
      class="banner"
      :style="{ backgroundPositionY: parallaxOffset + 'px' }"
      ref="banner"
    >
      <div class="content">
        <h1 class="title">FastEvents</h1>
        <p class="subtitle">Eventos Que Conectan</p>
        <button class="cta-button" @click="scrollToContent">Descubre próximos eventos</button>
      </div>
      <div class="image-grid">
        <div 
          v-for="(image, index) in images"
          :key="index"
          class="grid-item"
          :style="{ backgroundImage: `url(${image})` }"
        ></div>
      </div>
      
    </section>
    <div class="category-buttons">
      
      <button 
        v-for="(category, index) in categories"
        :key="index"
        class="category-button"
        :style="{ '--color': category.color }"
        @click="selectCategory(category)"
      >
        <span class="icon-wrapper">
          <i :class="category.icon"></i>
        </span>
        
        <span class="label">{{ category.name }}</span>
      </button>
    </div>
   
  
   <!-- Sección de Conferencias -->
   <div class="conferences-container">
    <div class="conferences-grid">
      <ConferenceCard 
        v-for="conference in filteredConferences" 
        :key="conference.id"
        :conference="conference"
      />
    </div>
  </div>
  </body>
  </template>
  
  <script>
  
  import ConferenceCard from '@/components/ConferenceCard.vue';
  export default {
    
    data() {
      return {
        selectedCategory: null,
      conferences: [
        {
          id: 1,
          title: 'Conferencia de Inteligencia Artificial',
          date: '2024-03-15',
          time: '18:00',
          location: 'Auditorio Principal',
          modality: 'Presencial',
          topics: ['Tecnología', 'IA', 'Innovación'],
          description: 'Explorando el futuro de la IA en la sociedad moderna',
          category: 'Tecnología'
        },
        {
          id: 1,
          title: 'Conferencia de Inteligencia Artificial',
          date: '2024-03-15',
          time: '18:00',
          location: 'Auditorio Principal',
          modality: 'Presencial',
          topics: ['Tecnología', 'IA', 'Innovación'],
          description: 'Explorando el futuro de la IA en la sociedad moderna',
          category: 'Tecnología'
        },
        {
          id: 1,
          title: 'Conferencia de Inteligencia Artificial',
          date: '2024-03-15',
          time: '18:00',
          location: 'Auditorio Principal',
          modality: 'Presencial',
          topics: ['Tecnología', 'IA', 'Innovación'],
          description: 'Explorando el futuro de la IA en la sociedad moderna',
          category: 'Ciencia'
        },  
        {
          id: 1,
          title: 'Conferencia de Inteligencia Artificial',
          date: '2024-03-15',
          time: '18:00',
          location: 'Auditorio Principal',
          modality: 'Presencial',
          topics: ['Tecnología', 'IA', 'Innovación'],
          description: 'Explorando el futuro de la IA en la sociedad moderna',
          category: 'Tecnología'
        },
        // Agrega más conferencias con diferentes categorías
      ],
        parallaxOffset: 0,
        images: [
          '/images/conf1.jpg',
          '/images/conf2.jpg',
         
        ],
       categories: [
  { name: 'Conciertos', icon: 'fas fa-music', color: '#4B0082' },        // Ícono de música + color violeta oscuro
  { name: 'Teatro', icon: 'fas fa-theater-masks', color: '#1C3F60' },    // Ícono de teatro + azul profundo
  { name: 'Arte', icon: 'fas fa-palette', color: '#5A2A83' },            // Ícono de paleta + púrpura oscuro
  { name: 'Charla', icon: 'fas fa-microphone-alt', color: '#2C5F2D' },   // Ícono de micrófono + verde oscuro
  { name: 'Festival', icon: 'fas fa-star', color: '#8B0000' }            // Ícono de estrella + rojo vino
]

      }
    },
    components: {
    ConferenceCard
  },
    mounted() {
      window.addEventListener('scroll', this.handleScroll)
    },
    beforeUnmount() {
      window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      selectCategory(category) {
      this.selectedCategory = this.selectedCategory === category ? null : category;
    }
,
      handleScroll() {
        if (this.$refs.banner) {
          const rect = this.$refs.banner.getBoundingClientRect()
          this.parallaxOffset = rect.top * 0.5
        }
      },
      selectCategory(category) {
      // Lógica para manejar la selección
      console.log('Categoría seleccionada:', category.name);
    }
    },
    computed: {
    filteredConferences() {
      if (!this.selectedCategory) return this.conferences;
      return this.conferences.filter(conf => 
        conf.category === this.selectedCategory.name
      );
    }
  },
  }
  </script>
  
<style scoped>
body{
  background-color: rgb(29, 27, 27);
}
.category-buttons {
  position: relative;
  
  top: 75vh;
  transform: translateX(-50%);
  display: flex;
  gap: 2rem;
  z-index: 3;
  flex-wrap: wrap;
  justify-content: center; 
  max-width: 1500px;
  min-width: 1500px;
  padding: 0.1rem;
}
.category-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 2rem;
  padding: 1rem 2rem;
  background: rgba(var(--color-rgb));
  border: 2px solid rgba(var(--color-rgb));
  border-radius: 12px;
  color: rgb(246, 244, 244);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.622);
}

.category-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(var(--color-rgb)) 0%,
    rgba(var(--color-rgb)) 100%
  );
  z-index: -1;
}

.icon-wrapper {
  width: 70px;
  height: 70px;
  display: flex;
  margin-bottom: 10px;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  transition: transform 0.3s ease;
}

.category-button:hover .icon-wrapper {
  transform: rotate(15deg) scale(1.2);
}

.label {
 
  font-weight: 600;
  font-size: 1.2rem;
  letter-spacing: 1px;
}

/* Efecto de hover */
.category-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(var(--color-rgb));
  border-color: rgba(var(--color-rgb));
  background: rgba(var(--color-rgb));
}

/* Colores dinámicos */
.category-button:nth-child(1) { --color-rgb: 180, 134, 189 }
.category-button:nth-child(2) { --color-rgb: 40, 88, 123}
.category-button:nth-child(3) { --color-rgb: 132, 183, 194 }
.category-button:nth-child(4) { --color-rgb: 37, 17, 1}
.category-button:nth-child(5) { --color-rgb: 177, 94, 108 }

/* Animación de iconos */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.category-button:hover i {
  animation: bounce 0.6s ease;
}
.banner {
  padding-top: 2rem;
  height: 80vh;
  min-height: 600px;
  width:90%;
  margin: 0 auto;
  position: relative;
 border-bottom-right-radius: 2%;
 border-bottom-left-radius: 2%;
 
  overflow: hidden;
  background: linear-gradient(rgba(142, 135, 135, 0.15), rgba(29, 26, 26, 0.251)),
              url('/images/conf1.jpg');
  background-size: cover;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 5%;
}

.content {  
  text-align: left;
  background-color: rgba(0, 0, 0, 0.529);
  padding: 1.5rem;
  border-radius: 10px;
  z-index: 2;
  max-width: 600px;
}

.title {
 
  font-size: 7rem;
  margin: 0;
  background: #ffffff;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 0.9;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.subtitle {
  font-size: 2rem;
  color: #ffffff;
  margin: 1rem 0 2rem;
  
  font-weight: 300;
  letter-spacing: 1px;
}

.cta-button {
  padding: 1.2rem 2.5rem;
  font-size: 1.2rem;
  background: linear-gradient(45deg, #84b7c2, #84b7c2);
  color: rgb(16, 16, 16);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(180, 134, 159, 0.4);
}

.image-grid {
  position: absolute;
  top: 50%;
  right: 5%;
  transform: translateY(-50%);
  width: 35%;
  height: 70%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, 1fr);
  gap: 2rem;
  pointer-events: none;
}

.grid-item {
  background-size: cover;
  background-position: center;
  border-radius: 15px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  transform: perspective(1000px) rotateY(10deg);
  
  transition: transform 0.5s, opacity 0.5s;
  overflow: hidden;
  transform: rotate(3deg);
  position: relative;
}
.grid-item:nth-child(even) {
    transform: rotate(-3deg);
  }
.grid-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(180, 134, 159, 0.1), rgba(108, 70, 117, 0.2));
}

.conferences-container {
  max-width: 1600px;
  overflow: hidden;
  margin: 10px auto 0;
  padding: 0 20px;
}

.conferences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

/* Ajuste de posición para los botones de categoría */
.category-buttons {
  position: relative;
  top: auto;
  transform: none;
  margin: -50px auto 0;
  padding: 2rem;
}
.grid-item:hover {
  transform: perspective(1000px) rotateY(0deg) scale(1.05);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
}

@media (max-width: 768px) {
  .category-buttons {
    bottom: 20px;
    gap: 1rem;
  }
  
  .category-button {
    padding: 0.8rem 1rem;
    min-width: 80px;
  }
  
  .category-button i {
    font-size: 1.2rem;
  }
  
  .category-button span {
    font-size: 0.8rem;
  }
  .banner {
    padding-left: 5%;
    justify-content: center;
  }
  
  .title {
    font-size: 4rem;
  }
  
  .subtitle {
    font-size: 1.5rem;
  }
  
  .image-grid {
    display: none;
  }
}
</style>