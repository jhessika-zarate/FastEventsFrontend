import { RutaApi } from "@/assets/apiConfig";
import { defineStore } from "pinia";
import axios from "axios";

export const useCalificacionStore = defineStore("calificacion", {

  state: () => ({
    calificacion: {
      idcalificacion: "",
      calificado: false,
      calificacion: "",
      idasistencia: "",
    },
    calificaciones: [],
  }),
  actions: {
    async createCalificacion(calificacionData) {
      try {
        const response = await axios.post(
          `${RutaApi}calificaciones`,
          calificacionData
        );
        this.calificaciones.push(response.data);
        console.log("Calificacion creada:", response.data);
        return response.data;
      } catch (error) {
        console.error(
          "Error al crear calificacion:",
          error.response?.data || error.message
        );
        throw error;
      }
    },
    async updateCalificacion(calificacionData) {
      try {
        const response = await axios.put(
          `${RutaApi}calificaciones/${calificacionData.idcalificacion}`,
          calificacionData
        );
       
        const index = this.calificaciones.findIndex(
          (calificacion) => calificacion.idcalificacion === calificacionData.idcalificacion
        );
        this.calificaciones[index] = response.data;
        console.log("Calificacion actualizada:", response.data);
        return response.data;
      } catch (error) {
        console.error(
          "Error al actualizar calificacion:",
          error.response?.data || error.message
        );
        throw error;
      }
    },async fetchCalificaciones() {
      try {
        const response = await axios.get(`${RutaApi}calificaciones`);
        this.calificaciones = response.data;
        return this.calificaciones;
      } catch (error) {
        console.error("Error al obtener calificaciones: ", error);
      }
    }
  },
 
});
