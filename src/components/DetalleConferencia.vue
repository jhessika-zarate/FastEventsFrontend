<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <!-- Banner -->
            <div class="banner" :style="getPreviewStyle(themes[Conference.estilo])">
                <div v-if="themes[Conference.estilo].type === 'wave'" class="wave-container">
                    <svg class="wave" viewBox="0 0 1440 320">
                        <path :d="themes[Conference.estilo].path" :fill="themes[Conference.estilo].color" />
                    </svg>
                </div>
            </div>

            <!-- Contenedor de detalles -->
            <div class="detalles">
                <h2 class="title">Detalles de conferencia</h2>

                <div class="detail-item">
                    <label>Título</label>
                    <p class="detail-content">{{ Conference.titulo }}</p>
                </div>

                <div class="detail-item">
                    <label>Descripción</label>
                    <p class="detail-content">{{ Conference.descripcion }}</p>
                </div>

                <div class="detail-item">
                    <label>Fecha y Hora</label>
                    <p class="detail-content">{{ Conference.fecha }}</p>
                </div>

                <div class="detail-item">
                    <label>Modalidad</label>
                    <p class="detail-content">{{ Conference.modalidad }}</p>
                </div>
                <div class="modal-actions">
                    <button class="close-btn" type="button" @click="$emit('close')">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        Conference: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
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
            if (!this.Conference.fecha) return 'Lunes 10 de Marzo';
            const date = new Date(this.Conference.fecha + "T00:00:00");
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
/* Fondo del modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

/* Contenedor del modal */
.modal-content {
    background: linear-gradient(135deg, #6a11cb, #2575fc);
    color: white;
    border-radius: 15px;
    width: 80%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 20px 50px rgba(0, 0, 0, 0.15);
    transform: translateY(-100px);
    animation: slideIn 0.8s ease-out forwards;
}

@keyframes slideIn {
    0% {
        transform: translateY(-100px);
    }

    100% {
        transform: translateY(0);
    }
}

/* Banner ocupa todo el ancho */
.banner {
    width: 100%;
    height: 200px;
    position: relative;
    overflow: hidden;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: backgroundPulse 5s ease-in-out infinite;
}

@keyframes backgroundPulse {
    0% {
        background-color: rgba(38, 198, 218, 0.8);
    }

    50% {
        background-color: rgba(255, 87, 34, 0.8);
    }

    100% {
        background-color: rgba(38, 198, 218, 0.8);
    }
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

/* Estilo de los detalles */
.detalles {
    padding: 25px;
    flex-grow: 1;
    text-align: left;
    font-family: 'Arial', sans-serif;
    background-color: #ffffff;
    border-radius: 15px;
    margin-top: -10px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
}

h2.title {
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 25px;
    text-align: center;
    text-transform: uppercase;
    animation: bounceTitle 1s ease infinite;
}

@keyframes bounceTitle {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

/* Detalles individuales */
.detail-item {
    margin-bottom: 25px;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    animation: fadeInDetail 0.5s ease-out;
}

@keyframes fadeInDetail {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

label {
    font-size: 1.2rem;
    font-weight: bold;
    color: #34495e;
}

.detail-content {
    font-size: 1.1rem;
    color: #7f8c8d;
    margin-top: 10px;
}

/* Botón de cerrar */
.close-btn {
    background-color: #f44336;
    color: white;
    padding: 1.2rem;
    font-size: 1.2rem;
    border-radius: 10px;
    cursor: pointer;
    width: 100%;
    margin-top: 15px;
    border: none;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.close-btn:hover {
    background-color: #d32f2f;
    transform: scale(1.05);
}

.close-btn:active {
    transform: scale(0.95);
}
</style>