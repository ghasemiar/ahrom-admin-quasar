<template>
  <div class="tw-m-10">
    <q-form @submit="onSubmit" class="tw-grid tw-gap-5">
      <app-input name="name" :model-value="name" label="name" />
      <q-btn type="submit" :label="$t('submit')" color="teal" />
    </q-form>
  </div>
</template>
<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { useCreateTagSchema } from 'src/composables/tag/tag.validate';
import { useCreateTag } from 'src/composables/tag/useTag';
import AppInput from 'components/AppInput.vue';
const { handleSubmit } = useForm({
  validationSchema: useCreateTagSchema(),
});
const { request, loading } = useCreateTag();
const { value: name, errorMessage: nameError } = useField<string>('name');
const onSubmit = handleSubmit(async (values) => {
  request(values);
});
</script>
