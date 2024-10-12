<template>
  <div class="tw-m-10">
    <q-form @submit="onSubmit" class="tw-grid tw-gap-5">
      <app-input name="name" :model-value="name" label="name" />
      <q-btn
        type="submit"
        :label="$t('submit')"
        :disable="loading"
        color="teal"
      />
    </q-form>
  </div>
</template>
<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { onMounted, watch } from 'vue';
import { useCreateTagSchema } from 'src/composables/tag/tag.validate';
import { useTag, useUpdateTag } from 'src/composables/tag/useTag';
import AppInput from 'components/AppInput.vue';

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: useCreateTagSchema(),
});
const {
  request: fetchCurrentData,
  loading: currentDataLoading,
  data,
} = useTag();
onMounted(() => {
  fetchCurrentData();
});
watch(data, (newValue) => {
  if (newValue && Object.keys(newValue).length) {
    setFieldValue('name', newValue.name);
  }
});
const { request, loading } = useUpdateTag();
const { value: name, errorMessage: nameError } = useField<string>('name');
const onSubmit = handleSubmit(async (values) => {
  request(values);
});
</script>
