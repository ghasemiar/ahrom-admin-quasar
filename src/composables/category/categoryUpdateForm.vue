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
import { useCreateCategorySchema } from 'src/composables/category/category.validate';
import {
  useCategory,
  useUpdateCategory,
} from 'src/composables/category/useCategory';
import { onMounted, watch } from 'vue';
import AppInput from 'components/AppInput.vue';

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: useCreateCategorySchema(),
  initialValues: {
    name: '',
  },
});
const {
  request: fetchCurrentData,
  loading: currentDataLoading,
  data,
} = useCategory();
onMounted(() => {
  fetchCurrentData();
});
watch(data, (newValue) => {
  if (newValue && Object.keys(newValue).length) {
    setFieldValue('name', newValue.name);
  }
});
const { request, loading } = useUpdateCategory();
const { value: name, errorMessage: nameError } = useField<string>('name');
const onSubmit = handleSubmit(async (values) => {
  request(values);
});
</script>
