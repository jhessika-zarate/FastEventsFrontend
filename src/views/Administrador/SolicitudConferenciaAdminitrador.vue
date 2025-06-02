<template>
  <header>
    <div class="overlay">
      <h1>Bienvenido a CHUNO</h1>
      <h3>Solicitud de charlas</h3>
      <br />
      <div></div>
    </div>
  </header>
  <div class="main-container_all">
    <div class="banner-container">
      <BannerConferencia
        v-for="(conferencia, index) in Conferencias"
        :key="index"
        :conference="conferencia"
        v-if="Conferencias.length > 0"
        @refresh-conferences="fetchConferencias()"
      />
    </div>
  </div>
</template>

<script>
import "sweetalert2/src/sweetalert2.scss";
import ConferenceModal from "@/components/NuevaConferencia.vue";
import BannerConferencia from "@/components/BannerAceptarCharla.vue";
import { useConferenciaStore } from "@/stores/conferenciaStore";
export default {
  components: { ConferenceModal, BannerConferencia },
  setup() {
    const conferenceStore = useConferenciaStore();
    return { conferenceStore };
  },
  data() {
    return {
      showModal: false,
      Conferencias: [],
    };
  },
  async mounted() {
    this.fetchConferencias().then(() => {
      console.log("Conferencias cargadas obtenida", this.Conferencias);
    });
  },
  methods: {
    async fetchConferencias() {
      try {
        const response = await this.conferenceStore.fetchConferencias();
        console.log("Respuesta recibida: ", response);

        const usuarioData = localStorage.getItem("user");
        if (!usuarioData) {
          console.warn("No se encontró usuario en localStorage");
          return;
        }

        const usuario = JSON.parse(usuarioData);

        this.Conferencias = response.filter((conferencia) => {
          console.log(
            `Comparando conferencia ID: ${conferencia.idusuario} con usuario ID: ${usuario.idusuario}`
          );
          return conferencia.activo === 2;
        });
      } catch (error) {
        console.log("Error al obtener las conferencias: ", error);
      }
    },
  },
};
</script>

<style scoped>
.banner-container {
  /**que s eponga en columnas */
  display: grid;
  grid-template-columns: repeat((3, 1fr));
  /**que tengan el mismo ancho de 300px */

  gap: 1rem;
}

.main-container_all {
  max-width: 1340px;
  margin: auto;
  margin-top: 5rem;
  /**que se acomoden en columnas */
  display: grid;
  grid-template-columns: repeat((3, 1fr));
  gap: 1rem;
  padding: 0 1rem;
  padding-bottom: 4rem;
}
/**haz una clase donde pueda hacer el cosnumo de las tarjetas  en columnas*/
.card {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0px 10px 15px rgba(34, 35, 58, 0.5);
  width: 400px;
  display: flex;
  flex-direction: row;
  border-radius: 25px;
  position: relative;
}

* {
  padding: 0;
  margin: 0;
}

header {
  background: url("/images/conf2.jpg");
  text-align: center;
  width: 100%;
  height: auto;
  margin-top: 5rem;
  background-size: cover;
  background-attachment: fixed;
  position: relative;
  overflow: hidden;
  border-radius: 0 0 85% 85% / 30%;
}
header .overlay {
  width: 100%;
  height: 100%;
  padding: 50px;
  color: #fff;
  text-shadow: 1px 1px 1px #333;
  background-image: linear-gradient(135deg, #84b7c2d8 10%, #28587ba8 100%);
}

h1 {
  font-size: 80px;
  margin-bottom: 30px;
}

h3,
p {
  margin-bottom: 30px;
}

.fx {
  display: flex;
}

.fx-gap {
  gap: 18px;
  margin-top: -10px;
}

input,
button {
  color: #fff;
  padding: 0;
  margin: 0;
  border: 0;
  background-color: transparent;
  outline: none;
}

form {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  width: 50rem;
  height: 36px;
  padding: 35px;
  margin: -83px auto 0 auto;
  background-color: #84b7c2;
  border-radius: 20px;
  box-shadow: 0 10px 40px #a0cfda, 0 0 0 20px #ffffffeb;
  transform: scale(0.6);
  margin-top: -11rem;
}

input[type="text"] {
  width: 100%;
  height: 46px;
  font-size: 60px;
  line-height: 1;
}

input[type="text"]::placeholder {
  color: #ffffff;
}

button {
  position: relative;
  display: block;
  width: 84px;
  height: 46px;
  cursor: pointer;
}

#search-icon-circle {
  position: relative;
  top: -8px;
  left: 0;
  width: 33px;
  height: 33px;
  margin-top: 0;
  border-width: 15px;
  border: 15px solid #fff;
  background-color: transparent;
  border-radius: 50%;
  transition: 0.5s ease all;
}

button span {
  position: absolute;
  top: 48px;
  left: 38px;
  display: block;
  width: 30px;
  height: 15px;
  background-color: transparent;
  border-radius: 10px;
  transform: rotateZ(52deg);
  transition: 0.5s ease all;
}

button span:before,
button span:after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: 35px;
  height: 15px;
  background-color: #fff;
  border-radius: 10px;
  transform: rotateZ(0);
  transition: 0.5s ease all;
}

#search-icon:hover #search-icon-circle {
  top: -1px;
  width: 67px;
  height: 15px;
  border-width: 0;
  background-color: #fff;
  border-radius: 20px;
}

#search-icon:hover span {
  top: 50%;
  left: 56px;
  width: 25px;
  margin-top: -9px;
  transform: rotateZ(0);
}

#search-icon:hover button span:before {
  bottom: 11px;
  transform: rotateZ(52deg);
}

#search-icon:hover button span:after {
  bottom: -11px;
  transform: rotateZ(-52deg);
}
#search-icon:hover button span:before,
#search-icon:hover button span:after {
  right: -6px;
  width: 40px;
  background-color: #fff;
}

/**tarjeta */

.card {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0px 10px 15px rgba(34, 35, 58, 0.5);
  max-width: 400px;
  display: flex;
  flex-direction: row;
  border-radius: 25px;
  position: relative;
}
.card h2 {
  margin: 0;
  padding: 0 1rem;
}
.card .title {
  padding: 1rem;
  text-align: right;
  color: #28587b;
  font-weight: bold;
  font-size: 18px;
}
.card .desc {
  padding: 0.5rem 1rem;
  font-size: 12px;
}
.card .actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  padding: 0.5rem 1rem;
}
.card svg {
  width: 65px;
  height: 65px;
  margin: 0 auto;
}

.img-avatar {
  width: 60px;
  height: 60px;
  position: absolute;
  border-radius: 50%;
  border: 6px solid white;
  background-image: linear-gradient(-60deg, #28587b 0%, #84b7c2 100%);
  top: 15px;
  left: 85px;
}

.card-text {
  display: grid;
  grid-template-columns: 1fr 2fr;
}

.title-total {
  padding: 2.5em 1.5em 1.5em 1.5em;
}

path {
  fill: white;
}

.img-portada {
  width: 100%;
}

.portada {
  width: 6rem;
  height: 100%;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  background-image: url("/public/images/conf2.jpg");
  background-position: bottom center;
  background-size: cover;
}

.actions button {
  border: none;
  background: none;
  font-size: 24px;
  color: #60829b;
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    color: #28587b;
    transform: rotate(22deg);
  }
}
</style>
