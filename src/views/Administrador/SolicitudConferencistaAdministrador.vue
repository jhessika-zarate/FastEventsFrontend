<template>
  <header>
    <div class="overlay">
      <h1>Solicitud de conferencistas</h1>
      <h3>Administra todas las solicitudes de nuevos conferencistas</h3>
      <br />
      <div>
    
  </div>
    </div>
  </header>
  <div>
    <form @submit.prevent="handleSearch">
      <div class="fx fx-gap">
        <div>
          <input
            type="text"
            placeholder="Buscar conferencista"
            v-model="search"
          />
        </div>
        <div id="search-icon">
          <button type="submit">
            <div id="search-icon-circle"></div>
            <span></span>
          </button>
        </div>
      </div>
    </form>
  </div>

  <div class="main-container_all">
    <div
      class="card"
      v-for="(conferencista, index) in filteredConferencistas"
      :key="index"
    >
      <div class="img-avatar">
        <svg viewBox="0 0 100 100">
          <path
            d="m38.977 59.074c0 2.75-4.125 2.75-4.125 0s4.125-2.75 4.125 0"
          ></path>
          <path
            d="m60.477 59.074c0 2.75-4.125 2.75-4.125 0s4.125-2.75 4.125 0"
          ></path>
          <path
            d="m48.203 69.309c1.7344 0 3.1484-1.4141 3.1484-3.1484 0-0.27734-0.22266-0.5-0.5-0.5-0.27734 0-0.5 0.22266-0.5 0.5 0 1.1836-0.96484 2.1484-2.1484 2.1484s-2.1484-0.96484-2.1484-2.1484c0-0.27734-0.22266-0.5-0.5-0.5-0.27734 0-0.5 0.22266-0.5 0.5 0 1.7344 1.4141 3.1484 3.1484 3.1484z"
          ></path>
          <path
            d="m35.492 24.371c0.42187-0.35156 0.48047-0.98438 0.125-1.4062-0.35156-0.42188-0.98438-0.48438-1.4062-0.125-5.1602 4.3047-16.422 17.078-9.5312 42.562 0.21484 0.79688 0.85547 1.4062 1.6641 1.582 0.15625 0.035156 0.31641 0.050781 0.47266 0.050781 0.62891 0 1.2344-0.27344 1.6445-0.76562 0.82812-0.98828 2.0039-1.5391 2.793-1.8203 0.56641 1.6055 1.4766 3.3594 2.9727 4.9414 2.2852 2.4219 5.4336 3.9453 9.3867 4.5547-3.6055 4.5-3.8047 10.219-3.8086 10.484-0.011719 0.55078 0.42187 1.0078 0.97656 1.0234h0.023438c0.53906 0 0.98437-0.42969 1-0.97266 0-0.054688 0.17187-4.8711 2.9805-8.7773 0.63281 1.2852 1.7266 2.5 3.4141 2.5 1.7109 0 2.7578-1.2695 3.3398-2.6172 2.8867 3.9258 3.0586 8.8359 3.0586 8.8906 0.015625 0.54297 0.46094 0.97266 1 0.97266h0.023438c0.55078-0.015625 0.98828-0.47266 0.97656-1.0234-0.007812-0.26953-0.20703-6.0938-3.9141-10.613 7.0781-1.3086 10.406-5.4219 11.969-8.9766 1.0508 0.98828 2.75 2.1992 4.793 2.1992 0.078126 0 0.15625 0 0.23828-0.003906 0.47266-0.023438 1.5781-0.074219 3.4219-4.4219 1.1172-2.6406 2.1406-6.0117 2.8711-9.4922 4.8281-22.945-4.7852-30.457-9.1445-32.621-12.316-6.1172-22.195-3.6055-28.312-0.42188-0.48828 0.25391-0.67969 0.85938-0.42578 1.3477s0.85938 0.67969 1.3477 0.42578c5.7031-2.9688 14.934-5.3047 26.5 0.4375 7.1875 3.5703 9 11.586 9.2539 17.684 0.49609 11.93-4.2617 23.91-5.7344 25.062h-0.015626c-1.832 0-3.4102-1.5742-4.0352-2.2852 0.28906-0.99609 0.44531-1.8672 0.52734-2.5117 0.62891 0.16797 1.2812 0.27344 1.9727 0.27344 0.55469 0 1-0.44922 1-1 0-0.55078-0.44531-1-1-1-7.3203 0-10.703-13.941-10.734-14.082-0.097656-0.40625-0.4375-0.71094-0.85156-0.76172-0.43359-0.050781-0.82031 0.16406-1.0117 0.53906-1.8984 3.7188-1.4297 6.7539-0.67969 8.668-6.2383-2.2852-8.9766-8.6914-9.0078-8.7617-0.17969-0.43359-0.62891-0.68359-1.1016-0.60156-0.46094 0.082032-0.80469 0.47266-0.82422 0.94141-0.14062 3.3359 0.67188 5.75 1.5 7.3164-8.3125-2.4297-10.105-11.457-10.184-11.875-0.097656-0.51562-0.57422-0.86328-1.0898-0.8125-0.51953 0.054687-0.90625 0.50391-0.89062 1.0234 0.41406 13.465-1.8516 17.766-3.2383 19.133-0.66406 0.65625-1.1992 0.67188-1.2383 0.67188-0.53906-0.050781-1.0156 0.31641-1.0938 0.85156-0.078125 0.54688 0.29688 1.0547 0.84375 1.1328 0.03125 0.003906 0.11328 0.015625 0.23828 0.015625 0.36719 0 1.1016-0.09375 1.9414-0.66406 0.050781 0.38672 0.125 0.81641 0.21875 1.2656-1.0273 0.35156-2.6211 1.0781-3.7812 2.4648-0.015625 0.019532-0.054687 0.066406-0.15625 0.046875-0.039062-0.007812-0.13281-0.039062-0.16406-0.15234-2.1875-8.1094-5.7148-28.309 8.8867-40.496zm12.711 51.828c-1.0039 0-1.5898-1.207-1.8672-2.0117 0.48047 0.023438 0.95703 0.050781 1.4531 0.050781 0.74219 0 1.4453-0.035156 2.1289-0.082031-0.24219 0.83594-0.76172 2.043-1.7148 2.043zm-13.148-30.664c1.9531 3.6211 5.6367 7.9102 12.305 8.6992 0.43359 0.046875 0.83984-0.18359 1.0234-0.57422 0.18359-0.39062 0.089844-0.85938-0.22656-1.1523-0.074219-0.070312-1.2734-1.2227-1.9688-3.6367 2 2.6094 5.3359 5.6836 10.305 6.5664 0.42187 0.070312 0.83594-0.125 1.0469-0.49219 0.21094-0.36719 0.16406-0.82812-0.11719-1.1484-0.023437-0.027344-1.9414-2.2969-1.2891-5.8906 1.2227 3.5508 3.7461 9.2227 7.8945 11.551-0.03125 0.55859-0.14844 1.668-0.55078 3.0156-0.085937 0.13672-0.125 0.28516-0.13672 0.44531-1.3008 3.8906-5.0039 9.3281-15.547 9.3281-5.375 0-9.4414-1.418-12.086-4.2109-3.5664-3.7656-3.332-8.8477-3.332-8.8984v-0.011719c1.5898-2.7227 2.5-7.3203 2.6797-13.59z"
          ></path>
        </svg>
      </div>
      <div class="card-text">
        <div class="portada"></div>
        <div class="title-total">
          <div class="title">Conferecista</div>
          <h2>{{ conferencista.nombre }} {{ conferencista.apellido }}</h2>
          <div class="desc">
            <i class="fas fa-envelope"></i
            ><span class="desc">{{ conferencista.correo }}</span>
          </div>

          <div class="desc">
            <i class="fas fa-phone"></i
            ><span class="desc">+591 {{ conferencista.telefono }}</span>
          </div>
          <div class="actions">
            <!--icono de tiqueo -->
            <button @click="aprobar(conferencista)">
              <i class="fas fa-check"></i>
            </button>
            <button @click="enviarCorreo">
              <i class="far fa-envelope"></i>
            </button>
            <!--icono de telefono -->
            <button @click="enviarWhatsApp">
              <i class="fas fa-phone"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { useUsuarioStore } from "@/stores/usuarioStore";

export default {
 

  setup() {
    const userStore = useUsuarioStore();
    return { userStore };
  },
  mounted() {
    this.fetchConferencistas();
  },
  computed: {
    filteredConferencistas() {
      return this.Conferencistas.filter((conferencista) => {
        const fullName =
          `${conferencista.nombre} ${conferencista.apellido}`.toLowerCase();
        return fullName.includes(this.search.toLowerCase());
      });
    },
  },
  methods: {
    async fetchConferencistas() {
      try {
        const response = await this.userStore.fetchUsuarios();
        console.log("lo que me entrego ", response);
        /** que considere e; 0 sea un entero o un string */
        this.Conferencistas = response.filter(
          (usuario) => usuario.rol === 0 || usuario.rol === "0"
        );
        console.log("Conferencistas", this.Conferencistas);
      } catch (error) {
        console.log(error);
      }
    },
    async search() {
      try {
        const response = await this.userStore.fetchUsuarios();
        this.Conferencistas = response.filter((usuario) => {
          return usuario.nombre
            .toLowerCase()
            .includes(this.search.toLowerCase());
        });
      } catch (error) {
        console.log(error);
      }
    },
    async aprobar(conferencista) {
      Swal.fire({
        title: "Estas de aprobar a este conferencista?",
        text: "No podras revertir esta accion",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, aprobar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Aprobado!",
            text: "El conferencista ha sido aprobado",
            icon: "success",
          });
          conferencista.rol = "3";
          console.log("conferencista id ", conferencista.idusuario);
          console.log("conferencista", conferencista);
          await this.userStore.updateUsuarioRole(
            conferencista.idusuario,
            conferencista.rol
          );
          this.fetchConferencistas();
        }
      });
    },
    enviarCorreo(correo) {
      if (!correo) {
        alert("No hay un correo válido.");
        return;
      }
      const asunto = encodeURIComponent(
        "Chuno Conferencias se quiere comunicar contigo"
      );
      const mailto = `mailto:${correo}?subject=${asunto}`;
      window.location.href = mailto;
    },

    enviarWhatsApp(telefono) {
      if (!telefono) {
        alert("No hay un telefono válido.");
        return;
      }
      // WhatsApp solo debe abrir chat sin direccionar a correo
      const url = `https://wa.me/${telefono}`;
      window.open(url, "_blank");
    },
  },
  data() {
    return {
      search: "",
      Conferencistas: [],
    };
  },
};
</script>

<style scoped>
.main-container_all {
  max-width: 1340px;
  margin: auto;
  margin-top: 5rem;
  /**que se acomoden en columnas */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
  padding: 0 1rem;
  padding-bottom: 4rem;
}
/**haz una clase donde pueda hacer el cosnumo de las tarjetas  en columnas*/
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
