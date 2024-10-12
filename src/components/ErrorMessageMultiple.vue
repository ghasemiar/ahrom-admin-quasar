<template>
  <error-message
    class="tw-text-red-500 tw-text-xs"
    v-for="(name, i) in names"
    :name="name"
    :key="`${name}-${i}`"
    as="div"
  />
</template>

<script setup lang="ts">
import { ErrorMessage } from 'vee-validate';
defineProps<{ names: string[] }>();
</script>
