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
                    src="https://www.canva.com/design/DAGpQKQdF_E/iDwJkg2zA0S8yWZzRvVafw/view?embed"
                    allowfullscreen="allowfullscreen" allow="fullscreen"> </iframe></div><a
                href="{{evento.link}}"
                target="_blank" rel="noopener">Diseño</a> de Yomar Rita Guzman Morales

            <h2>Selecciona tu sector</h2>

            <div class="sectors-grid">
                <div v-for="(sector, name) in sectores" :key="name" class="sector-card"
                    :style="{ 'border-color': sector.color, 'background-color': `${sector.color}20` }"
                    @click="selectSector(name)" :class="{ 'selected': selectedSector === name }">
                    <h3>{{ name.toUpperCase() }}</h3>
                    <p>Precio: ${{ sector.precio }}</p>
                    <p>cantidad: {{ sector.cantidad }} asientos</p>
                    <div class="color-sample" :style="{ 'background-color': sector.color }"></div>
                </div>
            </div>

            <div v-if="selectedSector" class="quantity-selector">
                <label>Cantidad de tickets:</label>
                <input type="number" v-model.number="ticketQuantity" min="1" :max="sectores[selectedSector].cantidad">
                <p>Total: ${{ (sectores[selectedSector].precio * ticketQuantity).toFixed(2) }}</p>
            </div>

            <button @click="generateTicket" class="checkout-btn" :disabled="!selectedSector || ticketQuantity < 1">
                Generar Ticket
            </button>
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
                            <h3>{{ selectedSector.toUpperCase() }} <span>${{ sectores[selectedSector].precio }}</span>
                            </h3>
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
            generatedTicket: null
        }
    },
    computed: {
        sectores() {
            return this.evento.precios || {};
        }
    },
    methods: {
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
                total: (this.sectores[this.selectedSector].precio * this.ticketQuantity).toFixed(2)
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
            // En una implementación real, usarías una librería como QRCode.js
            // o generarías el QR en el backend. Esto es un placeholder.
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
        }

        ,
        async saveTicketPurchase() {
            // Aquí iría la lógica para guardar la compra en tu backend
            // const tickets = [];
            // for (let i = 0; i < this.ticketQuantity; i++) {
            //   tickets.push({
            //     idevento: this.evento.idevento,
            //     sector: this.selectedSector,
            //     precio: this.sectores[this.selectedSector].precio,
            //     qrCode: this.generateUniqueId()
            //   });
            // }
            // await fetch('/api/entradas', { method: 'POST', body: JSON.stringify(tickets) });
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

.evento-imagen img {
    width: 100%;
    max-width: 600px;
    height: auto;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
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

/* Estilos del Ticket */
.ticket-container {
    display: flex;
    justify-content: center;
    background-color: #263238;
    padding: 20px;
}

.ticket {
    background-color: #9fa8da;
    color: #3949ab;
    width: 800px;
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
    grid-template-columns: 23% 80%;
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
    height: 80%;
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
    padding: 20px 4px;
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
    writing-mode: horizontal-tb;
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
    padding-right: 10px;
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
    width: 80px;
    height: 80px;
    margin: 0.5rem;
    object-fit: contain;
}
</style>