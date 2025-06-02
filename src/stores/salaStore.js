import { RutaApi } from "@/assets/apiConfig";
import { defineStore } from "pinia";
import axios from "axios";

export const useSalaStore = defineStore("sala", {
    state: () => ({
        sala: {
            idsala: "",
            nombre: "",
            capacidad: "",
            activo: ""
        },
        salas: [],
    }),

    actions: {
        async fetchSalas() {
            try {
                const response = await axios.get(`${RutaApi}salas`);
                this.salas = response.data;
                return this.salas;
            } catch (error) {
                console.error("Error al obtener asistencias: ", error);
            }
        }
    }
});