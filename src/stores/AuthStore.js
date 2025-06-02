// src/stores/AuthStore.js
import { RutaApi } from "@/assets/apiConfig";
import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    async login(correo, contrasena) {
      try {
        const response = await axios.post(
          `${RutaApi}auth/login`,
          {
            correo,
            contrasena,
          }
        );

        this.user = response.data.usuario;
        this.token = response.data.token;
        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));

        return response.data;
      } catch (error) {
        console.error(
          "Error en login:",
          error.response?.data?.message || error.message
        );
        throw error;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    loadUserFromStorage() {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        this.user = JSON.parse(storedUser);
        this.token = storedToken;
      }
    },
  },
});
