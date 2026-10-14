<template>
  <div class="hammer-hero" aria-label="tsdown hammer striking the Vue Final Modal logo" role="img">
    <div class="hammer-hero__glow" />
    <img class="hammer-hero__vfm" src="/vue-final-modal.svg" alt="" />
    <img class="hammer-hero__hammer" src="/tsdown.svg" alt="" />
  </div>
</template>

<style scoped>
.hammer-hero {
  --cycle: 3.2s;
  position: relative;
  width: 22rem;
  height: 17rem;
}

.hammer-hero__glow {
  position: absolute;
  left: 0.5rem;
  bottom: 0;
  width: 15rem;
  height: 9rem;
  border-radius: 50%;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--accent) 35%, transparent), transparent);
  filter: blur(14px);
}

.hammer-hero__vfm {
  position: absolute;
  left: 1.5rem;
  bottom: 2.5rem;
  width: 13rem;
  transform-origin: 50% 100%;
  animation: vfm-squash var(--cycle) ease-in-out infinite;
}

.hammer-hero__hammer {
  position: absolute;
  right: 0;
  top: 0;
  width: 10.5rem;
  transform-origin: 78% 88%;
  animation: hammer-swing var(--cycle) cubic-bezier(0.5, 0, 0.6, 1) infinite;
}


@keyframes hammer-swing {
  0%, 30% { transform: rotate(0deg); }
  48% { transform: rotate(14deg); }
  58% { transform: rotate(-40deg); }
  64% { transform: rotate(-34deg); }
  80%, 100% { transform: rotate(0deg); }
}

@keyframes vfm-squash {
  0%, 56% { transform: scale(1, 1); }
  60% { transform: scale(1.06, 0.86); }
  68% { transform: scale(0.98, 1.04); }
  76%, 100% { transform: scale(1, 1); }
}


@media (prefers-reduced-motion: reduce) {
  .hammer-hero__vfm,
  .hammer-hero__hammer {
    animation: none;
  }
}
</style>
