<template>
  <body>
    <div>
      <Stars :height="180" :width="12" :starCount="80" starColor="#84B7C2" />
      <!-- Incluir el componente de estrellas aquí -->

      <form @submit.prevent="handleSubmit">
        <h3>Inicio de sesión</h3>

        <label for="username">Usuario</label>
        <input
          type="text"
          placeholder="Usuario"
          id="username"
          v-model="correo"
        />

        <label for="password">Contraseña</label>
        <input
          type="password"
          placeholder="Contraseña"
          id="password"
          v-model="contrasena"
        />

        <button @click="handleClick" type="submit">Iniciar sesión</button>
        <span @click="goToRegister"> No tienes cuenta? Crear cuenta</span>
      </form>
    </div>
  </body>
</template>
<script>
import Stars from "@/components/Stars.vue";
import { useAuthStore } from "@/stores/AuthStore";
import Swal from "sweetalert2/dist/sweetalert2.js";
export default {
  components: {
    Stars,
  },
  data() {
    return {
      correo: "",
      contrasena: "",
      isLoading: false,
      authStore: useAuthStore(),
    };
  },
  mounted() {
    this.authStore.loadUserFromStorage();
  },
  methods: {
    async handleSubmit() {
      if (!this.correo || !this.contrasena) {
        Swal.fire({
          title: "Campos vacíos",
          text: "Por favor, rellene todos los campos",
          icon: "warning",
          confirmButtonText: "Entendido",
          draggable: true,
        });
        return;
      }
      this.isLoading = true;
      try {
        await this.authStore.login(this.correo, this.contrasena);
        console.log("Inicio de sesión exitoso");
        console.log("lo que devuelve", this.authStore.user);
        switch (this.authStore.user.rol) {
          case "0" || 0:
            Swal.fire({
              title: "Su solictud esta siendo procesada",
              text: "Por favor espere a que su solicitud sea aprobada",
              icon: "question",
            });
            break;
          case "1" || 1:
            this.$router.push("/admin/registro/asistente");
            break;
          case "2" || 2:
            this.$router.push("/tecnico/home");
            break;
          case "3" || 3:
            this.$router.push("/conferencista/home");
            break;
          case "4" || 4:
            this.$router.push("/asistente/home");
            break;
          default:
            this.$router.push("/login");
            break;
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Usuario o contraseña incorrectos",
          icon: "error",
          confirmButtonText: "Entendido",
          draggable: true,
        });
      } finally {
        this.isLoading = false;
      }
    },
    goToRegister() {
      this.$router.push("/signup");
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
  min-height: 98vh;
  min-width: 90vw;
  margin: 0;

  overflow: hidden;
}

form {
  height: 420px;
  width: 400px;
  background-color: rgba(255, 255, 255, 0.339);
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
  padding: 50px 35px;
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
  line-height: 42px;
  text-align: center;
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

body {
  background-color: #28587b;
}
</style>
