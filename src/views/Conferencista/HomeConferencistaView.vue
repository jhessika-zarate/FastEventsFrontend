<template>
  <header>
    <div class="overlay">
      <h1>Bienvenid@ rol como empresa</h1>
      <h3>Aqui podras ver tus eventos</h3>
    </div>
  </header>
  <div style="width: 100% ;  display: flex; margin-top: 1rem;"> <button
    class="botoncito"
     @click="openCreateModal"
  >
    Crear Conferencia
  </button></div>

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
 <ConferenceDetails
      v-if="showCreateModal"
      @close="showCreateModal = false"
      :conference="{}"
      :editable="true"
      :isNew="true"
      @refresh-conferences="$emit('refresh-conferences')"
    />

</template>

<script>
import "sweetalert2/src/sweetalert2.scss";
import ConferenceModal from "@/components/NuevaConferencia.vue";
import BannerConferencia from "@/components/BannerConferencia.vue";
import ConferenceDetails from "@/components/DetalleConferencia.vue";
import { useConferenciaStore } from "@/stores/conferenciaStore";
export default {
  components: { ConferenceModal, BannerConferencia , ConferenceDetails },
  setup() {
    const conferenceStore = useConferenciaStore();
    return { conferenceStore };
  },
  data() {
    return {
      showModal: false,
      Conferencias: [], eventoSeleccionado: null,
      showCreateModal: false,
      
    };
  },
  async mounted() {
    this.fetchConferencias().then(() => {
      console.log("Conferencias cargadas", this.Conferencias);
    });
  },
 methods: {
   openCreateModal() {
      this.showCreateModal = true;
    },
  // ...otros métodos
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
          return conferencia.idusuario === usuario.idusuario;
        });
      } catch (error) {
        console.log("Error al obtener las conferencias: ", error);
      }
    },
   guardarEvento() {
      try {
        // Validar JSON
        const categoriasParsed = JSON.parse(this.eventoForm.categorias || "{}");
        const preciosParsed = this.eventoForm.precios
          ? JSON.parse(this.eventoForm.precios)
          : null;

        // Crear o actualizar evento
        if (this.eventoSeleccionado) {
          // Editar: encontrar índice y actualizar
          const index = this.Conferencias.findIndex(
            (e) => e === this.eventoSeleccionado
          );
          if (index !== -1) {
            this.Conferencias.splice(index, 1, {
              ...this.eventoForm,
              categorias: categoriasParsed,
              precios: preciosParsed,
            });
          }
        } else {
          // Crear nuevo evento
          this.Conferencias.push({
            ...this.eventoForm,
            categorias: categoriasParsed,
            precios: preciosParsed,
          });
        }

        this.cerrarModal();
      } catch (e) {
        alert("Error al guardar evento. Verifica que las categorías y precios sean JSON válidos.");
        console.error(e);
      }
    },
    cerrarModal() {
      this.showModal = false;
      this.eventoSeleccionado = null;
      this.eventoForm = this.getEventoFormVacio();
    },
    editarEvento(evento) {
      this.eventoSeleccionado = evento;
      this.eventoForm = {
        ...evento,
        categorias: typeof evento.categorias === "object" ? JSON.stringify(evento.categorias) : evento.categorias,
        precios: evento.precios ? (typeof evento.precios === "object" ? JSON.stringify(evento.precios) : evento.precios) : "",
      };
      this.showModal = true;
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
  margin-top: 3rem;
  color: #fff;
  text-shadow: 1px 1px 1px #333;
  background-image: linear-gradient(135deg, #426c9ca6 10%, #010c25e6 100%);
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
  background-color: #8894af;
  width: 200px;
  height: 50px;

  padding: 1rem;
  font-size: 1rem;
  
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


</style>
