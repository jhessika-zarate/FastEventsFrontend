<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="banner" :style="getPreviewStyle(themes[form.theme])">
      <div class="banner-content">
        <h5>{{ form.title || 'Título de la conferencia' }}</h5>
        <hr class="linea" />
        <span>{{ formattedDate }}</span><br>
        <span>Modo: {{ form.modality }}</span>
      </div>

      <div v-if="themes[form.theme].type === 'wave'" class="wave-container">

        <svg class="wave" viewBox="0 0 1440 320">
          <path :d="themes[form.theme].path" :fill="themes[form.theme].color" />
        </svg>
      </div>
    </div>
    <div class="modal-content">
      <h2 style="font-size: 2rem;">Nueva Conferencia</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="form.wantsToUploadPresentation" />
            ¿Desea subir su presentación de Canva previamente a la conferencia?
          </label>
        </div>
        <div class="form-group">
          <label>Título:</label>
          <input v-model="form.title" required>
        </div>

        <div class="form-group">
          <label>Descripción:</label>
          <textarea v-model="form.description" required></textarea>
        </div>
        
        <div class="form-group">
          <label>Fecha y Hora:</label>
          <input type="datetime-local" v-model="form.datetime" required>
        </div>

        <div class="form-group">
          <label>Sala:</label>
          <select v-model="form.roomId" required>
            <option v-for="(option, index) in Salas" :key="index" :value="index"> {{ option.nombre }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>Modalidad:</label>
          <select v-model="form.modality" required>
            <option value="virtual">Virtual</option>
            <option value="presencial">Presencial</option>

            <option value="hibrido">Híbrido</option>
          </select>
        </div>
        <div class="form-group" v-if="form.modality === 'presencial'">
          <label>Preparación de Sala:</label>
          <div class="options-container">
            <label v-for="(option, index) in presencialOptionsList" :key="index">
              <input type="checkbox" v-model="form.presencialOptions" :value="option">
              {{ option }}
            </label>
          </div>
        </div>
        <div class="form-group">
          <label>Estilo del Banner:</label>
          <div class="theme-selector">
            <div v-for="(theme, index) in themes" :key="index" class="theme-option"
              :class="{ selected: form.theme === index }" @click="form.theme = index">
              <div class="banner-preview" :style="getPreviewStyle(theme)">
                <div class="text-overlay">Título de Ejemplo</div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group" v-if="form.wantsToUploadPresentation">
          <label>Link Presentación:</label>
          <p>Ingrese Link de su presentación en CANVA</p>
          <input v-model="form.presentacion" :required="form.wantsToUploadPresentation">
        </div>
       
        <div class="modal-actions">
          <button
            style="background-color: rgb(163, 5, 5);color: white;padding: 1rem;font-size: 1rem;border-radius: 10%;"
            type="button" @click="$emit('close')">Cancelar</button>
          <button
            style="background-color: rgb(105, 186, 96);color: white;padding: 1rem;font-size: 1rem;border-radius: 10%;"
            type="submit">Crear Conferencia</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useConferenciaStore } from '@/stores/conferenciaStore';
import { useSalaStore } from '@/stores/salaStore';
import Swal from "sweetalert2/dist/sweetalert2.js"
export default {
  setup() {
    const salaStore = useSalaStore();
    return { salaStore };
  },
  data() {
    return {
      Salas: [],
      presencialOptionsList: [
        // Conectividad
        'Conexión por cable Ethernet',
        'Micrófonos inalámbricos',
        'Pantallas táctiles interactivas',
        // Software y plataformas
        'Software de colaboración en tiempo real (Miro/Mural)',
        'Control centralizado (Crestron/Extron)',
        // Configuraciones especiales
        'Ambiente inmersivo (LED walls/proyección 360°)',
        'Sistema de traducción simultánea',
        'Control de iluminación DMX',
        // Accesibilidad
        'Intérprete de señas en vivo',
        // Energía y respaldos
        'Estación de carga universal',
        // Opción abierta
        'Otro recurso personalizado (especificar en notas)'
      ],
      form: {
        wantsToUploadPresentation: false,
        presencialOptions: [],
        title: '',
        description: '',
        datetime: '',
        roomId: '',
        modality: 'virtual',
        presentacion:'',
        theme: 0
      },
      themes: [
        {
          type: 'wave',
          color: '#8099ad',
          path: "M0,160L80,181.3C160,203,320,245,480,234.7C640,224,800,160,960,160C1120,160,1280,224,1360,256L1440,288L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z",
          animation: 'waveAnim 5s linear infinite'
        },
        {
          type: 'gradient',
          colors: ['#97BC62 ', '#FE90AF'],
          angle: 45,
          animation: 'gradientFlow 8s ease infinite'
        },

        {
          type: 'stripes',
          colors: ['#F0AB1E', '#F6DAA9'],
          angle: 45,
          size: '80px',
          animation: 'movingStripes 2s linear infinite'
        },
        {
          type: 'dots',
          color: '#563d69',
          background: '#2c3e50',
          size: '19px',
          spacing: '30px',  // Aumentar spacing para mejor efecto
          animation: 'floatingDots 10s linear infinite'  // Reducir velocidad
        }
      ],
      conferenciaStore: null,
    }
  },
  created() {
    this.conferenciaStore = useConferenciaStore();
  },
  computed: {
    formattedDate() {
      if (!this.form.datetime) return 'Lunes 10 de Marzo';
      const date = new Date(this.form.datetime);
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    },

  },
  async mounted() {
    this.fetchSalas().then(() => {
      console.log("Salas cargadas", this.Salas);
    });
  },
  methods: {
    async fetchSalas() {
      try {
        const response = await this.salaStore.fetchSalas();
        this.Salas = response;
      } catch (error) {
        console.log("Error al obtener las salas: ", error);
      }
    },

    getPreviewStyle(theme) {
      const styles = {
        animation: theme.animation,
        WebkitAnimation: theme.animation,
        backgroundRepeat: theme.type === 'dots' || theme.type === 'stripes' ? 'repeat' : 'no-repeat'
      };

      switch (theme.type) {
        case 'wave':
          styles.background = theme.color;
          styles.overflow = 'hidden';
          break;

        case 'gradient':
          styles.background = `linear-gradient(${theme.angle}deg, ${theme.colors.join(', ')})`;
          styles.backgroundSize = '400% 400%';
          break;



        case 'stripes':
          styles.backgroundImage = `repeating-linear-gradient(
        ${theme.angle}deg,
        ${theme.colors[0]},
        ${theme.colors[0]} ${theme.size},
        ${theme.colors[1]} ${theme.size},
        ${theme.colors[1]} calc(${theme.size} * 2)
      )`;
          styles.backgroundSize = '80px 80px';
          break;

        case 'dots':
          styles.backgroundImage = `radial-gradient(
        circle at center,
        ${theme.color} ${theme.size},
        transparent calc(${theme.size} + 1px)
      )`;
      styles.backgroundSize = `${theme.spacing} ${theme.spacing}`;
      break;
  }
  
  return styles;
},


    async submitForm() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const baseData = {
          titulo: this.form.title,
          descripcion: this.form.description,
          fecha: this.form.datetime.split('T')[0],
          hora: this.form.datetime.split('T')[1].substring(0, 5),
          idsala: this.form.roomId + 1,
          tema: 'Tecnología',
          estilo: this.form.theme,
          presentacion: this.form.wantsToUploadPresentation ? this.form.presentacion : '',
          departamento: 1,
          activo: 2,
          votacion: false,
          idusuario: user.idusuario
        };

        if (this.form.modality === 'presencial') {
          baseData.modalidad = `PRESENCIAL - ${this.form.presencialOptions.join(', ')}`;
        } else {
          baseData.modalidad = this.form.modality.toUpperCase();
        }

        const nuevaConferencia = await this.conferenciaStore.createConferencia(baseData);

        this.$emit('submit', nuevaConferencia);
        this.$emit('close');

        // Opcional: Mostrar feedback al usuario
        Swal.fire({
          icon: 'success',
          title: '¡Conferencia creada!',
          text: 'La conferencia se ha registrado correctamente'
        });

      } catch (error) {
        // Manejar errores
        console.error("Error en submitForm:", error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear la conferencia: ' + (error.response?.data?.message || error.message)
        });
      }
    }
  }
}
</script>
<style>
@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@keyframes shapeMorph {
  0% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }

  50% {
    clip-path: polygon(20% 0, 80% 0, 90% 90%, 10% 90%);
  }

  100% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
}

@keyframes movingStripes {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 80px 0;
  }
}

@keyframes floatingDots {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 50px 50px;
  }
}



@-webkit-keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@-webkit-keyframes shapeMorph {
  0% {
    -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }

  50% {
    -webkit-clip-path: polygon(20% 0, 80% 0, 90% 90%, 10% 90%);
  }

  100% {
    -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
}

@-webkit-keyframes movingStripes {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 80px 0;
  }
}

@-webkit-keyframes floatingDots {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 50px 50px;
  }
}
</style>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  z-index: 10000;
  align-items: center;
}

.modal-content label {
  font-size: 1.2rem;
  text-align: left;
}

.banner {
  width: 50%;
  height: 20rem;
  color: white;
  padding: 1rem;
  margin: 1rem auto;

  border-radius: 1rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 10px 10px 2px rgba(76, 77, 76, 0.37);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  background-size: cover;
  animation: inherit;
  -webkit-animation: inherit;
}

.banner-content {
  position: relative;
  z-index: 2;
}

.wave {
  animation: waveAnim 9s linear infinite;
  -webkit-animation: waveAnim 9s linear infinite;
}

.banner h5 {
  font-size: 3rem;
  /* Tamaño grande para el título */
  margin: 0;
  font-weight: bold;
}

.banner span {
  font-size: 2rem;
  /* Tamaño más pequeño para la fecha */
  text-transform: none;
  /* Evita que se convierta en mayúsculas */
}

.linea {
  border: 1px solid #ffffff;
  width: 50%;
  margin: 1rem auto;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.options-container label {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: normal;
  cursor: pointer;
}

input[type="checkbox"] {
  width: auto;
  margin: 0;
  transform: scale(1.2);
}

.modal-content {
  background: white;
  padding: 2rem;
  color: black;
  border-radius: 8px;
  margin: 5rem;
  text-align: left;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.theme-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.theme-option {
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.wave-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.theme-option.selected {
  border-color: #2196F3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.banner-preview {
  position: relative;
  height: 100px;
  overflow: hidden;
  border-radius: 8px;
  transition: transform 0.2s;
  background-size: 200% 200%;

}

.theme-option:hover .banner-preview {
  transform: scale(1.05);
}

@keyframes waveAnim {
  0% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(-50%);
  }
}

/* Asegurar que el gradiente se anime */
.banner[style*="gradient"] {
  background-size: 400% 400%;
}

.banner[data-theme="gradient"] {
  background-size: 400% 400%;
  animation: gradientFlow 8s ease infinite !important;
}


.banner[data-theme="geometric"] {
  -webkit-clip-path: polygon(0 0, 100% 0, 90% 90%, 10% 90%);
  animation: shapeMorph 6s ease-in-out infinite;
}

.banner[data-theme="stripes"] {
  animation: movingStripes 2s linear infinite;
}

.banner[data-theme="dots"] {
  animation: floatingDots 20s linear infinite;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 1;
  background-color: #1c588a;
}

.wave-back {
  opacity: 0.6;
  animation-duration: 16s !important;
  bottom: 5px;
  z-index: 1;
  background-color: #43588c;
}

.wave {
  animation: waveAnim 12s linear infinite;
  -webkit-animation: waveAnim 12s linear infinite;
  /* Prefijo para Safari */
}

/* Ajustes para las animaciones específicas */
.theme-option[style*="gradientAnim"] .banner-preview {
  background-size: 200% 200%;
}

.theme-option[style*="stripesAnim"] .banner-preview,
.theme-option[style*="dotsAnim"] .banner-preview {
  background-size: 40px 40px;
}

.text-overlay {
  position: absolute;
  z-index: 2;

}

.text-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #333;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.form-group {
  margin-bottom: 1rem;
}




.theme-option:hover .banner-preview {
  transform: scale(1.05);
}


input,
textarea,
select {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
}

.modal-actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>