import { defineStore } from "pinia";
import axios from "axios";
import { RutaApi } from "@/assets/apiConfig";

export const useCategoriaStore = defineStore("categorias", {
    state: () => ({
        categorias: [],
    }),
    actions: {
        async obtenerCategorias() {
        try {
            const response = await axios.get(`${RutaApi}tema`);
            this.categorias = response.data.map(cat => ({
                id: cat.idtema,
                nombre: cat.nombre,
                editando: false,
                nombreEditado: cat.nombre,
            }));          
        } catch (error) {
            console.error("Error al obtener categorías", error);
        }
        },
        async agregarCategoria(nombre) {
        try {
            const response = await axios.post(`${RutaApi}tema`, { nombre });
            if (response.data && response.data.id) {
                this.categorias.push({ id: response.data.id, nombre, editando: false, nombreEditado: nombre });
            } else {
                console.error("Error: No se recibió un ID válido al agregar categoría", response.data);
            }          
        } catch (error) {
            console.error("Error al agregar la categoría", error);
        }
        },
        async actualizarCategoria(id, nombreEditado) {
        try {
            await axios.put(`${RutaApi}tema/${id}`, { nombre: nombreEditado });
            const categoria = this.categorias.find(cat => cat.id === id);
            if (categoria) {
            categoria.nombre = nombreEditado;
            categoria.editando = false;
            }
        } catch (error) {
            console.error("Error al modificar la categoría", error);
        }
        },
        async eliminarCategoria(id) {
        try {
            await axios.delete(`${RutaApi}tema/${id}`);
            this.categorias = this.categorias.filter(cat => cat.id !== id);
        } catch (error) {
            console.error("Error al eliminar la categoría", error);
        }
        },
    },
});