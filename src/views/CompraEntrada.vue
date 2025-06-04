<template>
  <div class="ticket-purchase">
    <h1>{{ evento.titulo }}</h1>
    <p class="event-info">
      <span>{{ formatDate(evento.fecha) }}</span> •
      <span>{{ evento.hora }}</span> •
      <span>{{ evento.ubicacion }}</span>
    </p>

    <div class="sectors-container">
      <!-- Imagen del evento -->
      <div
        style="position: relative; width: 100%; height: 300px; padding-top: 125.0000%; padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden; border-radius: 8px; will-change: transform;">
        <iframe loading="lazy"
          style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;"
          :src="evento.link" allowfullscreen="allowfullscreen" allow="fullscreen">
        </iframe>
      </div>

      <h2>Selecciona tu sector</h2>

      <div class="sectors-grid">
        <div v-for="(sector, name) in sectores" :key="name" class="sector-card"
          :style="{ 'border-color': sector.color, 'background-color': `${sector.color}20` }" @click="selectSector(name)"
          :class="{ 'selected': selectedSector === name }">
          <h3>{{ name.toUpperCase() }}</h3>
          <p>Precio: ${{ sector.precio }}</p>
          <p>Cantidad: {{ sector.cantidad }} asientos</p>
          <div class="color-sample" :style="{ 'background-color': sector.color }"></div>
        </div>
      </div>

      <div v-if="selectedSector" class="quantity-selector">
        <label>Cantidad de tickets:</label>
        <input type="number" v-model.number="ticketQuantity" min="1" :max="sectores[selectedSector].cantidad">
        <p>Total: ${{ (sectores[selectedSector].precio * ticketQuantity).toFixed(2) }}</p>
      </div>

      <button @click="showPaymentForm = true" class="checkout-btn" :disabled="!selectedSector || ticketQuantity < 1">
        Proceder al Pago
      </button>
    </div>

    <!-- Formulario de Pago -->
    <div v-if="showPaymentForm" class="payment-modal">
      <div class="payment-container">
        <button class="close-btn" @click="showPaymentForm = false">×</button>
        <h2 class="payment-title">🔒 Pago Seguro</h2>

        <div class="form-group">
          <label for="billing-name">Nombre del titular</label>
          <input id="billing-name" v-model="billingName" type="text" placeholder="Juan Pérez" class="form-input"
            required />
        </div>

        <div class="form-group">
          <label for="billing-email">Email (opcional)</label>
          <input id="billing-email" v-model="billingEmail" type="email" placeholder="juan@ejemplo.com"
            class="form-input" />
        </div>

        <label for="card-number-element">Número de tarjeta</label>
        <div id="card-number-element" class="stripe-element"></div>

        <div class="row">
          <div class="column">
            <label for="card-expiry-element">MM / YY</label>
            <div id="card-expiry-element" class="stripe-element"></div>
          </div>
          <div class="column">
            <label for="card-cvc-element">CVC</label>
            <div id="card-cvc-element" class="stripe-element"></div>
          </div>
        </div>

        <button @click="handlePay" :disabled="processingPayment" class="pay-button">
          {{ processingPayment ? 'Procesando...' : '💳 Pagar Ahora' }}
        </button>
      </div>
    </div>

    <!-- Ticket Preview -->
    <div v-if="generatedTicket" class="ticket-preview">
      <h2>Tu Ticket</h2>
      <button @click="downloadTicket" class="download-btn">Descargar Ticket</button>

      <div class="ticket-container" ref="ticketContainer">
        <main class="ticket">
          <section class="ticket-sub">
            <h3>Admit One</h3>
            <p>{{ generatedTicket.ticketNumber }}</p>
          </section>
          <section class="ticket-main">
            <section class="ticket-seat">
              <h3>{{ selectedSector.toUpperCase() }} <span>${{ sectores[selectedSector].precio }}</span></h3>
              <div class="ticket-seat-box">
                <p>Sector</p>
                <h4>{{ selectedSector }}</h4>
              </div>
              <div class="ticket-seat-box">
                <p>Cantidad</p>
                <h4>{{ ticketQuantity }}</h4>
              </div>
              <div class="ticket-seat-box">
                <p>QR Code</p>
                <h4><img :src="generatedTicket.qrCode" alt="QR Code" class="qr-code"></h4>
              </div>
            </section>
            <section class="ticket-info">
              <div class="ticket-info-brand">
                <h3>{{ evento.titulo }}</h3>
              </div>
              <div class="ticket-info-date">
                <p>{{ formatDate(evento.fecha) }}, {{ evento.hora }}</p>
              </div>
              <div class="ticket-info-venue">
                <span>Ubicación</span>
                <span>{{ evento.ubicacion }}</span>
              </div>
              <div class="ticket-info-misc">
                <p>ID: {{ generatedTicket.ticketId }}</p>
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import { loadStripe } from '@stripe/stripe-js'
import Swal from 'sweetalert2';

const stripePromise = loadStripe('pk_test_51RVixgFdzS9BTYBIRu2ywCDJIbG07BZMla226F7d3eV73ObFNBjTLemnPEV91Ed6JsbQ48FovcV4R5s0zciVgGXr00KGbVmZlj')

export default {
  name: 'TicketPurchaseBySector',
  data() {
    return {
      stripe: null,
      elements: null,
      cardNumber: null,
      cardExpiry: null,
      cardCvc: null,
      processingPayment: false,
      showPaymentForm: false,
      billingName: '',
      billingEmail: '',
      evento: {
        idevento: 1,
        titulo: 'Concierto Ejemplo',
        descripcion: 'Descripción del evento',
        fecha: '2023-12-15',
        hora: '20:00:00',
        dia: 'Viernes',
        link: 'https://www.canva.com/design/DAGpQKQdF_E/iDwJkg2zA0S8yWZzRvVafw/view',
        estado: 1,
        idusuario: 1,
        categorias: [],
        cantidadtickets: 500,
        ubicacion: 'Teatro Principal',
        numeracionasiento: false,
        precios: {
          vip: { color: '#ff5722', cantidad: 100, precio: 150.00 },
          general: { color: '#4caf50', cantidad: 300, precio: 80.00 },
          palco: { color: '#2196f3', cantidad: 50, precio: 250.00 },
          balcon: { color: '#9c27b0', cantidad: 50, precio: 120.00 }
        }
      },
      selectedSector: null,
      ticketQuantity: 1,
      generatedTicket: null,
    }
  },
  watch: {
    showPaymentForm(newVal) {
      if (newVal) {
        // Asegurar que el DOM esté listo antes de montar
        this.$nextTick(() => {
          setTimeout(() => {
            this.mountStripeElements()
          }, 100) // Pequeño delay para asegurar renderizado
        })
      } else {
        // Limpiar elementos cuando se cierra el modal
        this.unmountStripeElements()
      }
    }
  },
  async mounted() {
    try {
      this.stripe = await loadStripe('pk_test_51RVixgFdzS9BTYBIRu2ywCDJIbG07BZMla226F7d3eV73ObFNBjTLemnPEV91Ed6JsbQ48FovcV4R5s0zciVgGXr00KGbVmZlj')
      if (this.stripe) {
        this.elements = this.stripe.elements()
        console.log('Stripe inicializado correctamente')
      }
    } catch (error) {
      console.error('Error inicializando Stripe:', error)
    }
  },
  computed: {
    sectores() {
      return this.evento.precios || {};
    },
    cardType() {
      const number = this.paymentData.cardNumber.replace(/\s/g, '');
      if (/^4/.test(number)) return 'visa';
      if (/^5[1-5]/.test(number)) return 'mastercard';
      if (/^3[47]/.test(number)) return 'amex';
      return '';
    }
  },
  methods: {
    async mountStripeElements() {
      try {
        console.log('Intentando montar elementos de Stripe...')

        // Verificar que Stripe esté inicializado
        if (!this.stripe || !this.elements) {
          console.error('Stripe no está inicializado')
          return
        }

        // Verificar que los elementos del DOM existan
        const cardNumberElement = document.getElementById('card-number-element')
        const cardExpiryElement = document.getElementById('card-expiry-element')
        const cardCvcElement = document.getElementById('card-cvc-element')

        if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
          console.error('Elementos del DOM no encontrados')
          console.log('card-number-element:', cardNumberElement)
          console.log('card-expiry-element:', cardExpiryElement)
          console.log('card-cvc-element:', cardCvcElement)
          return
        }

        this.unmountStripeElements()

        const style = {
          base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: 'Arial, sans-serif',
            padding: '12px',
            '::placeholder': {
              color: '#a0aec0'
            }
          },
          invalid: {
            color: '#e3342f'
          }
        }

        this.cardNumber = this.elements.create('cardNumber', {
          style,
          showIcon: true
        })
        this.cardExpiry = this.elements.create('cardExpiry', { style })
        this.cardCvc = this.elements.create('cardCvc', { style })

        this.cardNumber.mount('#card-number-element')
        this.cardExpiry.mount('#card-expiry-element')
        this.cardCvc.mount('#card-cvc-element')

        this.cardNumber.on('change', this.handleStripeChange)
        this.cardExpiry.on('change', this.handleStripeChange)
        this.cardCvc.on('change', this.handleStripeChange)

        console.log('Elementos de Stripe montados correctamente')

      } catch (error) {
        console.error('Error montando elementos de Stripe:', error)
      }
    },
    unmountStripeElements() {
      try {
        if (this.cardNumber) {
          this.cardNumber.unmount()
          this.cardNumber = null
        }
        if (this.cardExpiry) {
          this.cardExpiry.unmount()
          this.cardExpiry = null
        }
        if (this.cardCvc) {
          this.cardCvc.unmount()
          this.cardCvc = null
        }
        console.log('Elementos de Stripe desmontados')
      } catch (error) {
        console.error('Error desmontando elementos:', error)
      }
    },
    handleStripeChange(event) {
      if (event.error) {
        console.error('Error en elemento Stripe:', event.error.message)
      }
    },
    async handlePay() {
      this.processingPayment = true

      try {
        const { paymentMethod, error } = await this.stripe.createPaymentMethod({
          type: 'card',
          card: this.cardNumber,
          billing_details: {
            name: this.billingName || 'Cliente',
            email: this.billingEmail || null,
          }
        })

        if (error) {
          console.error('Error de Stripe:', error)
          this.showErrorMessage('Error en los datos de la tarjeta: ' + error.message)
          return
        }

        console.log('PaymentMethod creado:', paymentMethod.id)

        const paymentData = {
          paymentMethodId: paymentMethod.id,
          monto: (this.sectores[this.selectedSector].precio * this.ticketQuantity).toFixed(2),
          identrada: 1
        }

        console.log('Enviando datos al backend:', paymentData)

        const response = await this.sendPaymentToBackend(paymentData)

        if (response.success) {
          this.showSuccessMessage('¡Pago procesado exitosamente!')
          this.generatedTicket = response.pago
          this.showPaymentForm = false

          this.resetPaymentForm()
        } else {
          this.showErrorMessage('Error al procesar el pago: ' + response.message)
        }

      } catch (err) {
        console.error('Error inesperado:', err)
        this.showErrorMessage('Error inesperado: ' + err.message)
      } finally {
        this.processingPayment = false
      }
    },
    async sendPaymentToBackend(paymentData) {
      try {
        const response = await fetch('http://localhost:3001/api/pagos/pagar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData)
        });

        const contentType = response.headers.get('content-type');

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;

          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          }

          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('Respuesta del backend:', result);
        return result;

      } catch (error) {
        console.error('Error enviando al backend:', error);
        throw error;
      }
    },
    resetPaymentForm() {
      this.selectedSector = null
      this.ticketQuantity = 1
      this.billingName = ''
      this.billingEmail = ''

      if (this.cardNumber) {
        this.cardNumber.clear()
      }
      if (this.cardExpiry) {
        this.cardExpiry.clear()
      }
      if (this.cardCvc) {
        this.cardCvc.clear()
      }
    },
    showSuccessMessage(message) {
      alert(message)
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: message,
        confirmButtonColor: '#4caf50'
      })
    },

    showErrorMessage(message) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonColor: '#f44336'
      })
    },
    validatePaymentForm() {
      if (!this.selectedSector) {
        this.showErrorMessage('Por favor selecciona un sector')
        return false
      }

      if (this.ticketQuantity < 1) {
        this.showErrorMessage('La cantidad debe ser mayor a 0')
        return false
      }

      if (!this.billingName.trim()) {
        this.showErrorMessage('Por favor ingresa el nombre del titular')
        return false
      }

      return true
    },
    async handlePayWithValidation() {
      if (!this.validatePaymentForm()) {
        return
      }

      await this.handlePay()
    },
    selectSector(sectorName) {
      this.selectedSector = sectorName;
      this.ticketQuantity = 1;
      this.generatedTicket = null;
    },
    generateTicket() {
      if (!this.selectedSector || this.ticketQuantity < 1) return;

      const ticketId = this.generateUniqueId();
      const qrCode = this.generateQRCode(ticketId);

      this.generatedTicket = {
        ticketId,
        ticketNumber: this.generateTicketNumber(),
        qrCode,
        sector: this.selectedSector,
        quantity: this.ticketQuantity,
        price: this.sectores[this.selectedSector].precio,
        total: (this.sectores[this.selectedSector].precio * this.ticketQuantity).toFixed(2),
        email: this.paymentData.email
      };

      // Aquí podrías enviar los datos al servidor para guardar la compra
      // this.saveTicketPurchase();
    },
    generateUniqueId() {
      return 'TK-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
    },
    generateTicketNumber() {
      return Math.floor(10000000 + Math.random() * 90000000).toString();
    },
    generateQRCode(data) {
      const qrSize = 100;
      const qrColor = this.sectores[this.selectedSector].color;
      return `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(data)}&color=${qrColor.replace('#', '')}`;
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    },
    async downloadTicket() {
      if (!this.generatedTicket) return;

      const element = this.$refs.ticketContainer;

      const opt = {
        margin: 0,
        filename: `ticket-${this.generatedTicket.ticketNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
    },
    async saveTransaction() {
      // Aquí iría la lógica para guardar la transacción en tu backend
      // const transaction = {
      //   idevento: this.evento.idevento,
      //   idusuario: 1, // Obtener del usuario autenticado
      //   sector: this.selectedSector,
      //   cantidad: this.ticketQuantity,
      //   total: this.sectores[this.selectedSector].precio * this.ticketQuantity,
      //   email: this.paymentData.email,
      //   tarjeta: '****' + this.paymentData.cardNumber.slice(-4),
      //   estado: 'completado'
      // };
      // await fetch('/api/transacciones', { method: 'POST', body: JSON.stringify(transaction) });
    }
  }
}
</script>

<style scoped>
#card-element {
  background-color: white;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 16px;
}

.payment-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #2d3748;
}

label {
  font-weight: 600;
  font-size: 14px;
  margin-top: 12px;
  display: block;
  color: #4a5568;
}

.stripe-element {
  border: 1px solid #cbd5e0;
  padding: 10px 12px;
  border-radius: 6px;
  background-color: #f7fafc;
  margin-top: 5px;
  margin-bottom: 16px;
}

.row {
  display: flex;
  gap: 16px;
}

.column {
  flex: 1;
}

.pay-button {
  background-color: #4CAF50;
  color: white;
  font-size: 16px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
  margin-top: 16px;
}

.pay-button:hover {
  background-color: #45a049;
}

.pay-button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.ticket-purchase {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
}

.event-info {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.sectors-container {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sectors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.sector-card {
  padding: 1.5rem;
  border: 3px solid;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sector-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.sector-card.selected {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border-width: 4px;
}

.color-sample {
  width: 100%;
  height: 20px;
  border-radius: 4px;
  margin-top: 10px;
}

.quantity-selector {
  margin: 2rem 0;
  padding: 1rem;
  background: #f0f8ff;
  border-radius: 8px;
}

.quantity-selector input {
  margin: 0 1rem;
  padding: 0.5rem;
  width: 60px;
  text-align: center;
  font-size: 1rem;
}

.checkout-btn {
  background: #15964e;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.checkout-btn:hover {
  background: #0d7a3d;
}

.checkout-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

/* Estilos del Modal de Pago */
.payment-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.payment-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.payment-form {
  margin-top: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.card-icons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.card-icons img {
  height: 30px;
  opacity: 0.3;
  transition: opacity 0.3s;
}

.card-icons img.active {
  opacity: 1;
}

.summary {
  margin: 2rem 0;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.summary .total {
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 0.5rem;
}

.pay-btn {
  background: #2196f3;
  color: white;
  border: none;
  padding: 1rem;
  width: 100%;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.pay-btn:hover {
  background: #0d8aee;
}

.pay-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

/* Estilos del Ticket */
.ticket-preview {
  margin-top: 3rem;
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.download-btn {
  background: #2196f3;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: background 0.2s;
}

.download-btn:hover {
  background: #0d8aee;
}

.ticket-container {
  display: flex;
  justify-content: center;
  background-color: #263238;
  padding: 20px;
}

.ticket {
  background-color: #9fa8da;
  color: #3949ab;
  width: 600px;
  height: auto;
  display: grid;
  grid-template-columns: 106px calc(100% - 106px);
  font-family: 'Roboto', sans-serif;
}

.ticket-sub {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  text-align: center;
  padding: 10px 10px;
  border-right: 6px dotted #263238;
  position: relative;
  z-index: 1;
}

.ticket-sub::before,
.ticket-sub::after {
  background-color: #263238;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  content: "";
  position: absolute;
  z-index: 2;
  top: -14px;
  right: -14px;
}

.ticket-sub::after {
  top: unset;
  bottom: -14px;
}

.ticket-sub h3 {
  font-size: 30px;
  padding: 10px 8px 10px 4px;
  background: #5c6bc0;
  color: white;
}

.ticket-sub h3::before,
.ticket-sub h3::after {
  background-color: #263238;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  content: "";
  position: absolute;
  z-index: 2;
  top: -18px;
  left: -22px;
}

.ticket-sub h3::after {
  top: unset;
  bottom: -18px;
}

.ticket-sub p {
  font-size: 18px;
  letter-spacing: 8px;
  font-weight: 500;
  padding: 14px 4px 14px 0;
  text-align: center;
}

.ticket-sub p::before {
  content: "";
  width: 2px;
  height: 100%;
  position: absolute;
  top: 0;
  right: calc(100% - 3px);
  border-right: dotted 5px #263238;
}

.ticket-sub p::after {
  content: "";
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  box-shadow: inset 0 0 0 2px #3949ab;
  position: absolute;
  top: 10px;
  left: 10px;
}

.ticket-main {
  padding: 10px;
  display: grid;
  grid-template-columns: 23% 77%;
}

.ticket-seat {
  display: grid;
  grid-template-areas:
    "suba head"
    "subb head"
    "subc head";
  box-shadow: inset 0 0 0 2px #3949ab;
}

.ticket-seat>h3 {
  grid-area: head;
  height: 100%;
  writing-mode: vertical-rl;
  text-orientation: sideways;
  padding: 12px 10px 12px 2px;
  background-color: #5c6bc0;
  color: white;
  position: relative;
  z-index: 1;
  padding-bottom: 80px;
  border-top: 2px solid #3949ab;
  border-bottom: 2px solid #3949ab;
}

.ticket-seat>h3 span {
  position: absolute;
  bottom: 0;
  right: calc(50% + 1px);
  width: 100%;
  color: white;
  padding: 10px 4px;
  font-size: 1.6em;
  z-index: 2;
  transform: translateX(50%);
}

.ticket-seat>.ticket-seat-box:nth-of-type(1) {
  grid-area: suba;
}

.ticket-seat>.ticket-seat-box:nth-of-type(2) {
  grid-area: subb;
}

.ticket-seat>.ticket-seat-box:nth-of-type(3) {
  grid-area: subc;
}

.ticket-seat>.ticket-seat-box {
  writing-mode: vertical-rl;
  text-orientation: sideways;
  text-align: center;
}

.ticket-seat>.ticket-seat-box:not(:last-child) {
  border-bottom: 2px solid #3949ab;
}

.ticket-seat>.ticket-seat-box p {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
  padding-right: 4px;
}

.ticket-seat>.ticket-seat-box h4 {
  font-weight: 1000;
  font-size: 32px;
  line-height: 32px;
  padding-top: 6px;
}

.ticket-info {
  padding-left: 10px;
  text-align: center;
  display: grid;
  grid-template-areas:
    "brand"
    "date"
    "venue"
    "misc";
  box-shadow: inset 0 0 0 2px #3949ab;
}

.ticket-info>div:not(:nth-last-child(-n + 2)) {
  border-bottom: 2px dashed #3949ab;
}

.ticket-info .ticket-info-brand {
  grid-area: brand;
  align-self: center;
  padding: 0 10px 8px;
  font-size: 26px;
  border-bottom: 2px dashed #3949ab;
}

.ticket-info .ticket-info-date {
  grid-area: date;
  font-size: 22px;
  line-height: 12px;
  padding: 24px 10px 2px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 3px;
  background-color: #5c6bc0;
  color: white;
  margin-top: -12px;
  border-left: 2px solid #3949ab;
  border-right: 2px solid #3949ab;
}

.ticket-info .ticket-info-venue {
  grid-area: venue;
  align-self: center;
  padding: 2px 8px 12px;
}

.ticket-info .ticket-info-venue span {
  font-size: 16px;
}

.ticket-info .ticket-info-venue span:last-child {
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
  padding-left: 10px;
}

.ticket-info .ticket-info-misc {
  grid-area: misc;
  font-size: 10px;
  align-self: center;
  font-weight: 400;
  letter-spacing: 6px;
}

.qr-code {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

/* Responsive */
@media (max-width: 768px) {
  .sectors-grid {
    grid-template-columns: 1fr;
  }

  .ticket {
    grid-template-columns: 80px calc(100% - 80px);
  }

  .ticket-main {
    grid-template-columns: 30% 70%;
  }

  .payment-container {
    width: 90%;
    padding: 1.5rem;
  }
}
</style>