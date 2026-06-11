<script setup>
defineProps({
  winner: Object,
});
</script>

<template>
  <div class="event-container">
    <h2>The Holy Grail War is Over</h2>

    <img :src="winner.picture" class="winner-portrait" />

    <h1>
      {{ winner.name }}
    </h1>

    <p>has claimed the Holy Grail and made their wish come true.</p>
  </div>
</template>
