<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { onMounted, onUnmounted } from 'vue'

/**
 * A link that, when clicked in presenter view, opens in the audience window instead.
 * The audience tab (render context `slide`) listens on a BroadcastChannel and calls
 * `window.open` there; Chrome must allow popups for this origin since no user gesture
 * happens in that window.
 */
const props = defineProps<{ href: string }>()

const { $renderContext } = useSlideContext()
const channel = new BroadcastChannel('tsdown-vfm-5:open-in-audience')

function onClick(e: MouseEvent) {
  if ($renderContext.value !== 'presenter') return
  e.preventDefault()
  channel.postMessage(props.href)
}

onMounted(() => {
  if ($renderContext.value !== 'slide') return
  channel.onmessage = (ev: MessageEvent<string>) => {
    window.open(ev.data, '_blank', 'noopener')
  }
})

onUnmounted(() => channel.close())
</script>

<template>
  <a :href="href" target="_blank" rel="noopener" @click="onClick"><slot /></a>
</template>
