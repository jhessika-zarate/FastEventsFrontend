<template>
    <main>
        <div class="votacion-container">
            <div class="conferencia">
                <h2>{{ conferencia.titulo }}</h2>
                <p><strong>Conferencista:</strong> {{ conferencista }}</p>
                <p><strong>Tiempo Transcurrido:</strong> {{ tiempoTranscurrido }}</p>

                <div class="video"></div>

                <div class="estado-conferencia">
                    <span :class="{ 'en-vivo': iniciado, 'no-iniciado': !iniciado }">
                        {{ iniciado ? "EN VIVO" : "NO INICIADO" }}
                    </span>
                </div>
            </div>
        </div>

        <div v-if="puedeVotar && !votoRealizado" class="modal">
            <div class="modal-contenido">
                <h3>Realiza tu votación</h3>
                <button @click="votar(true)">👍 Votar a Favor</button>
                <button @click="votar(false)">👎 Votar en Contra</button>
            </div>
        </div>

        <div v-if="isModalOpen" class="modal-overlay">
          <div class="modal_base">
            <div class="title">Califica la conferencia</div>
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
    </main>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useConferenciaStore } from "@/stores/conferenciaStore";
import { useVotoStore } from "@/stores/votoStore";
import { useAsistenciaStore } from "@/stores/asistenciaStore";
import { useUsuarioStore } from "@/stores/usuarioStore";
import { useCalificacionStore } from "@/stores/calificacionStore";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const conferenciaStore = useConferenciaStore();
    const votoStore = useVotoStore();
    const asistenciaStore = useAsistenciaStore();
    const usuarioStore = useUsuarioStore();
    const calificacionStore = useCalificacionStore();

    const conferencia = ref({});
    const votos = ref([]);
    const tiempoTranscurrido = ref("00 : 00 : 00");
    const conferencista = ref("Cargando...");
    const iniciado = ref(false);
    const puedeVotar = ref(false);
    const calificacionRealizada = ref(false);
    const isModalOpen = ref(false);
    const selectedFace = ref(null);
    const palabra = ref("");
    const color_palabra = ref("");
    
    const faces = [
      { icon: "fa-laugh", color: "#37b007", value: 5, palabra: "Excelente" },
      { icon: "fa-smile", color: "#a6e300", value: 4, palabra: "Muy buena" },
      { icon: "fa-meh", color: "#e8dc00", value: 3, palabra: "Regular" },
      { icon: "fa-frown", color: "#e07f00", value: 2, palabra: "Mala" },
      { icon: "fa-dizzy", color: "#de2904", value: 1, palabra: "Pésima" },
    ];

    const ultimaVotacion = ref(false);
    const yaVoteEstaVotacion = ref(false);

    const user = JSON.parse(localStorage.getItem("user"));
    let intervaloTiempo = null;
    let intervaloVotos = null;

    const fetchConferencia = async () => {
        try {
            const id = route.params.id;
            if (!id) throw new Error("ID no encontrado");

            conferencia.value = await conferenciaStore.fetchConferenciaById(id);

            const usuario = await usuarioStore.fetchUsuarios();
            const conferencistaActual = usuario.find(
            (u) => u.idusuario === conferencia.value.idusuario
            );

            conferencista.value = conferencistaActual
            ? `${conferencistaActual.nombre} ${conferencistaActual.apellido}`
            : "No disponible";

            calcularTiempoTranscurrido();
            intervaloTiempo = setInterval(calcularTiempoTranscurrido, 1000);
            await cargarVotos();
        } catch (error) {
            console.error("Error al obtener conferencia:", error);
            Swal.fire("Error", "No se pudo cargar la conferencia.", "error");
            router.push("/asistente/home");
        }
    };

    const cargarVotos = async () => {
      const conferenciaActualizada = await conferenciaStore.fetchConferenciaById(conferencia.value.idconferencia);
      if (!ultimaVotacion.value && conferenciaActualizada.votacion) {
        yaVoteEstaVotacion.value = false;
      }

      if (ultimaVotacion.value && !conferenciaActualizada.votacion) {
        yaVoteEstaVotacion.value = false;
      }

      ultimaVotacion.value = conferenciaActualizada.votacion;
      conferencia.value = conferenciaActualizada;
      puedeVotar.value = conferenciaActualizada.votacion;

      const votosObtenidos = await votoStore.fetchVotos();
      votos.value = votosObtenidos.filter(
        (v) => v.idconferencia === conferencia.value.idconferencia
      );

      const asistencias = await asistenciaStore.fetchAsistenciaPorUsuario(user.idusuario);
      const asistenciaUsuario = asistencias.find(
        (a) => a.idconferencia === conferencia.value.idconferencia
      );

      if (asistenciaUsuario) {
        const usuarioVoto = votos.value.some(
          (v) => v.idasistencia === asistenciaUsuario.idasistencia
        );

        if (usuarioVoto) {
          yaVoteEstaVotacion.value = true;
        }
      }
    };

    const calcularTiempoTranscurrido = () => {
      const ahora = new Date();
      const inicio = new Date(`${conferencia.value.fecha} ${conferencia.value.hora}`);
      const diferencia = Math.floor((ahora - inicio) / 1000);

      if (diferencia < 0) {
        tiempoTranscurrido.value = "Aún no ha iniciado";
        iniciado.value = false;
        return;
      }

      const horas = Math.floor(diferencia / 3600);
      const minutos = Math.floor((diferencia % 3600) / 60);
      const segundos = diferencia % 60;

      tiempoTranscurrido.value = `${String(horas).padStart(2, "0")} : ${String(minutos).padStart(2, "0")} : ${String(segundos).padStart(2, "0")}`;

      iniciado.value = conferencia.value.activo === 1;

      if (conferencia.value.activo === 3) {
        clearInterval(intervaloTiempo);
        clearInterval(intervaloVotos);
        isModalOpen.value = true;

        const esperarCalificacion = setInterval(() => {
          if (calificacionRealizada.value) {
            clearInterval(esperarCalificacion);
            Swal.fire({
              title: "Conferencia Finalizada",
              text: "La conferencia ha concluido.",
              icon: "info",
            }).then(() => router.push("/asistente/home"));
          }
        }, 1000);
      }
    };
    
    const selectFace = (index) => {
      selectedFace.value = index;
      palabra.value = faces[index].palabra;
      color_palabra.value = faces[index].color;
    };

    const handleAddTechnician = async () => {
      if (selectedFace.value === null) {
        Swal.fire("Error", "Por favor selecciona una carita para calificar.", "warning");
        return;
      }

      const calificacionValor = faces[selectedFace.value].value;

      try {
        const asistencias = await asistenciaStore.fetchAsistenciaPorUsuario(user.idusuario);
        const asistenciaActual = asistencias.find(
          (a) => a.idconferencia === conferencia.value.idconferencia
        );

        if (!asistenciaActual) {
          Swal.fire("Error", "No tienes asistencia registrada para calificar.", "warning");
          return;
        }

        await calificacionStore.createCalificacion({
          idasistencia: asistenciaActual.idasistencia,
          calificacion: calificacionValor,
          calificado: true,
        });

        calificacionRealizada.value = true;
        isModalOpen.value = false;
      } catch (error) {
        Swal.fire("Error", "Hubo un problema al registrar la calificación.", "error");
        console.error("Error al registrar calificación:", error);
      }
    };

    const votar = async (aFavor) => {
      const asistencias = await asistenciaStore.fetchAsistenciaPorUsuario(user.idusuario);
      const asistenciaActual = asistencias.find(
        (a) => a.idconferencia === conferencia.value.idconferencia
      );

      if (!asistenciaActual) {
        Swal.fire("Error", "No tienes asistencia registrada para votar.", "warning");
        return;
      }

      if (yaVoteEstaVotacion.value) {
        Swal.fire("Error", "Ya has votado en esta votación.", "warning");
        return;
      }

      await votoStore.createVoto(asistenciaActual.idasistencia, conferencia.value.idconferencia, aFavor);
      votos.value.push({ nombre: user.nombre, voto: aFavor ? 1 : 0 });

      yaVoteEstaVotacion.value = true;
    };

    onMounted(async () => {
      await fetchConferencia();
      intervaloVotos = setInterval(cargarVotos, 3000);
    });

    onUnmounted(() => {
      clearInterval(intervaloTiempo);
      clearInterval(intervaloVotos);
    });

    return {
      conferencia,
      votos,
      conferencista,
      tiempoTranscurrido,
      iniciado,
      puedeVotar,
      votoRealizado: yaVoteEstaVotacion,
      votar,
      isModalOpen,
      handleAddTechnician,
      selectedFace,
      palabra,
      color_palabra,
      faces,
      selectFace,
    };
  },
};
</script>


<style scoped>
main {
    margin-top: 90px;
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

.no-iniciado {
    padding: 5px 10px;
    border-radius: 10px;
    background: gray;
    color: white;
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
    color: white;
    background: green;
}

.modal-contenido button:last-child {
    background: red;
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
  font-family: sans-serif;
  font-size: 36px;
  font-weight: 600;
  margin-top: 30px;
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
</style>