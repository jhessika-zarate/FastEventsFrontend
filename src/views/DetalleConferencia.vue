<template>
  <div class="main-container_all">
    <div class="layout-container">
      <div class="main-container">
        <div
         
          class="banner"
          :style="getPreviewStyle(themes[conference.estilo])"
        >
          <h5>{{ conference.titulo }}</h5>
          <!---linea-->
          <hr class="linea" />
          <span>{{ formattedDate }}</span>

          <span>Modo: {{ conference.modalidad }}</span>
        </div>
        <div v-if="!inscrito" class="contenedorBoton">
          <button @click="Inscribirse()" class="button">
            Inscribirme ahora
          </button>
        </div>
        <div class="article-meta">
          <div class="author">
            <svg
              width="249px"
              height="249px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <rect width="24" height="24" fill="white"></rect>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9999 6C9.79077 6 7.99991 7.79086 7.99991 10C7.99991 12.2091 9.79077 14 11.9999 14C14.209 14 15.9999 12.2091 15.9999 10C15.9999 7.79086 14.209 6 11.9999 6ZM17.1115 15.9974C17.8693 16.4854 17.8323 17.5491 17.1422 18.1288C15.7517 19.2966 13.9581 20 12.0001 20C10.0551 20 8.27215 19.3059 6.88556 18.1518C6.18931 17.5723 6.15242 16.5032 6.91351 16.012C7.15044 15.8591 7.40846 15.7251 7.68849 15.6097C8.81516 15.1452 10.2542 15 12 15C13.7546 15 15.2018 15.1359 16.3314 15.5954C16.6136 15.7102 16.8734 15.8441 17.1115 15.9974Z"
                  fill="#28587B"
                ></path>
              </g>
            </svg>

            <!---mayuculas el orador -->
            <p class="byline">
              Por <b>{{ this.orador.toUpperCase() }}</b>
            </p>
            <p class="dateline">{{ conference.hora.split("T")[0] }}</p>
          </div>

          <div class="article-tags" v-for="(tag, index) in temas" :key="index">
            <span
              class="tag"
              :style="getPreviewStyle(themes[conference.estilo])"
              >{{ tag.nombre }}</span
            >
          </div>
        </div>
        <div class="">
          <p class="article-para-1">
            {{ conference.descripcion }}
          </p>
          <div class="article-row">
            <div v-if="conference.activo == 3 || this.promedioDeConferencia!='0'" class="modal_base2">
              <div class="baseCaritas">
                <div id="voteFace">
                  <i
                    v-for="(face, index) in faces"
                    :key="index"
                    :class="[
                      'far',
                      face.icon,
                      'fa-5x',
                      { fas: selectedFaceCalificacion === index },
                    ]"
                    :style="{ color: face.color }"
                  ></i>
                </div>
                <h1
                  :style="{ color: color_palabraCalificacion }"
                  style="font-size: 24px; margin-top: 10px"
                >
                  {{ palabraCalificacion }}
                </h1>
              </div>
            </div>
          </div>

          <div v-if="this.embedUrl" class="article-row">
            <div
              style="
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 56.25%;
                padding-bottom: 0;
                box-shadow: 0 2px 8px 0 rgba(63, 69, 81, 0.16);
                margin-top: 1.6em;
                margin-bottom: 0.9em;
                overflow: hidden;
                border-radius: 8px;
                will-change: transform;
              "
            >
              <iframe
                loading="lazy"
                style="
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  top: 0;
                  left: 0;
                  border: none;
                  padding: 0;
                  margin: 0;
                "
                :src="this.embedUrl"
                allowfullscreen="allowfullscreen"
                allow="fullscreen"
              >
              </iframe>
            </div>
            <a
              href="https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAGfaCnP2yI&#x2F;lR80HjqxOZ6SK7jAVvGwhQ&#x2F;view?utm_content=DAGfaCnP2yI&amp;utm_campaign=designshare&amp;utm_medium=embeds&amp;utm_source=link"
              target="_blank"
              rel="noopener"
            ></a>
          </div>
        </div>
      </div>
      <!-- Nueva columna de tarjetas de conferencias -->
      <div class="conference-sidebar">
        <article
          class=""
          v-for="(conference, index) in conference_relacionadas.slice(0, 3)"
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
              <h3>{{ conference.titulo.substring(0, 15) }}...</h3>
              <!--linea-->
              <p>{{ conference.fecha }}</p>
            </figure>
            <div class="article-body">
              <p>
                <!--limita la cantidad de caracteres-->
                {{ conference.descripcion.substring(0, 100) }}...
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
</template>

<script>
import { useRoute } from "vue-router";
import { useConferenciaStore } from "@/stores/conferenciaStore";
import { useAsistenciaStore } from "@/stores/asistenciaStore";
import { useCalificacionStore } from "@/stores/calificacionStore";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
export default {
  setup() {
    const conferenceStore = useConferenciaStore();
    const route = useRoute();
    const asistenciaStore = useAsistenciaStore();
    const calificacionStore = useCalificacionStore();
    return { conferenceStore, route, asistenciaStore, calificacionStore };
  },
  data() {
    return {
      embedUrl: "",
      conference_relacionadas: [],
      temas: [],
      conference: {
        idconferencia: 1,
        idsala: 6,
        titulo: "Titulo de la conferencia",
        fecha: "2015-09-27",
        modalidad: "Virtual",
        activo: 811,
        departamento: 500,
        descripcion:
          "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica",
        estilo: 3,
        hora: "16:22:38",
        presentacion: "t16aU7gq6o",
        transmision: "iktXxYhIvO",
        votacion: false,
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
      Conferencias: [],
      conferences: [
        { title: "Conferencia A", date: "10 de Marzo" },
        { title: "Conferencia B", date: "12 de Marzo" },
        { title: "Conferencia C", date: "15 de Marzo" },
      ],
      tags: ["culture", "games", "featured"],
      rating: 3.5, // Puedes cambiar este valor para probar
      isModalOpen: false,
      selectedFace: null,
      orador: "",
      palabra: "",
      color_palabra: "",
promedioDeConferencia: 0,
      selectedFaceCalificacion: null,
      palabraCalificacion: "",
      color_palabraCalificacion: "",
      inscrito: false,
      faces: [
        { icon: "fa-laugh", color: "#37b007", value: 5, palabra: "Excelente" },
        { icon: "fa-smile", color: "#a6e300", value: 4, palabra: "Muy buena" },
        { icon: "fa-meh", color: "#e8dc00", value: 3, palabra: "Regular" },
        { icon: "fa-frown", color: "#e07f00", value: 2, palabra: "Mala" },
        { icon: "fa-dizzy", color: "#de2904", value: 1, palabra: "Pésima" },
      ],
      conferenceId: 0,
    };
  },
   mounted() {
    this.conferenceId = this.route.params.id;
    console.log("ID de la conferencia", this.conferenceId);
  
    this.VerificarInscripcion();

    this.fetchConferencias().then(() => {
      console.log("Conferencias cargadas", this.Conferencias);
    });
    this.PromedioConferencia();
    this.fetchConferenciaId();

  },
  methods: {
    async PromedioConferencia(){  const responsePromedio =
      await this.conferenceStore.fetchPromedioCalificacionConferenciaById(
        this.conferenceId
      );
    const promedio = Math.round(responsePromedio.promedio); // Redondear
    console.log("Promedio de calificación", promedio);
    this.promedioDeConferencia = promedio;
    this.actualizarCalificacion(promedio);},

    async Inscribirse() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.idusuario) {
        throw new Error("Usuario no autenticado");
      }

      const response = await this.asistenciaStore.createAsistencia({
        idusuario: user.idusuario,
        idconferencia: this.route.params.id,
      });

      console.log("Inscripción realizada", response);
      console.log("ID de la asistencia", response.idasistencia);
      //idasistencia
      try {
        const responseCalificacion =
          await this.calificacionStore.createCalificacion({
            calificacion: 0,
            idasistencia: response.idasistencia,
            calificado: false,
          });
        if (responseCalificacion) {
          console.log("Calificación realizada", responseCalificacion);
        }
      } catch (error) {
        console.log(
          "Error al inscribirse a la conferencia en crear calificacion: ",
          error
        );
        Swal.fire({
          title: "Error al inscribirse",
          text: "Por favor, inténtalo de nuevo",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }
      Swal.fire({
        title: "Inscripción exitosa",
        text: "¡Nos vemos en la conferencia!",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      this.inscrito = true;
    },
    async VerificarInscripcion() {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.idusuario) {
        throw new Error("Usuario no autenticado");
      }

      const response =
        await this.conferenceStore.PorConferenciaIdPorUsuarioIdInscrito(
          this.route.params.id,
          user.idusuario
        );

      this.inscrito = response.registrado;
      console.log(
        "Inscrito a la conferencia",
        this.route.params.id,
        "con iduser",
        user.idusuario,
        this.inscrito
      );
    },
    async fetchConferenciaId() {
      try {
        this.conference = await this.conferenceStore.fetchConferenciaId(
          this.conferenceId
        );
        console.log("Conferencia cargada", this.conference);
      } catch (error) {
        console.log("Error al obtener la conferencia: ", error);
        this.$router.push("/asistente/home");
        return;
      }
      this.temas = await this.conferenceStore.fetchTemasConferenciaById(
        this.conferenceId
      );
      console.log("Temas de la conferencia", this.temas);

      console.log("Presentación de Canva", this.conference.presentacion);
      const responseOrador =
        await this.conferenceStore.fetchOradorConferenciaById(
          this.conferenceId
        );
      this.orador = responseOrador.data.orador;
      console.log("Orador de la conferencia", this.orador);

      if (this.conference.presentacion.includes("canva.com/design/")) {
        this.embedUrl = this.conference.presentacion + "?embed";
      } else {
        this.embedUrl = "";
      }
    },
    selectFace(index) {
      this.selectedFace = index;
      this.palabra = this.faces[index].palabra;
      this.color_palabra = this.faces[index].color;
    },
    actualizarCalificacion(promedio) {
      const index = Math.round(promedio) - 1; // Redondear y ajustar al índice (1-5 → 0-4)
      this.selectFaceCalificacion(index);
    },
    selectFaceCalificacion(index) {
      if (index >= 0 && index < this.faces.length) {
        this.selectedFaceCalificacion = index;
        this.palabraCalificacion = this.faces[index].palabra;
        this.color_palabraCalificacion = this.faces[index].color;
      }
    },
    handleAdd() {
      this.isModalOpen = true;
    },
    handleAddTechnician() {
      if (this.selectedFace === null) {
        alert("Por favor selecciona una carita para calificar.");
        return;
      }
      console.log(
        "Calificación registrada:",
        this.faces[this.selectedFace].value
      );
      this.closeOpen();
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
    async fetchConferencias() {
      try {
        const response = await this.conferenceStore.fetchConferencias();

        console.log("Conferencias relacionadas", this.conference_relacionadas);
        //puedes hacer que se ordenn de manera random
        this.conference_relacionadas = response.sort(() => Math.random() - 0.5);

        console.log(
          "Las conferencias se guardan en el array: ",
          this.Conferencias
        );
      } catch (error) {
        console.log("Error al obtener las conferencias: ", error);
      }
    },
    redireccionar(id) {
      console.log("Redireccionando a la conferencia con ID:", id);
      this.$router.push({ name: 'ConferenciaDetalle', params: { id } }).then(() => {
      window.location.reload();
    });
    },
  },
  computed: {
    formattedDate() {
      if (!this.conference.fecha) return "Lunes 10 de Marzo";
      const date = new Date(this.conference.fecha);
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    },
  },
};
</script>

<style scoped>
.layout-container {
  max-width: 1000px;
  display: flex;
  gap: 20px;
}

.conference-sidebar {
  background-color: #ffffff;
  margin-top: 6rem;
  border-radius: 8px;
  max-width: 500px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  padding: 1rem;
}
.conference-card {
  background-color: #f7c46b;
  padding: 1rem;
  width: 200px;
  border-radius: 8px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.banner {
  background-color: #84b7c2;
  margin-top: 20rem;
  width: 90%;
  height: 20rem;
  color: white;
  padding: 1rem;
  margin: 1rem auto;
  border-radius: 1rem;
  text-align: center;
  font-size: 4rem;

  text-transform: uppercase;
  box-shadow: 10px 10px 2px rgb(188, 196, 197);
  display: flex;
  flex-direction: column; /* Acomoda los elementos en columna */
  justify-content: center; /* Centra verticalmente */
  align-items: center; /* Centra horizontalmente */
}

.banner h5 {
  font-size: 3rem; /* Tamaño grande para el título */
  margin: 0;
  font-weight: bold;
}

.banner span {
  font-size: 2rem; /* Tamaño más pequeño para la fecha */
  text-transform: none; /* Evita que se convierta en mayúsculas */
}

.linea {
  border: 1px solid #ffffff;
  width: 50%;
  margin: 1rem auto;
}

/**predeterminado */
.main-container {
  border-radius: 8px;
  background-color: #ffffff;
  width: 1000px;
  margin: auto;
  padding: 20px;
  margin-top: 6rem;
}

.main-container_all {
  max-width: 900px;
  margin: auto;

  margin-top: 4rem;
}
img {
  width: 100%;
}

.highlight {
  font-weight: bold;
  padding: 0rem 2rem;
  width: 70%;
}

.article-meta {
  max-width: 96rem;
  width: 100%;
  display: flex;
  flex-direction: column;

  align-items: flex-start;
  justify-content: space-between;
}
.author {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.author svg {
  height: 5rem;
  width: 5rem;
  margin: 0 1rem 0 0;
}
.author p {
  margin-right: 1rem;
  color: gray;
}
.tag {
  border: 1px solid #ffffff;
  padding: 0.1rem 0.5rem;
  border-radius: 5rem;
  color: #ffffff;
  background-color: #fbebe4;
  box-shadow: 5px 5px 2px #ababab;
  margin-right: 0.5rem;
  font-size: 0.5rem;
}
.article {
  font-size: 0.5rem;
  line-height: 2;
}
.article-para-1 {
  font-size: 1.4rem;
  line-height: 1.5;
  color: gray;
}
.article-row {
  display: flex;
  flex-direction: column;

  justify-content: stretch;
}

aside {
  font-size: 2.4rem;
  font-weight: bold;
  line-height: 1.2;
  max-width: 65rem;
}

.tag {
  margin-right: 2rem;
  font-size: 1.2rem;
}
aside {
  font-size: 3.6rem;
}

@media screen and (min-width: 1024px) {
  body {
    max-width: 90rem;
  }
  .article-meta {
    flex-direction: row;
    align-items: center;
  }
  .author {
    margin-bottom: unset;
  }
  .article-row {
    flex-direction: row;
  }
}
@media screen and (min-width: 1200px) {
  body {
    max-width: 102.4rem;
  }
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
  width: 200px;
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

.contenedorBoton {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.button {
  background-color: #86b4a9;
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
  cursor: pointer;
}
.button:active {
  background-color: #efdad1;
  color: #28587b7a;
}
</style>
