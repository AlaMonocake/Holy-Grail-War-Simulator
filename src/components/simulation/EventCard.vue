<script setup>
import { formatEvent } from "../../services/formatEvent";

defineProps({
  event: Object,
});
</script>

<template>
  <div class="event">
    <div class="participants">
      <div v-for="key in event.actors" :key="key">
        <img :src="event.participants[key]?.picture" class="portrait" />
      </div>
    </div>

    <p>
      {{ formatEvent(event) }}
    </p>
  </div>
</template>
