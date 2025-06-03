<template>
  <header>
    <div class="overlay">
      <h1>Bienvenid@ rol de Empresa</h1>
      <h3>Aqui podras ver a los asistentes</h3>
      <button class="botoncito" @click="showModal = true">Crear Conferencia</button>
      <ConferenceModal v-if="showModal" @close="showModal = false" @submit="handleSubmit" />
    </div>
  </header>
  


  <div class="main-container_all">
    <div class="banner-container">
      <BannerConferencia v-for="(conferencia, index) in Conferencias" :key="index" :conference="conferencia"
        v-if="Conferencias.length > 0" @refresh-conferences="fetchConferencias()" />
    </div>
  </div>
</template>

<script>
import "sweetalert2/src/sweetalert2.scss";
import ConferenceModal from '@/components/NuevaConferencia.vue';
import BannerConferencia from "@/components/BannerConferencia.vue";
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
    }
  },
  async mounted() {
    this.fetchConferencias().then(() => {
      console.log("Conferencias cargadas", this.Conferencias);
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

        this.Conferencias = response.filter(conferencia => {
          console.log(`Comparando conferencia ID: ${conferencia.idusuario} con usuario ID: ${usuario.idusuario}`);
          return conferencia.idusuario === usuario.idusuario;
        });
      } catch (error) {
        console.log("Error al obtener las conferencias: ", error);
      }
    },
  },
};
</script>

<style scoped>
.main-container_all {
  max-width: 1340px;
  margin: auto;
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 0 1rem;
  padding-bottom: 4rem;
  background: linear-gradient(135deg, #f1f1f1 40%, #fafafa 100%);
  border-radius: 12px;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.1);
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
  margin-top: 4rem;
}

.section-title h2 {
  font-size: 3rem;
  color: #251101;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.section-title p {
  color: #7c7c7c;
  font-size: 1.1rem;
  margin-top: 1rem;
  font-style: italic;
}

.banner-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
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
  background-image: linear-gradient(135deg, #9c6b42a6 10%, #251101e6 100%);
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

.botoncito {
  background-color: #af9a88;
  border-radius: 10%;
  padding: 2rem;
  font-size: 1rem;
  width: fit-content;
  height: auto;
  font-weight: 600;
  margin: 0 auto;
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
  background-color: #6f5037;
  border-radius: 20px;
  box-shadow: 0 10px 40px #A98467, 0 0 0 20px #ffffffeb;
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
  color: #af9a88;
  cursor: pointer;
  transition: 0.5s;

  &:hover {
    color: #251101;
    transform: rotate(22deg);
  }
}
</style>
