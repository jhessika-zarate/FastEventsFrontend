<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content" @click.stop>
      <!-- Contenedor de detalles / edición -->
      <div class="detalles">
        <h2 class="title">
          {{ editable ? "Editar Evento" : "Detalles del Evento" }}
        </h2>

        <div class="detail-item">
          <label>Título</label>
          <div v-if="editable">
            <input
              v-model="editableEvento.titulo"
              type="text"
              class="input-field"
            />
          </div>
          <p v-else class="detail-content">{{ evento?.titulo }}</p>
        </div>

        <div class="detail-item">
          <label>Descripción</label>
          <div v-if="editable">
            <textarea
              v-model="editableEvento.descripcion"
              rows="3"
              class="input-field"
            ></textarea>
          </div>
          <p v-else class="detail-content">{{ evento?.descripcion }}</p>
        </div>

        <div class="detail-item">
          <label>Fecha</label>
          <div v-if="editable">
            <input
              v-model="editableEvento.fecha"
              type="date"
              class="input-field"
            />
          </div>
          <p v-else class="detail-content">{{ formattedDate }}</p>
        </div>

        <div class="detail-item">
          <label>Hora</label>
          <div v-if="editable">
            <input
              v-model="editableEvento.hora"
              type="time"
              class="input-field"
            />
          </div>
          <p v-else class="detail-content">{{ evento?.hora }}</p>
        </div>

        <div class="detail-item">
          <label>Día</label>
          <div v-if="editable">
            <input
              v-model="editableEvento.dia"
              type="text"
              class="input-field"
            />
          </div>
          <p v-else class="detail-content">{{ evento?.dia }}</p>
        </div>

        <div class="detail-item">
          <label>Link</label>
          <div v-if="editable">
            <input
              v-model="editableEvento.link"
              type="url"
              class="input-field"
            />
          </div>
          <a
            v-else
            class="detail-content"
            :href="evento?.link"
            target="_blank"
            rel="noopener"
            >{{ evento?.link }}</a
          >
        </div>

        <div class="detail-item">
          <label>Estado</label>
          <div v-if="editable">
            <select v-model="editableEvento.estado" class="input-field">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <p v-else class="detail-content">{{ evento?.estado }}</p>
        </div>

        <div class="detail-item">
          <label>ID Usuario</label>
          <p class="detail-content">{{ evento?.idusuario }}</p>
        </div>

        <div class="detail-item">
          <label>Categorías</label>
          <div v-if="editable">
            <textarea
              v-model="editableCategorias"
              rows="3"
              class="input-field"
            ></textarea>
            <small class="help-text">Separar categorías por coma</small>
          </div>
          <pre v-else class="detail-content">{{
            JSON.stringify(evento?.categorias, null, 2)
          }}</pre>
        </div>

        <div class="detail-item">
          <label>Cantidad de Tickets</label>
          <div v-if="editable">
            <input
              v-model.number="editableEvento.cantidadtickets"
              type="number"
              min="0"
              class="input-field"
            />
          </div>
          <p v-else class="detail-content">{{ evento?.cantidadtickets }}</p>
        </div>

        <div class="detail-item">
          <label>Ubicación</label>
          <div v-if="editable">
            <input
              v-model="editableEvento.ubicacion"
              type="text"
              class="input-field"
            />
          </div>
          <p v-else class="detail-content">{{ evento?.ubicacion }}</p>
        </div>

        <div class="detail-item">
          <label>Numeración de Asiento</label>
          <div v-if="editable">
            <input type="checkbox" v-model="editableEvento.numeracionasiento" />
          </div>
          <p v-else class="detail-content">
            {{ evento?.numeracionasiento ? "Sí" : "No" }}
          </p>
        </div>

        <div class="detail-item" v-if="evento?.precios || editable">
          <label>Precios</label>
          <div v-if="editable">
            <textarea
              v-model="editablePrecios"
              rows="3"
              class="input-field"
            ></textarea>
            <small class="help-text">Ingrese precios en formato JSON</small>
          </div>
          <pre v-else class="detail-content">{{
            JSON.stringify(evento?.precios, null, 2)
          }}</pre>
          <div v-if="editable" class="price-form" >
            <div style="display: flex;"> <div class="detail-item">
              <label>Nombre del tipo</label>
              <input
                v-model="nuevoPrecio.nombre"
                type="text"
                class="input-field"
              />
            </div>
            <div class="detail-item">
              <label>Color</label>
              <input
                v-model="nuevoPrecio.color"
                type="color"
                class="input-field"
              />
            </div>
            <div class="detail-item">
              <label>Cantidad</label>
              <input
                v-model.number="nuevoPrecio.cantidad"
                type="number"
                class="input-field"
              />
            </div>
            <div class="detail-item">
              <label>Precio</label>
              <input
                v-model.number="nuevoPrecio.precio"
                type="number"
                step="0.01"
                class="input-field"
              />
            </div></div>
           
            <button type="button" @click="agregarPrecio" class="save-btn mt-2">
              Agregar Precio
            </button>
          </div>
                  <!-- Mostrar tabla de precios solo cuando no está en modo edición -->
<table v-if="!editable && evento?.precios" class="price-table">
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Color</th>
      <th>Cantidad</th>
      <th>Precio</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(info, nombre) in evento.precios" :key="nombre">
      <td>{{ nombre }}</td>
      <td>
        <div
          class="color-box"
          :style="{ backgroundColor: info.color }"
        ></div>
        <span class="color-code">{{ info.color }}</span>
      </td>
      <td>{{ info.cantidad }}</td>
      <td>{{ info.precio }}</td>
    </tr>
  </tbody>
</table>
        </div>



        <div class="modal-actions">
          <button v-if="editable" type="button" @click="save" class="save-btn">
            Guardar
          </button>
          <button class="close-btn" type="button" @click="$emit('close')">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    evento: {
      type: Object,
      required: false,
      default: null, // null si es creación
    },
    editable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editableEvento: this.evento
        ? { ...this.evento }
        : {
            // valores iniciales para crear un evento nuevo
            titulo: "",
            descripcion: "",
            fecha: "",
            hora: "",
            dia: "",
            link: "",
            estado: "activo",
            idusuario: "", // o algún valor por defecto
            categorias: [],
            cantidadtickets: 0,
            ubicacion: "",
            numeracionasiento: false,
            precios: {},
          },
      editableCategorias: this.evento?.categorias?.join(", ") || "",
      editablePrecios: this.evento
        ? JSON.stringify(this.evento.precios || {}, null, 2)
        : "{}",
      nuevoPrecio: {
        nombre: "",
        color: "#ff5722",
        cantidad: 0,
        precio: 0,
      },
    };
  },
  computed: {
    formattedDate() {
      if (!this.evento?.fecha) return "";
      const date = new Date(this.evento?.fecha + "T00:00:00");
      return date.toLocaleDateString("es-ES", {
        timeZone: "America/La_Paz",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },
    modalTitle() {
      return this.evento
        ? this.editable
          ? "Editar Evento"
          : "Detalles del Evento"
        : "Crear Evento";
    },
  },
  methods: {
    save() {
      // Procesar categorias
      const categoriasArray = this.editableCategorias
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat.length > 0);

      // Procesar precios
      let preciosObj = {};
      try {
        preciosObj = JSON.parse(this.editablePrecios);
      } catch (e) {
        alert("Formato JSON inválido en Precios");
        return;
      }

      // Emitir evento con datos
      this.$emit("save", {
        ...this.editableEvento,
        categorias: categoriasArray,
        precios: preciosObj,
      });
    },
    agregarPrecio() {
      const { nombre, color, cantidad, precio } = this.nuevoPrecio;

      if (!nombre || cantidad <= 0 || precio <= 0) {
        alert(
          "Complete correctamente todos los campos para agregar un precio."
        );
        return;
      }

      // Agregar al objeto de precios con el nombre como clave
      this.editableEvento.precios[nombre] = { color, cantidad, precio };

      // Actualizar string editable para reflejar en textarea
      this.editablePrecios = JSON.stringify(
        this.editableEvento.precios,
        null,
        2
      );

      // Limpiar campos
      this.nuevoPrecio = {
        nombre: "",
        color: "#ff5722",
        cantidad: 0,
        precio: 0,
      };
    },
  },
  watch: {
    evento(newVal) {
      if (newVal) {
        this.editableEvento = { ...newVal };
        this.editableCategorias = newVal?.categorias?.join(", ") || "";
        this.editablePrecios = JSON.stringify(newVal.precios || {}, null, 2);
      } else {
        // Si no hay evento (creación), reiniciar
        this.editableEvento = {
          titulo: "",
          descripcion: "",
          fecha: "",
          hora: "",
          dia: "",
          link: "",
          estado: "activo",
          idusuario: "",
          categorias: [],
          cantidadtickets: 0,
          ubicacion: "",
          numeracionasiento: false,
          precios: {},
        };
        this.editableCategorias = "";
        this.editablePrecios = "{}";
      }
    },
  },
};
</script>

<style scoped>
/* Fondo del modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* Contenedor del modal */
.modal-content {
  color: white;
  border-radius: 15px;
  width: 80%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 20px 50px rgba(0, 0, 0, 0.15);
  transform: translateY(-100px);
  animation: slideIn 0.8s ease-out forwards;
}

@keyframes slideIn {
  0% {
    transform: translateY(-100px);
  }
  100% {
    transform: translateY(0);
  }
}

/* Estilo de los detalles */
.detalles {
  padding: 25px;
  flex-grow: 1;
  text-align: left;
  font-family: "Arial", sans-serif;
  background-color: #ffffff;
  border-radius: 15px;
  margin-top: 0px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  color: #2c3e50;
}

h2.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 25px;
  text-align: center;
  text-transform: uppercase;
}

.detail-item {
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #34495e;
}

.detail-content {
  font-size: 1rem;
  color: #555;
  margin-top: 5px;
  white-space: pre-wrap; /* Para mostrar JSON bien formateado */
}

.modal-actions {
  margin-top: 15px;
}

.close-btn {
  background-color: #f44336;
  color: white;
  padding: 1rem;
  font-size: 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  border: none;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.close-btn:hover {
  background-color: #d32f2f;
  transform: scale(1.05);
}

.close-btn:active {
  transform: scale(0.95);
}

.save-btn {
  background-color: #00be10;
  color: white;
  padding: 1rem;
  font-size: 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  border: none;
  margin-bottom: 1rem;
}
/* Estilos para inputs, textarea, select */
.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 2px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  font-family: inherit;
  color: #2c3e50;
  background-color: #fff;
  box-sizing: border-box;
  outline: none;
}

.input-field:focus {
  border-color: #2575fc;
  box-shadow: 0 0 5px rgba(37, 117, 252, 0.5);
}

/* Textarea con altura automática pero limitada */
textarea.input-field {
  resize: vertical;
  min-height: 80px;
  max-height: 200px;
  font-family: inherit;
}

/* Select con mismo estilo */
select.input-field {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2210%22%20height%3D%227%22%20viewBox%3D%220%200%2010%207%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200l5%207%205-7z%22%20fill%3D%22%232575fc%22/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 10px 7px;
  padding-right: 2rem;
  cursor: pointer;
}

/* Checkbox estilizado simple */
input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  border: 2px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease, background-color 0.3s ease;
  vertical-align: middle;
  margin-right: 0.5rem;
  position: relative;
  background-color: white;
}

input[type="checkbox"]:checked {
  background-color: #2575fc;
  border-color: #2575fc;
}

input[type="checkbox"]:checked::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 6px;
  width: 4px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Texto de ayuda pequeño */
.help-text {
  font-size: 0.85rem;
  color: #999;
  margin-top: 4px;
  display: block;
}


/* Tabla de precios */
.price-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.95rem;
}

.price-table th,
.price-table td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: center;
}

.color-box {
  width: 20px;
  height: 20px;
  display: inline-block;
  border-radius: 4px;
  margin-right: 0.5rem;
  vertical-align: middle;
}

.color-code {
  font-size: 0.85rem;
  color: #555;
}

</style>
