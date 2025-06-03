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
      <div style="position: relative; width: 100%; height: 300px; padding-top: 125.0000%; padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden; border-radius: 8px; will-change: transform;">
        <iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;" 
                :src="evento.link" allowfullscreen="allowfullscreen" allow="fullscreen">
        </iframe>
      </div>
      
      <h2>Selecciona tu sector</h2>
      
      <div class="sectors-grid">
        <div v-for="(sector, name) in sectores" :key="name" class="sector-card"
             :style="{ 'border-color': sector.color, 'background-color': `${sector.color}20` }"
             @click="selectSector(name)"
             :class="{ 'selected': selectedSector === name }">
          <h3>{{ name.toUpperCase() }}</h3>
          <p>Precio: ${{ sector.precio }}</p>
          <p>Cantidad: {{ sector.cantidad }} asientos</p>
          <div class="color-sample" :style="{ 'background-color': sector.color }"></div>
        </div>
      </div>
      
      <div v-if="selectedSector" class="quantity-selector">
        <label>Cantidad de tickets:</label>
        <input 
          type="number" 
          v-model.number="ticketQuantity" 
          min="1" 
          :max="sectores[selectedSector].cantidad"
        >
        <p>Total: ${{ (sectores[selectedSector].precio * ticketQuantity).toFixed(2) }}</p>
      </div>
      
      <button 
        @click="showPaymentForm = true" 
        class="checkout-btn"
        :disabled="!selectedSector || ticketQuantity < 1"
      >
        Proceder al Pago
      </button>
    </div>
    
    <!-- Formulario de Pago -->
    <div v-if="showPaymentForm" class="payment-modal">
      <div class="payment-container">
        <button class="close-btn" @click="showPaymentForm = false">×</button>
        <h2>Información de Pago</h2>
        
        <form @submit.prevent="processPayment" class="payment-form">
          <div class="form-group">
            <label>Nombre en la Tarjeta</label>
            <input type="text" v-model="paymentData.cardName" required placeholder="Como aparece en la tarjeta">
          </div>
          
          <div class="form-group">
            <label>Número de Tarjeta</label>
            <input 
              type="text" 
              v-model="paymentData.cardNumber" 
              required 
              placeholder="1234 5678 9012 3456"
              @input="formatCardNumber"
            >
            <div class="card-icons">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg" 
                   :class="{ 'active': cardType === 'visa' }">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg" 
                   :class="{ 'active': cardType === 'mastercard' }">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/americanexpress/americanexpress-original.svg" 
                   :class="{ 'active': cardType === 'amex' }">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Fecha de Expiración</label>
              <input 
                type="text" 
                v-model="paymentData.expiry" 
                required 
                placeholder="MM/AA"
                @input="formatExpiry"
              >
            </div>
            
            <div class="form-group">
              <label>CVV</label>
              <input 
                type="text" 
                v-model="paymentData.cvv" 
                required 
                placeholder="123"
                maxlength="4"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input type="email" v-model="paymentData.email" required placeholder="Para enviar los tickets">
          </div>
          
          <div class="summary">
            <h3>Resumen de Compra</h3>
            <p>Sector: {{ selectedSector.toUpperCase() }}</p>
            <p>Cantidad: {{ ticketQuantity }}</p>
            <p class="total">Total a Pagar: ${{ (sectores[selectedSector].precio * ticketQuantity).toFixed(2) }}</p>
          </div>
          
          <button type="submit" class="pay-btn" :disabled="processingPayment">
            {{ processingPayment ? 'Procesando...' : 'Pagar Ahora' }}
          </button>
        </form>
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
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';

export default {
  name: 'TicketPurchaseBySector',
  data() {
    return {
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
      showPaymentForm: false,
      processingPayment: false,
      paymentData: {
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        email: ''
      }
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
    selectSector(sectorName) {
      this.selectedSector = sectorName;
      this.ticketQuantity = 1;
      this.generatedTicket = null;
    },
    formatCardNumber() {
      // Eliminar todos los espacios existentes
      let value = this.paymentData.cardNumber.replace(/\s/g, '');
      
      // Añadir espacio cada 4 dígitos
      value = value.replace(/(\d{4})/g, '$1 ').trim();
      
      // Limitar a 16-19 dígitos dependiendo del tipo de tarjeta
      if (this.cardType === 'amex') {
        value = value.substring(0, 17); // 15 dígitos + 2 espacios
      } else {
        value = value.substring(0, 19); // 16 dígitos + 3 espacios
      }
      
      this.paymentData.cardNumber = value;
    },
    formatExpiry() {
      let value = this.paymentData.expiry.replace(/\D/g, '');
      
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      
      this.paymentData.expiry = value.substring(0, 5);
    },
    async processPayment() {
      this.processingPayment = true;
      
      try {
        // Simular procesamiento de pago (en producción usarías una API como Stripe)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generar el ticket después del pago exitoso
        this.generateTicket();
        
        // Cerrar el modal de pago
        this.showPaymentForm = false;
        
        // Mostrar mensaje de éxito
        alert('Pago procesado exitosamente. Tu ticket ha sido generado.');
        
        // Aquí iría la lógica para guardar la transacción en tu backend
        // await this.saveTransaction();
        
      } catch (error) {
        console.error('Error procesando el pago:', error);
        alert('Hubo un error procesando tu pago. Por favor intenta nuevamente.');
      } finally {
        this.processingPayment = false;
      }
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.sector-card.selected {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
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
  background: rgba(0,0,0,0.7);
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

.ticket-seat > h3 {
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

.ticket-seat > h3 span {
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

.ticket-seat > .ticket-seat-box:nth-of-type(1) {
  grid-area: suba;
}

.ticket-seat > .ticket-seat-box:nth-of-type(2) {
  grid-area: subb;
}

.ticket-seat > .ticket-seat-box:nth-of-type(3) {
  grid-area: subc;
}

.ticket-seat > .ticket-seat-box {
  writing-mode: vertical-rl;
  text-orientation: sideways;
  text-align: center;
}

.ticket-seat > .ticket-seat-box:not(:last-child) {
  border-bottom: 2px solid #3949ab;
}

.ticket-seat > .ticket-seat-box p {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
  padding-right: 4px;
}

.ticket-seat > .ticket-seat-box h4 {
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

.ticket-info > div:not(:nth-last-child(-n + 2)) {
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