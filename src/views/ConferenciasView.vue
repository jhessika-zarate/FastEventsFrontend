<template>
    <header>
      <div class="overlay">
        <h1>Todas las conferencias</h1>
        <h3>Busca y se parte de las conferencias más importantes</h3>
        <br />
      </div>
    </header>
    <div>
      <form @submit.prevent="handleSearch">
        <div class="fx fx-gap">
          <div>
            <input type="text" placeholder="Buscar conferencia" v-model="search" />
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
        <article
          class=""
          v-for="(conference, index) in filteredConferencistas"
          :key="index"
        >
          <div
            class="article-wrapper"
            @click="redireccionar(conference.idconferencia)"
          >
            <figure
              class="article-image"
              :style="getPreviewStyle(themes[conference.estilo])"
            >
              <h3>{{ conference.titulo}}</h3>
              <!--linea-->
              <p>{{ conference.fecha }}</p>
            </figure>
            <div class="article-body">
              <p>
                <!--limita la cantidad de caracteres-->
                {{ conference.descripcion.substring(0, 400) }}...
              </p>
              <a class="read-more">
                Ver conferencia
                <span class="sr-only">about this is some title</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </article>

   
    </div>
  
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal_base">
        <div class="title">Añadir técnico</div>
        <div class="subtitle">Llena los campos para añadir un técnico</div>
        <div class="input-container ic1">
          <input id="Nombre" class="input" type="text" placeholder=" " />
          <div class="cut"></div>
          <label for="Nombre" class="placeholder">Nombre</label>
        </div>
        <div class="input-container ic2">
          <input id="Apellido" class="input" type="text" placeholder=" " />
          <div class="cut"></div>
          <label for="Apellido" class="placeholder">Apellido</label>
        </div>
        <div class="input-container ic2">
          <input id="correo" class="input" type="text" placeholder=" " />
          <div class="cut cut-short"></div>
          <label for="correo" class="placeholder">Correo</label>
        </div>
        <div class="input-container ic2">
          <input id="telefono" class="input" type="text" placeholder=" " />
          <div class="cut"></div>
          <label for="telefono" class="placeholder">Telefono</label>
        </div>
        <div class="input-container ic2">
          <input id="contrasena" class="input" type="text" placeholder=" " />
          <div class="cut"></div>
          <label for="contrasena" class="placeholder">Contraseña</label>
        </div>
        <div class="botonesModal">
          <button class="submit" @click="closeOpen">Cancelar</button>
          <button class="submit" @click="handleAddTechnician">Añadir</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Swal from "sweetalert2/dist/sweetalert2.js";
  import "sweetalert2/src/sweetalert2.scss";
  import { useUsuarioStore } from "@/stores/usuarioStore";
  import { useConferenciaStore } from "@/stores/conferenciaStore";

  export default {
    setup() {
        const conferenceStore = useConferenciaStore();
    
      return { conferenceStore };
    },
    mounted() {
      this.fetchConferencistas();
    },
    computed: {
      filteredConferencistas() {
        return this.Conferencistas.filter((conferencista) => {
          const fullName =
            `${conferencista.titulo}`.toLowerCase();
          return fullName.includes(this.search.toLowerCase());
        });
      },
    },
    methods: {
      async fetchConferencistas() {
        try {
          const response = await this.conferenceStore.fetchConferencias();
          console.log("lo que me entrego ", response);
          /** que considere e; 0 sea un entero o un string */
          this.Conferencistas = response.filter(
            (usuario) => usuario.activo === 4 || usuario.activo === "4"
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
      
    
  
      handleAdd() {
        this.isModalOpen = true;
      },
      handleAddTechnician() {
        console.log("Técnico agregado:", this.newTechnician);
        this.isModalOpen = false;
        this.newTechnician.name = ""; // Limpiar el campo
      },
      closeOpen() {
        this.isModalOpen = false;
      },
      getPreviewStyle(theme) {
      const styles = {
        animation: theme.animation,
        WebkitAnimation: theme.animation,
        backgroundRepeat:
          theme.type === "dots" || theme.type === "stripes"
            ? "repeat"
            : "no-repeat",
      };

      switch (theme.type) {
        case "wave":
          styles.background = theme.color;
          styles.overflow = "hidden";
          break;
        case "gradient":
          styles.background = `linear-gradient(${
            theme.angle
          }deg, ${theme.colors.join(", ")})`;
          styles.backgroundSize = "400% 400%";
          break;
        case "stripes":
          styles.backgroundImage = `repeating-linear-gradient(
                        ${theme.angle}deg,
                        ${theme.colors[0]},
                        ${theme.colors[0]} ${theme.size},
                        ${theme.colors[1]} ${theme.size},
                        ${theme.colors[1]} calc(${theme.size} * 2)
                    )`;
          styles.backgroundSize = "80px 80px";
          break;

        case "dots":
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
    },
    data() {
      return {
        search: "",
        Conferencistas: [],
        isModalOpen: false,
        nuevoTecnico: {
          nombre: "",
          correo: "",
          rol: 2,
        },

        themes: [
        {
          type: "wave",
          color: "#8099ad",
          path: "M0,160L80,181.3C160,203,320,245,480,234.7C640,224,800,160,960,160C1120,160,1280,224,1360,256L1440,288L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z",
          animation: "waveAnim 5s linear infinite",
        },
        {
          type: "gradient",
          colors: ["#97BC62 ", "#FE90AF"],
          angle: 45,
          animation: "gradientFlow 8s ease infinite",
        },

        {
          type: "stripes",
          colors: ["#F0AB1E", "#F6DAA9"],
          angle: 45,
          size: "80px",
          animation: "movingStripes 2s linear infinite",
        },
        {
          type: "dots",
          color: "#563d69",
          background: "#2c3e50",
          size: "19px",
          spacing: "30px", // Aumentar spacing para mejor efecto
          animation: "floatingDots 10s linear infinite", // Reducir velocidad
        },
      ],
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
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
    background-image: linear-gradient(135deg, #919191d8 10%, #28587ba8 100%);
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
    background-color: #76c2c4;
    border-radius: 20px;
    box-shadow: 0 10px 40px #b9cfd4, 0 0 0 20px #ddddddeb;
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
  #add-button {
    width: 100%;
    height: 3.5rem;
    background-color: #ffffff;
    color: #84b7c2;
    padding: 5px 10px;
    font-size: 26px;
    border-radius: 10px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: 0.3s ease-in-out;
  }
  
  #add-button:hover {
    background-color: #28587b;
    color: #fff;
  }
  
  .boton {
    width: 25%;
  }
 

/**tarjeta  */
article {
  --img-scale: 1.001;
  --title-color: black;
  --link-icon-translate: -20px;
  --link-icon-opacity: 0;
  position: relative;
  border-radius: 16px;
  box-shadow: none;
  background: #ffffff;
  transform-origin: center;
  transition: all 0.4s ease-in-out;
  overflow: hidden;
  width: 250px;
}
.article-wrapper {
  color: #251101;
}

article a::after {
  position: absolute;
  inset-block: 0;
  inset-inline: 0;
  cursor: pointer;
  content: "";
}

/* basic article elements styling */
article h2 {
  margin: 0 0 18px 0;
  font-size: 1.9rem;
  letter-spacing: 0.06em;
  color: #f7c46b;
  transition: color 0.3s ease-out;
}

figure {
  margin: 0;
  padding: 0;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

article img {
  max-width: 100%;
  transform-origin: center;
  transform: scale(var(--img-scale));
  transition: transform 0.4s ease-in-out;
}

.article-body {
  padding: 14px;
}
.article-image {
  position: relative;
  overflow: hidden;
  background-color: #28587b;
  color: #fff;
  border-radius: 16px 16px 0 0;
  /**centra el texto */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /**reduce el interlineado */
  line-height: 0.01;
}
.read-more {
  cursor: pointer;
}
article a {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: #28587b;
}

article a:focus {
  outline: 1px dotted #efdad1;
}

article a .icon {
  min-width: 24px;
  width: 24px;
  height: 24px;
  margin-left: 5px;
  transform: translateX(var(--link-icon-translate));
  opacity: var(--link-icon-opacity);
  transition: all 0.3s;
}

/* using the has() relational pseudo selector to update our custom properties */
article:has(:hover, :focus) {
  --img-scale: 1.1;
  --title-color: #28666e;
  --link-icon-translate: 0;
  --link-icon-opacity: 1;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
    rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
}

/************************ 
Generic layout (demo looks)
**************************/

.articles {
  display: grid;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: 24px;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

@media screen and (max-width: 960px) {
  article {
    container: card/inline-size;
  }
  .article-body p {
    display: none;
  }
}

@container card (min-width: 380px) {
  .article-wrapper {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 16px;
  }
  .article-body {
    padding-left: 0;
  }
  figure {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  figure img {
    height: 100%;
    aspect-ratio: 1;
    object-fit: cover;
  }
}

.sr-only:not(:focus):not(:active) {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
  </style>
  