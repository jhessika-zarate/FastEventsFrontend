import { defineStore } from "pinia";
import axios from "axios";
import { RutaApi } from "@/assets/apiConfig";

export const useVotoStore = defineStore("voto", {
  state: () => ({
    votos: [],
  }),

  actions: {
    async fetchVotos() {
      try {
        const response = await axios.get(`${RutaApi}voto`);
        this.votos = response.data;
        return this.votos;
      } catch (error) {
        console.error("Error al obtener votos:", error);
        throw error;
      }
    },

    async fetchVotoById(id) {
      try {
        const response = await axios.get(`${RutaApi}voto/${id}`);
        return response.data;
      } catch (error) {
        console.error("Error al obtener el voto:", error);
        throw error;
      }
    },

    async createVoto(idasistencia, idconferencia, aFavor) {
        try {
          const votoData = {
            idasistencia,
            idconferencia,
            voto: aFavor ? 1 : 0,
          };
      
          const response = await axios.post(`${RutaApi}voto`, votoData);
          this.votos.push(response.data);
          return response.data;
        } catch (error) {
          console.error("Error al crear voto:", error);
          throw error;
        }
    },      

    async updateVoto(id, votoAFavor) {
      try {
        const votoData = {
          voto: votoAFavor ? 1 : 0,
        };

        const response = await axios.put(`${RutaApi}voto/${id}`, votoData);
        this.votos = this.votos.map(v => v.idvoto === id ? response.data : v);
        return response.data;
      } catch (error) {
        console.error("Error al actualizar voto:", error);
        throw error;
      }
    },

    async deleteVoto(id) {
      try {
        await axios.delete(`${RutaApi}voto/${id}`);
        this.votos = this.votos.filter(v => v.idvoto !== id);
      } catch (error) {
        console.error("Error al eliminar voto:", error);
        throw error;
      }
    }
  },
});
