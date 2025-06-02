<template>
  <div class="conferences-container">
    <main class="conferences-main">
      <div class="filters-container">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar por título o descripción..."
          class="search-input"
        >
        
        <select v-model="selectedSpeaker" class="speaker-filter">
          <option value="">Todos los conferencistas</option>
          <option 
            v-for="speaker in speakers" 
            :key="speaker.idusuario" 
            :value="speaker.idusuario"
          >
            {{ speaker.nombre }} {{ speaker.apellido }}
          </option>
        </select>
      </div>
      

      <div class="conferences-grid">
        <ConferenceCard 
          v-for="conference in sortedConferences" 
          :key="conference.idconferencia" 
          :conference="conference" 
          @click="tarjetaConferencia(conference.id)"
        />
      </div>

      <div v-if="!conferencesList?.length" class="no-results">
        <p>No hay conferencias registradas</p>
      </div>
    </main>
  </div>
</template>

<script>
import ConferenceCard from '@/components/ConferenceCard.vue'
import { useConferenciaStore } from '@/stores/conferenciaStore'

export default {
  components: {
    ConferenceCard
  },
  data() {
    return {
      searchQuery: '',
      selectedSpeaker: '',
      sortBy: 'fecha', // Cambiado a 'fecha' para coincidir con el campo real
      conferenciaStore: useConferenciaStore(),
      conferencesList: []

    }
  },
  computed: {

    filteredConferences() {
      return this.conferencesList.filter(conference => {
        const matchesSearch = conference.titulo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                             conference.descripcion.toLowerCase().includes(this.searchQuery.toLowerCase())
        
        const matchesSpeaker = this.selectedSpeaker ? 
          conference.idusuario === this.selectedSpeaker : 
          true

        return matchesSearch && matchesSpeaker
      })
    },
    sortedConferences() {
      return [...this.filteredConferences].sort((a, b) => {
        if (this.sortBy === 'fecha') {
          return new Date(a.fecha) - new Date(b.fecha) // Usar campo 'fecha' real
        }
        return a.titulo.localeCompare(b.titulo) // Usar campo 'titulo' real
      })
    }
  },
  async created() {
    try {
      await this.conferenciaStore.fetchConferencias();
      
      // Acceder directamente a las conferencias del store
      const rawConferences = this.conferenciaStore.conferencias;
      
      // Verificar si es un array directamente
      if (!Array.isArray(rawConferences)) {
        throw new Error("Formato de respuesta inválido: Se esperaba un array");
      }

      // Mapear los datos
      this.conferencesList = rawConferences.map(c => ({
        idconferencia: c.idconferencia,
        titulo: c.titulo,
        date: c.fecha,
        time: c.hora,
        modality: c.modalidad?.toLowerCase() || '',
        modalidad: c.modalidad || '',
        tema: typeof c.tema === 'string' ? c.tema.split(', ') : [],
        descripcion: c.descripcion,
        activo: c.activo,
        location: c.departamento,
        idusuario: c.idusuario
      }));

      console.log('Conferencias procesadas:', this.conferencesList);
      
    } catch (error) {
      console.error("Error cargando conferencias:", error);
      //Swal.fire('Error', error.message, 'error');
    }
  },
  methods: {
    tarjetaConferencia(id) {
      this.$router.push(`/conferencias/${id}`);
    }
  }
}
</script>

<style scoped>
.conferences-container {
  background-color: rgba(255, 255, 255, 0.525);
  padding: 2rem;
  margin: 0 auto;
  border-radius: 12px;
  max-width: 1400px;
  margin-top: 6rem;
}

.conferences-main {
  width: 100%;
}

.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.sorting select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.conferences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.no-results {
  text-align: center;
  padding: 4rem 0;
  font-size: 1.2rem;
  color: #666;
}
.filters-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.speaker-filter {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  min-width: 250px;
}
.sorting select {
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid #ddd;
  }
/* Mantener los estilos existentes y agregar: */
@media (max-width: 768px) {
  .filters-container {
    flex-direction: column;
  }
  
  .speaker-filter {
    width: 100%;
  }
}
@media (max-width: 768px) {
  .conferences-container {
    padding: 1rem;
    margin-top: 5rem;
  }
  
  .conferences-grid {
    grid-template-columns: 1fr;
  }
}
</style>