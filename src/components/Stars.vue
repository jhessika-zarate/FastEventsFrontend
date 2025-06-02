<template>
  <div class="stars" :style="starsContainerStyle">
    <div
      class="star"
      v-for="n in starCount"
      :key="n"
      :style="getStarStyle(n)"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: Number,
      default: 180,
    },
    width: {
      type: Number,
      default: 140,
    },
    starCount: {
      type: Number,
      default: 60,
    },
    starColor: {
      type: String,
      default: "#ffffff", // Color por defecto (blanco)
    }
  },
  computed: {
    starsContainerStyle() {
      return {
        height: `${this.height}%`,
        width: `${this.width}vw`,
      };
    }
  },
  methods: {
    getStarStyle() {
      return {
        "--top-offset": `${Math.random() * this.height}vh`,
        "--left-offset": `${Math.random() * this.width}vw`,
        "--fall-duration": `${Math.random() * 5 + 5}s`,
        "--fall-delay": `${Math.random()}s`,
        "--star-color": this.starColor,
      };
    },
  },
};
</script>

<style scoped>
.stars {
  position: fixed;
  top: 0;
  left: 0;
  transform: rotate(-45deg);
  pointer-events: none;
  z-index: 1;
  will-change: transform, opacity;
}

.star {
  --star-tail-length: 6em;
  --star-tail-height: 2px;
  --star-width: calc(var(--star-tail-length) / 6);
  color: var(--star-color); /* Se usa el color dinámico */
  position: absolute;
  top: var(--top-offset);
  left: var(--left-offset);
  width: var(--star-tail-length);
  height: var(--star-tail-height);
  background: linear-gradient(45deg, currentColor, transparent);
  border-radius: 50%;
  filter: drop-shadow(0 0 6px currentColor);
  transform: translate3d(104em, 0, 0);
  animation: fall var(--fall-duration) var(--fall-delay) linear infinite,
    tail-fade var(--fall-duration) var(--fall-delay) ease-out infinite;
}

@keyframes fall {
  to {
    transform: translate3d(-30em, 0, 0);
  }
}

@keyframes tail-fade {
  0%, 50% {
    width: var(--star-tail-length);
    opacity: 1;
  }
  70%, 80% {
    width: 0;
    opacity: 0.4;
  }
  100% {
    width: 0;
    opacity: 0;
  }
}

.star::before,
.star::after {
  position: absolute;
  content: "";
  top: 0;
  left: calc(var(--star-width) / -2);
  width: var(--star-width);
  height: 100%;
  background: linear-gradient(45deg, transparent, currentColor, transparent);
  border-radius: inherit;
  animation: blink 2s linear infinite;
}

.star::before {
  transform: rotate(45deg);
}

.star::after {
  transform: rotate(-45deg);
}

@keyframes blink {
  50% {
    opacity: 0.6;
  }
}
</style>
