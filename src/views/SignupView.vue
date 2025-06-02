<template>
  <body>
    <div>
      <form @submit.prevent="handleSubmit">
        <h3>Registrarse</h3>

        <div class="form-grid">
          <Stars
            :height="120"
            :width="10"
            :starCount="80"
            starColor="#f9f0ed"
          />
          <!-- Incluir el componente de estrellas aquí -->

          <!-- Primera columna -->
          <div class="full-width">
            <label for="nombre">Nombre</label>
            <input
              type="text"
              placeholder="Nombre"
              id="nombre"
              v-model="usuario.nombre"
            />
          </div>
          <div class="full-width">
            <label for="apellido">Apellido</label>
            <input
              type="text"
              placeholder="Apellido"
              id="apellido"
              v-model="usuario.apellido"
            />
          </div>
          <div class="full-width">
            <label for="correo">Correo</label>
            <input
              type="text"
              placeholder="Correo"
              id="correo"
              v-model="usuario.correo"
            />
          </div>

          <!-- Última fila en dos columnas -->
          <div style="margin-right: 1rem">
            <label for="contrasena">Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              id="contrasena"
              v-model="usuario.contrasena"
            />
          </div>
          <div>
            <label for="repetirContrasena">Repetir Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              id="repetirContrasena"
              v-model="usuario.repetirContrasena"
            />
          </div>
          <!-- Segunda fila (Rol ocupa toda la fila) -->
          <div>
            <label for="rol">Como desea registrarse</label>
            <select id="rol" v-model="usuario.rol">
              <option value="" disabled selected>Selecciona un rol</option>
              <!-- quiero que las opciones sean del array pero que el valor sea la posiciom-->
              <option
                v-for="(rol, index) in roles"
                :key="index"
                :value="index + 3"
              >
                {{ rol }}
              </option>
            </select>
          </div>
          <div>
            <label for="telefono">Teléfono</label>
            <input
              type="text"
              placeholder="Teléfono"
              id="telefono"
              v-model="usuario.telefono"
            />
            <label class="mensajeTelefono" v-if="!isTelefonoValid"
              >El teléfono debe tener 8 dígitos</label
            >
            <label class="mensajeTelefono" v-if="isTelefonoNumeric"
              >El teléfono debe ser numérico</label
            >
          </div>
        </div>
        <button type="submit">Registrarse</button>
        <span @click="handleClick"> Ya tienes cuenta? Iniciar sesión</span>
      </form>
    </div>
  </body>
</template>

<script>
import Stars from "@/components/Stars.vue"; // Importar el componente de estrellas
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { useUsuarioStore } from "@/stores/usuarioStore";
export default {
  components: {
    Stars, // Registrar el componente de estrellas
  },
  data() {
    return {
      username: "", // Para almacenar el nombre de usuario
      password: "", // Para almacenar la contraseña
      usuario: {
        nombre: "",
        apellido: "",
        correo: "",
        contrasena: "",
        telefono: "",
        rol: "",
      },
      mensaje: "",
      registerUser: useUsuarioStore(),
      roles: ["Conferecista", "Asistente"],
    };
  },
  methods: {
    // Este método maneja la acción de inicio de sesión sin recargar la página
    async handleSubmit() {
      this.mensaje = "";

      if (
        !this.usuario.nombre ||
        !this.usuario.apellido ||
        !this.usuario.correo ||
        !this.usuario.contrasena ||
        !this.usuario.telefono ||
        !this.usuario.rol
      ) {
        Swal.fire({
          title: "Campos vacíos",
          text: "Por favor, llena todos los campos",
          icon: "error",
          confirmButtonText: "Entendido",
          draggable: true,
        });
        return;
      }
      if (this.usuario.contrasena !== this.usuario.repetirContrasena) {
        Swal.fire({
          title: "Las contraseñas no coinciden",
          text: "Por favor, verifica que las contraseñas sean iguales",
          icon: "error",
          confirmButtonText: "Entendido",
          draggable: true,
        });
        return;
      }
      // valida que el telefono sean puros numeros
      if (isNaN(this.usuario.telefono)) {
        Swal.fire({
          title: "El teléfono debe ser numérico",
          text: "Por favor, verifica que el teléfono sea numérico",
          icon: "error",
          confirmButtonText: "Entendido",
          draggable: true,
        });
        return;
      }

      console.log(this.usuario);
      this.isLoading = true;
      if (this.usuario.rol === 3) {
        this.usuario.rol = 0;
        this.mensaje = "Solicitud en proceso";
      } else {
        this.mensaje = "Inicia sesión para continuar";
      }
      try {
        await this.registerUser.registrarUsuario({
          nombre: this.usuario.nombre,
          apellido: this.usuario.apellido,
          correo: this.usuario.correo,
          contrasena: this.usuario.contrasena,
          telefono: this.usuario.telefono,
          rol: this.usuario.rol,
        });

        Swal.fire({
          title: "Usuario registrado exitosamente",
          width: 600,
          padding: "2em",
          color: "#28587B",
          background: "#f9f0ed",
          html: `
    <p style="color: #28587B; font-size: 22px; margin-top:-10px">${this.mensaje}</p>
    <img src="https://cdn-icons-gif.flaticon.com/11781/11781773.gif" 
         style="width: 100px; height: auto; display: block; margin: 10px auto;">
  `,
          backdrop: `rgba(0, 45, 123, 0.4)`,
          showConfirmButton: false,
          timer: 8000,
        });

        this.usuario = {
          nombre: "",
          apellido: "",
          correo: "",
          contrasena: "",
          telefono: "",
          rol: "",
        };
        this.$router.push("/login");
      } catch (error) {
        alert("Error al registrar usuario");
      }
    },
    handleClick() {
      this.$router.push("/login");
    },
  }, // limite de caracteres para usuario.telefono
  computed: {
    isTelefonoValid() {
      return this.usuario.telefono.length <= 8;
    },
    isTelefonoNumeric() {
      return isNaN(this.usuario.telefono);
    },
  },
};
</script>

<style scoped>
/* Aquí va tu estilo para el formulario, sin cambios en el CSS de las estrellas */
body {
  display: flex;
  justify-content: center;
  align-items: center;

  min-width: 100vw;
  margin: 0;

  overflow: hidden;
}

form {
  height: auto;
  width: 500px;
  background-color: #28587b;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
  padding: 15px 35px;
  margin-top: 40px;
  z-index: 2; /* Formulario encima de las estrellas */
}

form * {
  font-family: "Poppins", sans-serif;
  color: #ffffff;
  letter-spacing: 0.5px;
  outline: none;
  border: none;
}

form h3 {
  font-size: 32px;
  font-weight: 500;
  line-height: 12px;
  text-align: center;
}
select {
  display: block;
  height: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 3px;
  padding: 0 10px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 300;
  z-index: 3; /* Input encima de las estrellas */
  position: relative; /* Asegura que el input no interrumpa las estrellas */
}
span {
  display: block;
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

span:hover {
  text-decoration: underline;
  transition: all 0.3s;
}

label {
  display: block;
  margin-top: 30px;
  font-size: 16px;
  font-weight: 500;
}

input {
  display: block;
  height: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 3px;
  padding: 0 10px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 300;
  z-index: 3; /* Input encima de las estrellas */
  position: relative; /* Asegura que el input no interrumpa las estrellas */
}

::placeholder {
  color: #e5e5e5;
}

button {
  margin-top: 50px;
  width: 100%;
  background-color: #ffffff;
  color: #080710;
  padding: 15px 0;
  font-size: 18px;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #efdad1;
  transition: all 0.3s;
  color: #ffffff;
}

@media (max-width: 768px) {
  .stars {
    height: 100%;
  }

  form {
    width: 90%;
    padding: 30px 20px;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.full-width {
  grid-column: span 2;
}

.mensajeTelefono {
  color: red;
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: -15px;
}
</style>
