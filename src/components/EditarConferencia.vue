<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="banner" :style="getPreviewStyle(themes[tempConference.estilo])">
            <div class="banner-content">
                <h5>{{ tempConference.titulo }}</h5>
                <hr class="linea" />
                <span>{{ formattedDate }}</span><br>
                <span>Modo: {{ tempConference.modalidad }}</span>
            </div>

            <div v-if="themes[tempConference.estilo].type === 'wave'" class="wave-container">

                <svg class="wave" viewBox="0 0 1440 320">
                    <path :d="themes[tempConference.estilo].path" :fill="themes[tempConference.estilo].color" />
                </svg>
            </div>
        </div>
        <div class="modal-content">
            <h2 style="font-size: 2rem;">Nueva Conferencia</h2>
            <form @submit.prevent="submitForm">
                <div class="form-group">
                    <label>Título:</label>
                    <input v-model="tempConference.titulo" required>
                </div>

                <div class="form-group">
                    <label>Descripción:</label>
                    <textarea v-model="tempConference.descripcion" required></textarea>
                </div>

                <div class="form-group">
                    <label>Fecha y Hora:</label>
                    <input type="datetime-local" v-model="formattedDateTime" required>
                </div>

                <div class="form-group">
                    <label>Sala:</label>
                    <select v-model="tempConference.idsala" required>
                        <option v-for="(option, index) in Salas" :key="index" :value="option.idsala"> {{
                            option.nombre }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Link de la presentación (Canva):</label>
                    <input type="url" placeholder="https://www.canva.com/..." v-model="tempConference.presentacion">
                </div>

                <div class="form-group">
                    <label>Modalidad:</label>
                    <select v-model="tempConference.modalidad" required>
                        <option value="presencial">Presencial</option>
                        <option value="virtual">Virtual</option>
                        <option value="hibrido">Híbrido</option>
                    </select>
                </div>
                <div class="form-group" v-if="tempConference.modalidad === 'presencial'">
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
                            :class="{ selected: tempConference.estilo === index }"
                            @click="tempConference.estilo = index">
                            <div class="banner-preview" :style="getPreviewStyle(theme)">
                                <div class="text-overlay">{{ tempConference.titulo }}</div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button
                        style="background-color: rgb(163, 5, 5);color: white;padding: 1rem;font-size: 1rem;border-radius: 10%;"
                        type="button" @click="cancelChanges">Cancelar</button>
                    <button
                        style="background-color: rgb(105, 186, 96);color: white;padding: 1rem;font-size: 1rem;border-radius: 10%;"
                        type="submit">Confirmar Edicion</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { useConferenciaStore } from "@/stores/conferenciaStore";
import { useSalaStore } from '@/stores/salaStore';
import Swal from "sweetalert2";
export default {
    emits: ["refresh-conferences"],
    props: {
        conference: {
            type: Object,
            required: true
        }
    },
    setup() {
        const salaStore = useSalaStore();
        const conferenceStore = useConferenciaStore();
        return { conferenceStore, salaStore };
    },
    data() {
        return {
            Salas: [],
            form: {
                presencialOptions: [],
            },
            tempConference: { ...this.conference },
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
            ]
        }
    },
    computed: {
        formattedDate() {
            if (!this.tempConference.fecha) return 'Lunes 10 de Marzo';
            const date = new Date(this.tempConference.fecha + "T00:00:00");
            return date.toLocaleDateString('es-ES', {
                timeZone: "America/La_Paz",
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            });
        },
        formattedDateTime: {
            get() {
                if (!this.tempConference.fecha || !this.tempConference.hora) return "";

                const dateTimeString = `${this.tempConference.fecha}T${this.tempConference.hora}`;
                const date = new Date(dateTimeString);

                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");

                return `${year}-${month}-${day}T${hours}:${minutes}`;
            },
            set(value) {
                if (!value) return;

                const [datePart, timePart] = value.split("T");
                this.tempConference.fecha = datePart;
                this.tempConference.hora = timePart;
            }
        }
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
        showSuccesAlert() {
            Swal.fire({
                title: `Conferencia: ${this.conference.titulo}`,
                text: `La conferencia fue editada exitosamente!`,
                icon: 'success',
                confirmButtonText: 'Cerrar'
            });
        },
        showErrorAlert() {
            Swal.fire({
                title: `Conferencia: ${this.conference.titulo}`,
                text: `Hubo un error al querer editar la conferencia!`,
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        },
        async confirmConferenceEdit(conference) {
            if (!this.conference) {
                console.log("No se encuentran datos.");
            }
            try {
                await this.conferenceStore.updateConferencia(conference);
                this.showSuccesAlert();
            } catch (error) {
                this.showErrorAlert();
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
        cancelChanges() {
            this.localConference = { ...this.conference };
            this.$emit('close');
        },
        submitForm() {
            if (!this.formattedDateTime) {
                Swal.fire("Error", "Fecha y hora no definidas.", "error");
                return;
            }

            const canvaRegex = /^https:\/\/(www\.)?canva\.com\/.+$/;

            if (this.tempConference.presentacion && !canvaRegex.test(this.tempConference.presentacion)) {
                Swal.fire({
                    title: "Link Inválido",
                    text: "El link debe ser una URL válida de Canva (https://www.canva.com/...)",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
                return;
            }

            const [date, time] = this.formattedDateTime.split('T');

            const conferenceData = {
                ...this.tempConference,
                fecha: date,
                hora: time,
                presentacion: this.tempConference.presentacion
            };

            if (this.tempConference.modalidad === 'presencial') {
                conferenceData.modalidad = `PRESENCIAL - ${this.form.presencialOptions.join(', ')}`;
            } else {
                conferenceData.modalidad = this.tempConference.modalidad.toUpperCase();
            }

            this.confirmConferenceEdit(conferenceData)
                .then(() => {
                    this.$emit('refresh-conferences');
                    this.$emit('close');
                })
                .catch(() => {
                    Swal.fire("Error", "Hubo un error al editar la conferencia.", "error");
                });
        },
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
    box-shadow: 10px 10px 2px rgb(188, 196, 197);
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