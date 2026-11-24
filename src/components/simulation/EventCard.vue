<script setup>
import { formatEvent } from "../../services/formatEvent";

const props = defineProps({
  event: Object,
});

console.log("EVENT CARD RECEIVED:", props.event);
console.log("FORMATTED TEXT:", formatEvent(props.event));
</script>

<template>
  <div class="event">
    <div class="participants">
      <div v-for="key in event.actors" :key="key">
        <img
          v-if="event.participants[key]"
          :src="event.participants[key].picture"
          class="portrait" />
      </div>
    </div>

    <p>
      {{ formatEvent(event) }}
    </p>
  </div>
</template>
