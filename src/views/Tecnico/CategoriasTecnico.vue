<template>
    <body>
        <div>
            <div class="stars">
                <Stars :height="380" :width="12" :starCount="80" starColor="rgba(156, 195, 255, 0.527)" style="z-index: 0;"/>
            </div>
            <div class="container">
            <h3>Gestión de Categorías</h3>
            
            <form @submit.prevent="agregarCategoria">
                <label for="nombre">Nombre de la Categoría</label>
                <input type="text" v-model="nuevaCategoria" placeholder="Ej. Ciencia y Tecnología" required />
                <button type="submit">Agregar Categoría</button>
            </form>
    
            <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="categoria in categoriaStore.categorias" :key="categoria.id">
                <td>{{ categoria.id }}</td>
                <td v-if="!categoria.editando">{{ categoria.nombre }}</td>
                <td v-else>
                  <input type="text" v-model="categoria.nombreEditado" />
                </td>
                <td>
                  <button v-if="!categoria.editando" @click="editarCategoria(categoria)">✏️</button>
                  <button v-else @click="guardarEdicion(categoria)">✔️</button>
                  <button @click="eliminarCategoria(categoria.id)">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </body>
</template>
  
<script>
    import Stars from "@/components/Stars.vue";
    import { useCategoriaStore } from "@/stores/categoriaStore";
    import Swal from "sweetalert2";
    import { ref, onMounted } from "vue";
    
    export default {
        components: { Stars },
        setup() {
        const categoriaStore = useCategoriaStore();
        const nuevaCategoria = ref("");
    
        onMounted(() => {
            categoriaStore.obtenerCategorias();
        });
    
        const agregarCategoria = async () => {
            if (!nuevaCategoria.value.trim()) return;
            await categoriaStore.agregarCategoria(nuevaCategoria.value);
            nuevaCategoria.value = "";
            Swal.fire("Agregado", "Categoría agregada con éxito", "success");
            categoriaStore.obtenerCategorias();
        };
    
        const editarCategoria = (categoria) => {
            categoria.editando = true;
        };
    
        const guardarEdicion = async (categoria) => {
            if (!categoria.id) {
                console.error("Error: Intentando actualizar una categoría sin ID", categoria);
                return;
            }

            await categoriaStore.actualizarCategoria(categoria.id || categoria.idtema, categoria.nombreEditado);
            Swal.fire("Modificado", "Categoría actualizada con éxito", "success");
            };
    
        const eliminarCategoria = async (id) => {
            if (!id) {
                console.error("Error: Intentando eliminar una categoría sin ID");
                return;
            }

            await categoriaStore.eliminarCategoria(id || categoria.idtema);
            Swal.fire("Eliminado", "Categoría eliminada con éxito", "success");
        };
    
        return {
            categoriaStore,
            nuevaCategoria,
            agregarCategoria,
            editarCategoria,
            guardarEdicion,
            eliminarCategoria,
        };
        },
    };
</script>
  
<style scoped>
    body {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 97vh;
        background-color: #28587b;
        overflow: hidden;
        margin: 0px;
    }
    
    .container {
        margin-top: 20%;
        height: 90%;
        background-color: rgba(156, 195, 255, 0.527);
        padding: 30px;
        border-radius: 10px;
        backdrop-filter: blur(10px);
        box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
        text-align: center;
        z-index: 20;
    }

    label {
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 5px;
        color: white;
        filter: drop-shadow(    2px 2px 2px rgba(0, 0, 0, 0.5));
    }

    h3 {
        font-size: 28px;
        margin-bottom: 20px;
        color: white;filter: drop-shadow(    2px 2px 2px rgba(0, 0, 0, 0.5));
    }
    
    input {
        padding: 10px;
        border-radius: 5px;
        border: none;
        margin-right: 10px;
        margin-left: 10px;
    }
    
    button {
        padding: 8px 12px;
        border-radius: 5px;
        cursor: pointer;
        border: none;
        margin: 5px;
        background-color: #84b7c2;
        color: white;
    }
    
    button:hover {
        transition: 0.3s;
        background-color: white;
        color: #84b7c2;
        transform: scale(1.05);
    }

    .table-container {
        max-height: 530px;
        overflow-y: auto;
        margin-top: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    thead {
        position: sticky;
        top: 0;
        background: #84b7c2;
        color: white;
        z-index: 10;
    }
    
    th, td {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        text-align: center;
    }
</style>
  