<template>
    <div class="banner" :style="getPreviewStyle(themes[conference.estilo])">
        <div class="banner-content">
            <h5>{{ conference.titulo }}</h5>
            <hr class="linea" />
            <span>{{ formattedDate }}</span><br>
            <span>Modo: {{ conference.modalidad }}</span>
        </div>

        <div v-if="themes[conference.estilo].type === 'wave'" class="wave-container">

            <svg class="wave" viewBox="0 0 1440 320">
                <path :d="themes[conference.estilo].path" :fill="themes[conference.estilo].color" />
            </svg>
        </div>
        <div class="icon-container">
            <div class="icon-box" @click="showDetailsModal = true">
                <i class="fas fa-info"></i>
            </div>
            <div class="icon-box" @click="openConferencia">
                <i class="fas fa-play"></i>
            </div>
            <div class="icon-box" @click="showModal = true">
                <i class="fas fa-edit"></i>
            </div>
        </div>
    </div>
    <ConferenceDetails v-if="showDetailsModal" @close="showDetailsModal = false" :Conference="conference" />
    <EditConference v-if="showModal" @close="showModal = false" :conference="conference"
        @refresh-conferences="$emit('refresh-conferences')" />
</template>

<script>
import Swal from "sweetalert2";
import EditConference from "./EditarConferencia.vue";
import { useRouter } from "vue-router";
import ConferenceDetails from "./DetalleConferencia.vue";
import { useConferenciaStore } from "@/stores/conferenciaStore";
export default {
    components: { EditConference, ConferenceDetails },
    props: {
        conference: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showModal: false,
            showDetailsModal: false,
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
            if (!this.conference.fecha) return 'Lunes 10 de Marzo';
            const date = new Date(this.conference.fecha + "T00:00:00");
            return date.toLocaleDateString('es-ES', {
                timeZone: "America/La_Paz",
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            });
        }
    },
    methods: {
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
        showAlert() {
            Swal.fire({
                title: `Conferencia: ${this.conference.titulo}`,
                text: `Estás viendo la conferencia sobre ${this.conference.tema}. ¡Disfrútala!`,
                icon: 'info', // Tipo de ícono (info, success, error, warning, question)
                confirmButtonText: 'Cerrar'
            });
        },
        openConferencia() {
            if (!this.conference.idconferencia) {
                console.error("Error: La conferencia no tiene un ID válido", this.conference);
                return;
            }
            console.log(`Navegando a conferencia con ID: ${this.conference.idconferencia}`);
            this.$router.push({ name: "conferenciaConferencista", params: { id: this.conference.idconferencia } });
        }
    },
    setup(props) {
        const router = useRouter();
        const conferenciaStore = useConferenciaStore();

        const openConferencia = async () => {
            if (!props.conference.idconferencia) {
                console.error("ID de conferencia no encontrado");
                return;
            }

            const fechaConferencia = new Date(`${props.conference.fecha}T${props.conference.hora}`);
            const ahora = new Date();

            if (ahora >= fechaConferencia) {
                if (props.conference.activo === 4) {
                    try {
                        await conferenciaStore.updateConferenciaEstado(props.conference.idconferencia, 1);
                        props.conference.activo = 1;
                    } catch (error) {
                        Swal.fire("Error", "No se pudo activar la conferencia.", "error");
                        return;
                    }
                }

                router.push({ 
                    name: "conferenciaConferencista", 
                    params: { id: props.conference.idconferencia.toString() } 
                });
            } else {
                Swal.fire(
                    "Aún no es hora",
                    `La conferencia comienza el ${fechaConferencia.toLocaleString()}`,
                    "warning"
                );
            }
        };

        return { openConferencia };
    },
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
.banner {
    width: 90%;
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

.wave-container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200%;
    height: 100%;
    overflow: hidden;
    z-index: 1;
}

@keyframes waveAnim {
    0% {
        transform: translateX(0%);
    }

    100% {
        transform: translateX(-50%);
    }
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


.icon-container {
    position: absolute;
    bottom: 20px;
    right: 20px;
    display: flex;
    gap: 10px;
    z-index: 3;
}

.icon-box {
    width: 40px;
    height: 40px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: white;
    transition: background-color 0.3s ease;
}

.icon-box:hover {
    background-color: rgba(0, 0, 0, 0.7);
    cursor: pointer;
}

.icon-box i {
    font-size: 20px;
}
</style>