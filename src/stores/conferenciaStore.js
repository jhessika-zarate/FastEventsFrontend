import { RutaApi } from "@/assets/apiConfig";
import { defineStore } from "pinia";
import axios from "axios";

export const useConferenciaStore = defineStore("conferencia", {
  state: () => ({
    conferencia: {
      idconferencia: "",
      titulo: "",
      descripcion: "",
      fecha: "",
      hora: "",
      color: "",
      estilo: "",
      idsala: "",
      presentacion: "",
      departamento: "",
      modalidad: "",
      transmision: "",
      activo: "",
      votacion: false,
      conferencista: "",
    },
    conferencias: [],
  }),

  actions: {
    async createConferencia(conferenciaData) {
      try {
        const response = await axios.post(
          `${RutaApi}conferencias`,
          conferenciaData
        );

        // Agregar la nueva conferencia al state
        this.conferencias.push(response.data);

        console.log("Conferencia creada:", response.data);
        return response.data;
      } catch (error) {
        console.error(
          "Error al crear conferencia:",
          error.response?.data || error.message
        );
        throw error;
      }
    },
    async fetchConferencias() {
      try {
        const response = await axios.get(`${RutaApi}conferencias`);
        console.log("Conferencias obtenidas: ", response.data);
        this.conferencias = response.data;
        return this.conferencias;
      } catch (error) {
        console.error("Error al obtener conferencias: ", error);
      }
    },

    async fetchUltimaConferenciaUsuario() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.idusuario) {
          throw new Error("Usuario no autenticado");
        }

        const response = await axios.get(
          `${RutaApi}usuarios/${user.idusuario}/conferencias-pendientes`
        );

        if (response.data.length === 0) {
          console.warn("No hay conferencias recientes para este usuario.");
          return;
        }

        // Obtener la última conferencia según fecha y hora
        const ultimaConferencia = response.data.sort(
          (a, b) =>
            new Date(`${b.fecha} ${b.hora}`) - new Date(`${a.fecha} ${a.hora}`)
        )[0];

        this.conferencia = {
          idconferencia: ultimaConferencia.idconferencia,
          titulo: ultimaConferencia.titulo,
          descripcion: ultimaConferencia.descripcion,
          fecha: ultimaConferencia.fecha,
          hora: ultimaConferencia.hora,
          idsala: ultimaConferencia.idsala,
          modalidad: ultimaConferencia.modalidad,
          activo: ultimaConferencia.activo,
          votacion: ultimaConferencia.votacion, // Indica si la votación está habilitada
        };

        console.log("Última conferencia cargada:", this.conferencia);
      } catch (error) {
        console.error(
          "Error al obtener la última conferencia del usuario: ",
          error
        );
      }
    },

    async fetchConferenciaById(id) {
      try {
        const response = await axios.get(`${RutaApi}conferencias/${id}`);
        return response.data;
      } catch (error) {
        console.error("Error al obtener la conferencia: ", error);
        throw error;
      }
    },

    async finalizarConferencia(id) {
      try {
        const response = await axios.put(
          `${RutaApi}conferencias/${id}/activo`,
          { activo: 3 }
        );
        console.log("Conferencia finalizada: ", response.data);
        return response.data;
      } catch (error) {
        console.error("Error al finalizar la conferencia: ", error);
        throw error;
      }
    },

    async updateConferencia(conferencia) {
      try {
        const response = await axios.put(
          `${RutaApi}conferencias/${conferencia.idconferencia}`,
          conferencia
        );
        console.log("Conferencia actualizada: ", response.data);
        return response.data;
      } catch (error) {
        console.error("Error al actualizar la conferencia: ", error);
        throw error;
      }
    },

    async updateVotacion(id, votacion) {
      try {
        const response = await axios.put(
          `${RutaApi}conferencias/${id}/votacion`,
          { votacion }
        );
        console.log("Estado de votación actualizado: ", response.data);
        return response.data;
      } catch (error) {
        console.error("Error al actualizar votación: ", error);
        throw error;
      }
    },

    async deleteConferencia(id) {
      try {
        await axios.delete(`${RutaApi}conferencias/${id}`);
        this.conferencias = this.conferencias.filter(
          (conferencia) => conferencia.idconferencia !== id
        );
        console.log("Conferencia eliminada correctamente.");
      } catch (error) {
        console.error("Error al eliminar la conferencia: ", error);
        throw error;
      }
    },

    async fetchConferenciaId(id) {
      try {
        const response = await axios.get(`${RutaApi}conferencias/${id}`);
        console.log("Conferencia: ", response.data);
        this.conferencia = response.data;
        return this.conferencia;
      } catch (error) {
        console.error("Error al obtener la conferencia: ", error);
        throw error;
      }
    },
    ///:id/promedio
    async fetchPromedioCalificacionConferenciaById(id) {
      try {
        const response = await axios.get(
          `${RutaApi}conferencias/${id}/promedio`
        );
        console.log("promedio fetch : ", response.data);
        this.conferencia = response.data;
        return this.conferencia;
      } catch (error) {
        console.error("Error al obtener la conferencia: ", error);
        throw error;
      }
    },
    async fetchTemasConferenciaById(id) {
      try {
        const response = await axios.get(`${RutaApi}temas_conferencias/conferencias/${id}/temas`);
        console.log("temas de conferencia : ", response);
        this.conferencia = response.data;
      
        return this.conferencia;
      } catch (error) {
        console.error("Error al obtener la conferencia: ", error.response.data.message);
        return '';
        throw error;
        
      }
    
    },
    async fetchConferenciasRelacionadasByConferenciaById(id) {
      try {
        const response = await axios.get(
          `${RutaApi}conferencias/${id}/conferencias-relacionadas`
        );
        console.log("Conferencia: ", response.data);
        this.conferencia = response.data;
        return this.conferencia;
      } catch (error) {
        console.error("Error al obtener la conferencia: ", error);
        throw error;
      }
    },
    async fetchOradorConferenciaById(id) {
      try {
        const response = await axios.get(`${RutaApi}conferencias/${id}/orador`);
        console.log("Conferencia: ", response.data);
        this.conferencia = response.data;
        return this.conferencia;
      } catch (error) {
        console.error("Error al obtener la conferencia: ", error);
        throw error;
      }
    },

    async fetchConferenciasNoCalificadasByUsuarioId(id) {
      try {
        const response = await axios.get(
          `${RutaApi}conferencias/usuarios/${id}/conferencias-pendientes`
        );
        console.log("Conferencia: ", response.data);
        this.conferencia = response.data;
        return this.conferencia;
      } catch (error) {
        console.error("Error al obtener la conferencia: ", error);
        throw error;
      }
    },

    async PorConferenciaIdPorUsuarioIdInscrito(id, idusuario) {
      try {
        const response = await axios.get(
          `${RutaApi}conferencias/${id}/usuario/${idusuario}/asistencia`
        );
        console.log("PorConferenciaIdPorUsuarioIdInscrito: ", response.data);
        this.conferencia = response.data;
        return this.conferencia;
      } catch (error) {
        console.error("Error al obtener la conferencia: ", error);
        throw error;
      }
    }

  },
});
