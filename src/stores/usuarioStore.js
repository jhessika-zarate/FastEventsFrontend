import { RutaApi } from "@/assets/apiConfig";
import { defineStore } from "pinia";
import axios from "axios";

export const useUsuarioStore = defineStore("usuario", {
  state: () => ({
    usuario: {
      nombre: "",
      apellido: "",
      correo: "",
      contrasena: "",
      telefono: "",
      rol: "",
    },
    usuarios: [],
  }),

  actions: {
    async fetchConferenciasUsuario(idusuario) {
      try {
        const response = await axios.get(
          `${RutaApi}usuarios/conferencia/${idusuario}`
        );
        
        // Verificar estructura de respuesta
        console.log('Respuesta completa:', response); 
        
        // Acceder a la propiedad data de la respuesta
        return response.data; // <- Cambio clave aquí
        
      } catch (error) {
        console.error("Error al obtener conferencias:", error);
        throw error;
      }
    },
    async cancelarConferenciasConferencista(idusuario) {
      try {
        const response = await axios.put(
          `${RutaApi}conferencias/cancelar-por-conferencista/${idusuario}`
        );
        return response.data;
      } catch (error) {
        console.error("Error al cancelar conferencias:", error);
        throw error;
      }
    },
    async fetchUsuarios() {
      try {
        const response = await axios.get(
          `${RutaApi}usuarios`
        );
        console.log("response", response.data)
        this.usuarios = response.data;
        return this.usuarios;
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    },

    async registrarUsuario(usuario) {
      console.log("usuario que está llegando: ", usuario)
      try {
        const response = await axios.post(
          `${RutaApi}usuarios`,
          usuario
        );
        this.usuarios.push(response.data);
        return response.data;
      } catch (error) {
        console.error("Error al registrar usuario:", error);
        throw error;
      }
    },
    async updateUsuario(usuario) {
      try {
        const response = await axios.put(`${RutaApi}usuarios/${usuario.idusuario}`, usuario);
        console.log('Usuario actualizado:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
      }
    },

    async updateUsuarioRole(id, role) {
      try {
        const response = await axios.put(
          `${RutaApi}usuarios/role/${id}`,
          { role }
        );
        console.log('Rol actualizado:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error al actualizar el rol:', error);
        throw error;
      }
    },

    async deleteUsuario(id) {
      try {
        await axios.delete(`${RutaApi}usuarios/${id}`);
        this.usuarios = this.usuarios.filter(user => user.id !== id);
        console.log('Usuario eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        throw error;
      }
    }

  },
});