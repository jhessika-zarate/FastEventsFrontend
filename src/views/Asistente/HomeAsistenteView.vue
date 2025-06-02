<template>
  <div class="conferences-container">
    <main class="conferences-main">
      <div class="filters-container">
        <!-- Filtros existentes se mantienen igual -->
      </div>

      <div class="status-columns-container">
        <!-- Columna Pendientes (activo = 0) -->
        <div class="status-column">
          <h3 class="status-title pendiente">Pendientes</h3>
          <div class="conferences-grid">
            <ConferenceCard
              v-for="conference in pendingConferences"
              :key="conference.idconferencia"
              :conference="conference"
              @click="
                tarjetaConferencia(conference)
              "
            />
            <div v-if="!pendingConferences.length" class="no-results">
              <p>No hay conferencias pendientes</p>
            </div>
          </div>
        </div>

        <!-- Columna En Vivo (activo = 1) -->
        <div class="status-column">
          <h3 class="status-title en-vivo">En Vivo</h3>
          <div class="conferences-grid">
            <ConferenceCard
              v-for="conference in liveConferences"
              :key="conference.idconferencia"
              :conference="conference"
              @click="tarjetaConferencia(conference)"
            />
            <div v-if="!liveConferences.length" class="no-results">
              <p>No hay conferencias en vivo</p>
            </div>
          </div>
        </div>

        <!-- Columna Terminadas (activo = 2) -->
        <div class="status-column">
          <h3 class="status-title terminado">Terminadas</h3>
          <div class="conferences-grid">
            <ConferenceCard
              v-for="conference in finishedConferences"
              :key="conference.idconferencia"
              :conference="conference"
              @click="
                tarjetaConferencia(conference)
              "
            />
            <div v-if="!finishedConferences.length" class="no-results">
              <p>No hay conferencias terminadas</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!filteredConferences.length" class="no-results">
        <p>No se encontraron conferencias</p>
      </div>
    </main>
  </div>
  <div v-if="isModalOpen" class="modal-overlay">
    <div class="modal_base">
      <div class="subtitle">Califica la conferencia pasada</div>
      <div class="title">{{ currentConference?.titulo }}</div>
      <div class="subtitle">Tu opinión es importante para nosotros</div>
      <div class="baseCaritas">
        <div id="voteFace">
          <i
            v-for="(face, index) in faces"
            :key="index"
            :class="[
              'far',
              face.icon,
              'fa-5x',
              { fas: selectedFace === index },
            ]"
            :style="{ color: face.color }"
            @click="selectFace(index)"
          ></i>
        </div>
        <h1
          :style="{ color: color_palabra }"
          style="font-size: 24px; margin-top: 10px"
        >
          {{ palabra }}
        </h1>
      </div>

      <button class="submit" @click="handleAddTechnician">
        Calificar conferencia
      </button>
    </div>
  </div>
</template>

<script>
import ConferenceCard from "@/components/ConferenceCard.vue";
import { useUsuarioStore } from "@/stores/usuarioStore";
import { useAsistenciaStore } from "@/stores/asistenciaStore";
import { useConferenciaStore } from "@/stores/conferenciaStore";
import { useCalificacionStore } from "@/stores/calificacionStore";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2";
export default {
  components: {
    ConferenceCard,
  },
  data() {
    return {
      searchQuery: "",
      selectedSpeaker: "",
      sortBy: "fecha",
      usuarioStore: useUsuarioStore(),
      asistenciaStore: useAsistenciaStore(),
      conferenciaStore: useConferenciaStore(),
      calificacionStore: useCalificacionStore(),
      conferencesList: [], // Fuente principal de datos
      asistencias: [],
      unvotedConferences: [],
      currentConference: null,
      calificacionesList: [],
      currentConferenceIndex: 0,
       isModalOpen: false,
      selectedFace: null,
      palabra: "Selecciona una carita",
      color_palabra: "#000",
      faces: [
        { icon: "fa-laugh", color: "#37b007", value: 5, palabra: "Excelente" },
        { icon: "fa-smile", color: "#a6e300", value: 4, palabra: "Muy buena" },
        { icon: "fa-meh", color: "#e8dc00", value: 3, palabra: "Regular" },
        { icon: "fa-frown", color: "#e07f00", value: 2, palabra: "Mala" },
        { icon: "fa-dizzy", color: "#de2904", value: 1, palabra: "Pésima" },
      ],
    };
  },
  mounted() {
  this.fetchConferenciasNoCalificadas();
  },
  computed: {
    filteredConferences() {
      return this.conferencesList.filter((conference) => {
        const matchesSearch =
          conference.titulo
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          conference.descripcion
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());

        const matchesSpeaker = this.selectedSpeaker
          ? conference.idusuario === this.selectedSpeaker
          : true;

        return matchesSearch && matchesSpeaker;
      });
    },
    sortedConferences() {
      return [...this.filteredConferences].sort((a, b) => {
        if (this.sortBy === 'fecha') {
          return new Date(a.fecha) - new Date(b.fecha);
        }
        return a.titulo.localeCompare(b.titulo);
      });
    },
    pendingConferences() {
      return this.sortedConferences.filter(c => c.activo === 4);
    },
    liveConferences() {
      return this.sortedConferences.filter(c => c.activo === 1);
    },
    finishedConferences() {
      return this.sortedConferences.filter(c => c.activo === 3);
    },
  },
  async created() {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) throw new Error("Usuario no autenticado");

      const user = JSON.parse(userData);
      if (!user?.idusuario) throw new Error("ID de usuario no disponible");

      const response = await this.usuarioStore.fetchConferenciasUsuario(
        user.idusuario
      );
      this.asistencias = await this.asistenciaStore.fetchAsistencias();
     console.log("Asistencias:", this.asistencias);
     
this.calificacionesList = await this.calificacionStore.fetchCalificaciones();
      console.log("Calificaciones:", this.calificacionesList);
      if (response && response.success && Array.isArray(response.data)) {
        this.conferencesList = response.data.map(c => ({
          id: c.idconferencia,
          titulo: c.titulo,
          date: c.fecha,
          time: c.hora,
          modality: c.modalidad.toLowerCase(),
          tema: c.tema?.split(", ") || [],
          descripcion: c.descripcion,
          activo: c.activo,
          location: c.departamento,
          idusuario: c.idusuario,
        }));

        console.log("Conferencias cargadas:", this.conferencesList);
      } else {
        throw new Error("Formato de respuesta inválido");
      }
    } catch (error) {
      console.error("Error cargando conferencias:", error);
      Swal.fire("Error", error.message, "error");
    }
  },
  methods: {
    tarjetaConferencia(conference) {
      if (conference.activo === 1) {
        this.$router.push(`/asistente/conferencia/${conference.id}`);
      } else {
        this.$router.push(`/conferencia/detalle/${conference.id}`);
      }
    },
    
    async fetchConferenciasNoCalificadas() {
      console.log("fetchConferenciasNoCalificadas");
      try {
        const userData = localStorage.getItem("user");
        if (!userData) throw new Error("Usuario no autenticado");

        const user = JSON.parse(userData);
        if (!user?.idusuario) throw new Error("ID de usuario no disponible");
console.log("Usuario:", user.idusuario);
        const response = await this.conferenciaStore.fetchConferenciasNoCalificadasByUsuarioId(user.idusuario);
console.log("Conferencias no calificadas:", response);
        if (response && response.success && Array.isArray(response.data)) {
          this.unvotedConferences = response.data;
          if (this.unvotedConferences.length > 0) { 
            this.isModalOpen = true;
            this.currentConference = this.unvotedConferences[this.currentConferenceIndex];
             }
        } else {
          throw new Error("Formato de respuesta inválido");
        }
      } catch (error) {
        console.error("Error cargando conferencias no calificadas:", error);
      }
    },
    async handleAddTechnician() {
      if (this.selectedFace === null) {
        alert("Por favor selecciona una carita para calificar.");
        return;
      }

      const selectedRating = this.faces[this.selectedFace].value;
      const conference = this.currentConference;

      if (!conference) return;

      try {
        const userData = localStorage.getItem("user");
        const user = JSON.parse(userData);
        /**
         "idcalificacion": 5,
        "calificacion": 4,
        "idasistencia": 5,
        "calificado": true
         */
        const idAsistencia =this.fetchIdAsistencia(conference.idconferencia, user.idusuario);
       const idCalificaion= this.fetchCalificacionByAsistenciaId(idAsistencia);
       console.log("Id de calificación:", idCalificaion);
        console.log("Id de asistencia:", idAsistencia);
        console.log("selectedRating", selectedRating);
        const response=await this.calificacionStore.updateCalificacion({
          idcalificacion:idCalificaion,
          calificacion: selectedRating,
          idasistencia: idAsistencia,
          calificado: true,
        });
console.log("Respuesta de calificación:", response);
        if (response ) {
          Swal.fire("Calificación enviada", "Gracias por tu opinión", "success");
        } else {
          throw new Error("Error al enviar la calificación");
        }
       
        this.currentConference.titulo = this.unvotedConferences[this.currentConferenceIndex].titulo;
       
        console.log("Conferencia actual:", this.currentConference);
        console.log("Calificación enviada:", {
          conferencia: conference.titulo,
          calificacion: selectedRating,
          calificado: true,
        });
       console.log("currentConferenceIndex:", this.currentConferenceIndex);
        // Pasar a la siguiente conferencia
        this.currentConferenceIndex++;

      
       
        if (this.currentConferenceIndex >= this.unvotedConferences.length) {
          this.isModalOpen = false; // Cerrar el modal si ya no hay más conferencias
        }
      } catch (error) {
        console.error("Error al calificar la conferencia funcion hald:", error);
      }
    },
    fetchIdAsistencia(idConferencia, idUsuario) {
     /**{idasistencia: 2, idusuario: 2, idconferencia: 2} */
     const id = this.asistencias.filter(
        (a) => a.idusuario === idUsuario && a.idconferencia === idConferencia
      );
      return id[0].idasistencia;
    

    },
    fetchCalificacionByAsistenciaId(idAsistencia) {
      const calificacion = this.calificacionesList.filter(
        (c) => c.idasistencia === idAsistencia && c.calificado === false
      );
      return calificacion[0].idcalificacion;
    },
   
    selectFace(index) {
      this.selectedFace = index;
      this.palabra = this.faces[index].palabra;
      this.color_palabra = this.faces[index].color;
    }, closeOpen() {
      this.isModalOpen = false;
    },
  },
};
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
.status-columns-container {
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
}

.status-column {
  flex: 1;
  min-width: 300px;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-title {
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
}

.pendiente {
  background-color: #fff3cd;
  color: #856404;
}

.en-vivo {
  background-color: #d4edda;
  color: #155724;
}

.terminado {
  background-color: #f8d7da;
  color: #721c24;
}

@media (max-width: 1200px) {
  .status-columns-container {
    flex-wrap: wrap;
  }

  .status-column {
    flex: 1 1 45%;
  }
}

@media (max-width: 768px) {
  .status-column {
    flex: 1 1 100%;
  }

  .conferences-grid {
    grid-template-columns: 1fr;
  }
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



/**modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal_base {
  background-color: #84b7c2;
  border-radius: 20px;
  box-sizing: border-box;
  height: 380px;
  padding: 20px;
  width: 620px;
  text-align: center;
}

.modal_base2 {
  background-color: #ffffff;
  border-radius: 20px;
  box-sizing: border-box;
  height: 180px;
  padding: 20px;
  width: 620px;
  text-align: center;
}

.title {
  color: #eee;
 filter: drop-shadow(0 0 0.1rem #5555556b);
  font-family: sans-serif;
  font-size: 36px;
  font-weight: 600;
  margin-top: 10px;
}

.subtitle {
  color: #eee;
  font-family: sans-serif;
  font-size: 16px;
  font-weight: 300;
  margin-top: 10px;
}

.baseCaritas {
  background-color: rgba(255, 255, 255, 0.847);
  height: 120px;
  padding: 25px;
  margin-top: 10px;
  border-radius: 20px;
}

#voteFace {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

#voteFace i {
  cursor: pointer;
  filter: drop-shadow(0 0 0.1rem #5555556b);
}

#voteFace i:focus {
  cursor: pointer;
  filter: drop-shadow(0 0 0.7rem #ff00006b);
}

.submit {
  background-color: #b4869f;
  border-radius: 12px;
  border: 0;
  box-sizing: border-box;
  color: #eee;
  cursor: pointer;
  font-size: 18px;
  height: 50px;
  margin-top: 10px;
  outline: 0;
  text-align: center;
  width: 100%;
}

.submit:active {
  background-color: #efdad1;
  color: #28587b7a;
}

.contenedorBoton {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>
