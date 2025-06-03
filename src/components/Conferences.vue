<template>
  <div class="conferences-container">
    <!-- Filtros laterales -->
    <aside class="filters-sidebar">
      <div class="sidebar-header"></div>


      <!-- Filtro de temas -->
      <div class="filter-group">
        <h3>Temas</h3>
        <div class="tags-filter">
          <button 
            v-for="tema in categoriaStore.categorias" 
            :key="tema.id" 
            class="tag" 
            :class="{ active: filters.temas.includes(tema.nombre) }"
            @click="toggleTema(tema.nombre)"
          >
            {{ tema.nombre }}
          </button>
        </div>
      </div>

      <!-- Filtro de modalidad -->
      

      <!-- Filtro de fecha -->
      <div class="filter-group">
        <h3>Fecha</h3>
        <div class="calendar">
          <div class="calendar-header">
            <button @click="previousMonth">&lt;</button>
            <span>{{ currentMonthName }} {{ currentYear }}</span>
            <button @click="nextMonth">&gt;</button>
          </div>
          <div class="calendar-grid">
            <div v-for="day in daysOfWeek" :key="day" class="calendar-weekday">{{ day }}</div>
            <div 
              v-for="date in calendarDates" 
              :key="date.fecha" 
              class="calendar-date"
              :class="{
                'other-month': !date.isCurrentMonth,
                'selected': date.fecha === filters.fecha
              }" 
              @click="selectDate(date.fecha)"
            >
              {{ date.dia }}
            </div>
          </div>
        </div>
      </div>

      <button @click="clearFilters" class="clear-filters">Limpiar todo</button>
    </aside>

    <!-- Listado de conferencias -->
    <main class="conferences-main">
      <div class="results-info">
        <span>{{ filteredConferences.length }} resultados encontrados</span>
        <div class="sorting">
          <select v-model="sortBy">
            <option value="fecha">Ordenar por fecha</option>
            <option value="titulo">Ordenar por nombre</option>
          </select>
        </div>
      </div>

      <div class="conferences-grid">
  <ConferenceCard 
    v-for="conference in sortedConferences" 
    :key="conference.idconferencia" 
    :conference="conference"
  />
</div>

      <div v-if="filteredConferences.length === 0" class="no-results">
        <p>No encontramos conferencias con estos filtros</p>
      </div>
    </main>
  </div>
</template>
<script>
import { ref, computed, onMounted } from 'vue'
import { useCategoriaStore } from '@/stores/categoriaStore'
import { useConferenciaStore } from '@/stores/conferenciaStore'
import ConferenceCard from './ConferenceCard.vue'

export default {
  props: {
    conferences: {
      type: Array,
      required: true
    }
  },
  components: {
    ConferenceCard
  },
  setup(props) {
    // Importa los stores
    const categoriaStore = useCategoriaStore()

    // Variables locales de estado
    const loading = ref(false)
    const error = ref(null)
    
    const filters = ref({
      temas: [],
      modalidad: '',
      fecha: ''
    })
  
    const sortBy = ref('fecha')
    const currentMonth = ref(new Date().getMonth())
    const currentYear = ref(new Date().getFullYear())
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    const modalities = ['Presencial', 'Virtual']

    // Al montar el componente, obtenemos las categorías del store
    onMounted(async () => {
      await categoriaStore.obtenerCategorias()
      loading.value = true
    })

    const currentMonthName = computed(() => {
      return new Date(currentYear.value, currentMonth.value)
        .toLocaleString('es', { month: 'long' })
        .replace(/^\w/, c => c.toUpperCase())
    })

    const createCalendarDate = (fecha, isCurrentMonth) => ({
      fecha: fecha.toISOString().split('T')[0],
      dia: fecha.getDate(),
      isCurrentMonth
    })

    const calendarDates = computed(() => {
      const dates = []
      const firstDay = new Date(currentYear.value, currentMonth.value, 1)
      const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)

      // Días del mes anterior
      for (let i = firstDay.getDay() - 1; i >= 0; i--) {
        const fecha = new Date(firstDay)
        fecha.setDate(fecha.getDate() - (i + 1))
        dates.push(createCalendarDate(fecha, false))
      }

      // Días del mes actual
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const fecha = new Date(currentYear.value, currentMonth.value, i)
        dates.push(createCalendarDate(fecha, true))
      }

      return dates
    })

    // Computed que filtra las conferencias según los filtros
    const filteredConferences = computed(() => {
      return props.conferences.filter(conf => {
        const matchTemas =
          filters.value.temas.length === 0 ||
          (conf.temas && conf.temas.some(t => filters.value.temas.includes(t.nombre)))

        const matchFecha = !filters.value.fecha || conf.fecha === filters.value.fecha

        return matchTemas &&
          (!filters.value.modalidad || conf.modalidad === filters.value.modalidad) &&
          matchFecha
      })
    })

    // Computed que ordena las conferencias filtradas
    const sortedConferences = computed(() => {
      return [...filteredConferences.value].sort((a, b) => {
        if (sortBy.value === 'fecha') {
          return new Date(a.fecha) - new Date(b.fecha)
        }
        return a.titulo.localeCompare(b.titulo)
      })
    })

    // Métodos auxiliares
    const toggleTema = (tema) => {
      const index = filters.value.temas.indexOf(tema)
      if (index === -1) {
        filters.value.temas.push(tema)
      } else {
        filters.value.temas.splice(index, 1)
      }
    }

    const selectDate = (fecha) => {
      filters.value.fecha = fecha
    }

    const clearFilters = () => {
      filters.value = {
        temas: [],
        modalidad: '',
        fecha: ''
      }
    }

    const previousMonth = () => {
      if (currentMonth.value === 0) {
        currentMonth.value = 11
        currentYear.value--
      } else {
        currentMonth.value--
      }
    }

    const nextMonth = () => {
      if (currentMonth.value === 11) {
        currentMonth.value = 0
        currentYear.value++
      } else {
        currentMonth.value++
      }
    }

    return {
      categoriaStore,
      loading,
      error,
      filters,
      sortBy,
      currentMonth,
      currentYear,
      daysOfWeek,
      modalities,
      currentMonthName,
      calendarDates,
      filteredConferences,
      sortedConferences,
      toggleTema,
      selectDate,
      clearFilters,
      previousMonth,
      nextMonth
    }
  
}}
</script>


<style scoped>
@import '@vueform/slider/themes/default.css';

.calendar {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
}

.calendar-header button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 0.5rem;
  font-size: 1.2rem;
  color: #1a237e;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.calendar-weekday {
  text-align: center;
  font-size: 0.6rem;
  color: #666;
  padding: 0.5rem 0;
}

.calendar-date {
  text-align: center;
  padding: 0.2rem;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.2s;
}

.calendar-date:hover {
  background: #e8eaf6;
}

.calendar-date.selected {
  background: #b4869f;
  color: white;
}

.calendar-date.other-month {
  color: #999;
  background: #f5f5f5;
}

.time-slider {
  position: relative;
  margin: 2rem 0;
}

.track {
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  position: relative;
  cursor: pointer;
}

.highlight {
  position: absolute;
  height: 100%;
  background: #7b4828;
  border-radius: 2px;
}

.thumb {
  width: 16px;
  height: 16px;
  background: #28587b;
  border-radius: 50%;
  position: absolute;
  top: -6px;
  transform: translateX(-50%);
  cursor: grab;
}

.thumb:active {
  cursor: grabbing;
}

.time-labels {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.selected-time {
  text-align: center;
  margin-top: 0.5rem;
  font-weight: 500;
  color: #1a237e;
}

.conferences-container {
  background-color: rgba(255, 255, 255, 0.866);
  display: flex;
  gap: 0.5rem;
  padding: 2rem;
  margin: 0 auto;
  border-radius: 12px;
  max-width: 1400px;
  margin-bottom: none;
  margin-top: 6rem;

}

.filters-sidebar {
  flex: 0 0 300px;
  background: #4a559ece;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 7rem;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.sidebar-header h2 {
  font-size: 16px;
  color: #000005;
}

.clear-filters {
  background: #ffffff47;
  border-radius: 5px;
  border: none;
  color: #0a0404;
  font-weight: 500;
  cursor: pointer;
  font-size: 16px;
}

.clear-filters:hover {
  color: #00020e;
  background: #ffffffad;
}

.filter-group {
  margin-bottom: 0.5rem;
}

.filter-group h3 {
  font-size: 1rem;
  color: #00020e;
  margin-bottom: 0.5rem;
}

.tags-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #e8eaf6;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag.active {
  background: #b15e6c;
  color: white;
}

.modality-filter {
  display: flex;
  gap: 0.5rem;
}

.mode-btn {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.mode-btn.active {
  border-color: #0e212f;
  background: #28587b;
  color: white;
}

.date-range {
  display: grid;
  gap: 0.5rem;
}

.time-slider {
  padding: 0 1rem;
}

.conferences-main {
  flex: 1;
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
}

.no-results img {
  max-width: 300px;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .conferences-container {
    flex-direction: column;
  }

  .filters-sidebar {
    position: static;
    width: 100%;
  }
}
</style>