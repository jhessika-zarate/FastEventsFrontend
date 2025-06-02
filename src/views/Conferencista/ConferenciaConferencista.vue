<template>
    <main>
        <div class="votacion-container">
            <div class="conferencia">
                <h2>{{ conferencia?.titulo || "Cargando..." }}</h2>
                <p><strong>Tiempo Transcurrido:</strong> {{ tiempoTranscurrido }}</p>
                
                <div v-if="votacionActiva" class="alerta-votacion">
                    🔴 ¡Votación en curso! Tiempo restante: {{ tiempoRestante }}
                    <button @click="terminarVotacion">Finalizar votación</button>
                </div>

                <div class="video"></div>
                
                <div class="boton-accion">
                    <button @click="mostrarModal" :disabled="votacionActiva || conferenciaEstado !== 'EN VIVO'">Empezar votación</button>
                    <button @click="finalizarConferencia" :disabled="conferenciaEstado !== 'EN VIVO'">Finalizar conferencia</button>
                </div>
                <div class="estado-conferencia">
                    <span :class="{
                        'en-vivo': conferenciaEstado === 'EN VIVO',
                        'finalizado': conferenciaEstado === 'FINALIZADA',
                        'no-iniciado': conferenciaEstado === 'NO INICIADO'
                    }">
                        {{ conferenciaEstado }}
                    </span>
                </div>
            </div>
        </div>
        
        <div v-if="mostrarSeleccionDuracion" class="modal">
            <div class="modal-contenido">
                <h3>Selecciona la duración de la votación</h3>
                <button @click="iniciarVotacion(1)">1 min</button>
                <button @click="iniciarVotacion(3)">3 min</button>
                <button @click="iniciarVotacion(5)">5 min</button>
                <button @click="iniciarVotacion(10)">10 min</button>
                <button @click="cerrarModal">Cancelar</button>
            </div>
        </div>
    </main>
</template>

<script>
import Swal from "sweetalert2";
import { useRoute, useRouter } from "vue-router";
import { useConferenciaStore } from "@/stores/conferenciaStore";
import { ref, onMounted } from "vue";

export default {
    setup() {
        const route = useRoute();
        const router = useRouter();
        const conferenciaStore = useConferenciaStore();
        const conferencia = ref(null);
        const conferenciaEstado = ref("Cargando...");
        const votacionActiva = ref(false);
        const tiempoTranscurrido = ref("00 : 00 : 00");
        const tiempoRestante = ref("0:00");
        const votos = ref([]);
        const mostrarSeleccionDuracion = ref(false);
        let temporizador = null;
        let intervaloTiempoTranscurrido = null;

        const fetchConferencia = async () => {
            try {
                const id = route.params.id;
                if (!id) throw new Error("ID de conferencia no encontrado");

                conferencia.value = await conferenciaStore.fetchConferenciaById(id);

                if (conferencia.value) {
                    verificarEstadoConferencia();
                }
            } catch (error) {
                console.error("Error al obtener conferencia:", error);
                Swal.fire("Error", "No se pudo cargar la conferencia.", "error");
                router.push("/conferencista/home");
            }
        };

        const verificarEstadoConferencia = () => {
            const ahora = new Date();
            const fechaConferencia = new Date(`${conferencia.value.fecha} ${conferencia.value.hora}`);

            if (conferencia.value.activo === 3) {
                conferenciaEstado.value = "FINALIZADA";
                Swal.fire("Conferencia expirada", "Esta conferencia ya ha pasado.", "error").then(() => {
                    router.push("/conferencista/home");
                });
            } else if (ahora >= fechaConferencia) {
                conferenciaEstado.value = conferencia.value.activo === 1 ? "EN VIVO" : "INACTIVA";
                iniciarConteoTiempoTranscurrido();
            } else {
                conferenciaEstado.value = "NO INICIADO";
                Swal.fire("Conferencia aún no iniciada", "Por favor, espera hasta la hora programada.", "warning").then(() => {
                    router.push("/conferencista/home");
                });
            }
        };

        const iniciarConteoTiempoTranscurrido = () => {
            if (intervaloTiempoTranscurrido) clearInterval(intervaloTiempoTranscurrido);

            intervaloTiempoTranscurrido = setInterval(() => {
                const ahora = new Date();
                const fechaInicio = new Date(`${conferencia.value.fecha} ${conferencia.value.hora}`);
                const diferencia = Math.floor((ahora - fechaInicio) / 1000);

                const horas = Math.floor(diferencia / 3600);
                const minutos = Math.floor((diferencia % 3600) / 60);
                const segundos = diferencia % 60;
                tiempoTranscurrido.value = `${String(horas).padStart(2, "0")} : ${String(minutos).padStart(2, "0")} : ${String(segundos).padStart(2, "0")}`;
            }, 1000);
        };

        const mostrarModal = () => mostrarSeleccionDuracion.value = true;
        const cerrarModal = () => mostrarSeleccionDuracion.value = false;

        const iniciarVotacion = async (duracion) => {
            votacionActiva.value = true;
            mostrarSeleccionDuracion.value = false;
            await conferenciaStore.updateVotacion(conferencia.value.idconferencia, true);
            actualizarTiempoRestante(duracion * 60);
        };

        const actualizarTiempoRestante = (segundos) => {
            tiempoRestante.value = `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`;
            temporizador = setInterval(() => {
                segundos--;
                tiempoRestante.value = `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`;
                if (segundos <= 0) terminarVotacion();
            }, 1000);
        };

        const terminarVotacion = async () => {
            votacionActiva.value = false;
            clearInterval(temporizador);
            await conferenciaStore.updateVotacion(conferencia.value.idconferencia, false);
        };

        const finalizarConferencia = async () => {
            if (!conferencia.value) return;
            Swal.fire({
                title: "¿Finalizar conferencia?",
                text: "Esta acción finalizará la conferencia de forma permanente.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, finalizar",
                cancelButtonText: "Cancelar"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await conferenciaStore.finalizarConferencia(conferencia.value.idconferencia); // Aquí estaba el error
                        conferenciaEstado.value = "FINALIZADA";
                        clearInterval(intervaloTiempoTranscurrido);
                        Swal.fire("Finalizado", "La conferencia ha sido finalizada.", "success")
                            .then(() => router.push("/conferencista/home"));
                    } catch (error) {
                        Swal.fire("Error", "No se pudo finalizar la conferencia.", "error");
                    }
                }
            });
        };

        onMounted(() => {
            fetchConferencia();
        });

        return {
            conferencia,
            conferenciaEstado,
            votacionActiva,
            tiempoTranscurrido,
            tiempoRestante,
            votos,
            mostrarSeleccionDuracion,
            finalizarConferencia,
            mostrarModal,
            cerrarModal,
            iniciarVotacion,
            terminarVotacion
        };
    }
};
</script>

<style scoped>
main {
    margin-top: 70px;
    margin-bottom: -10px;
    padding: 50px;
    background: url("/images/conf2.jpg");
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    min-height: 430px;
}

.votacion-container {
    display: flex;
    justify-content: space-between;
    padding: 20px;
}

.conferencia {
    flex: 1;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    position: relative;
}

.video {
    width: 100%;
    height: 400px;
    background: black;
    margin: 20px 0;
    border-radius: 10px;
}

.estado-conferencia {
    position: absolute;
    top: 20px;
    right: 20px;
    font-weight: bold;
}

.en-vivo {
    padding: 5px 10px;
    border-radius: 10px;
    background: red;
    color: white;
}

.finalizado {
    padding: 5px 10px;
    border-radius: 10px;
    background: #053450;
    color: white;
}

.no-iniciado {
    padding: 5px 10px;
    border-radius: 10px;
    background: gray;
    color: white;
}

.boton-accion{
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 20px 0;
}

.boton-accion button {
    padding: 12px 20px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    background: #251101;
    color: white;
}

.boton-accion button:last-child {
    background: red;
}

.boton-accion button:disabled {
    background: gray;
    cursor: not-allowed;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-contenido {
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.modal-contenido button {
    margin: 5px;
    padding: 10px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    background: #251101;
    color: white;
}

.modal-contenido button:last-child {
    margin: 5px;
    padding: 10px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    background: red;
    color: white;
    display: block;
    margin-top: 10px;
    align-self: center;
}

.alerta-votacion {
    background: #ffcccc;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    margin-top: 10px;
    color: red;
    font-weight: bold;
}

.alerta-votacion button {
    padding: 5px 10px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    background: #251101;
    color: white;
    margin-left: 20px;
}
</style>
