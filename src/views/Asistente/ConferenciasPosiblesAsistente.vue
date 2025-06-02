<template>
    <!-- <ConferencesPage :conferences="conferencesList" @click="DireccionarLogin" />-->
    <ConferencesPage :conferences="conferencesList"/>
  </template>
  
  <script>
  import ConferencesPage from "../../components/Conferences.vue";
  import { useConferenciaStore } from "@/stores/conferenciaStore";
  export default {
    setup() {
      const store = useConferenciaStore();
      return { store };
    },
    components: {
      ConferencesPage,
    },
    mounted() {
      this.fetchConferences();
    },
    data() {
      return {
        conferencesList: [
        ],
      };
    },
    methods: {
      async fetchConferences() {
        try {
          const response = await this.store.fetchConferencias();
          console.log("Datos obtenidos de la BD:", response);
  
          if (response) {
            this.conferencesList = response.map((conferencia) => ({
              id: conferencia.idconferencia,
              titulo: conferencia.titulo,
              date: conferencia.fecha, // Asegurar formato YYYY-MM-DD
              time: conferencia.hora, // Asegurar formato HH:mm
              location: conferencia.departamento, // Ajustar a string si es necesario
              modality: conferencia.modalidad,
              topics: ["Tecnología", "Innovación"], // Ajustar si hay un campo adecuado
              description: conferencia.descripcion,
            }));
          }
        } catch (error) {
          console.error("Error al cargar conferencias:", error);
          alert("Error al cargar conferencias. Redirigiendo a login.");
          this.$router.push("/login");
        }
      },
      DireccionarLogin() {
        this.$router.push("/login");
      },
    },
  };
  </script>
  <style></style>
  