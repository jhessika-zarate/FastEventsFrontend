import { RutaApi } from "@/assets/apiConfig";
import { defineStore } from "pinia";
import axios from "axios";

export const useAsistenciaStore = defineStore("asistencia", {
  state: () => ({
    asistencia: {
      idasistencia: "",
      idusuario: "",
      idconferencia: "",
    },
    asistencias: [],
  }),

  actions: {
    async createAsistencia(asistenciaData) {
      try {
        const response = await axios.post(
          `${RutaApi}asistencias`,
          asistenciaData
        );

        // Agregar la nueva asistencia al state
        this.asistencias.push(response.data);

        console.log("Asistencia creada:", response.data);
        return response.data;
      } catch (error) {
        console.error(
          "Error al crear asistencia:",
          error.response?.data || error.message
        );
        throw error;
      }
    },
    async fetchAsistencias() {
      try {
        const response = await axios.get(`${RutaApi}asistencias`);
        this.asistencias = response.data;
        return this.asistencias;
      } catch (error) {
        console.error("Error al obtener asistencias: ", error);
      }
    },

    async fetchAsistenciaPorUsuario(idusuario) {
      try {
        const response = await axios.get(
          `${RutaApi}asistencias?usuario=${idusuario}`
        );
        return response.data;
      } catch (error) {
        console.error("Error al obtener asistencias del usuario: ", error);
      }
    },

    async agregarAsistencia(asistencia) {
      try {
        await axios.post(`${RutaApi}asistencias`, asistencia);
      } catch (error) {
        console.error("Error al agregar asistencia: ", error);
      }
    },
  },
});
