<template>
  <div class="tw-m-10">
    <q-form @submit="onSubmit" class="tw-grid tw-gap-5">
      <app-uploader name="image" :model-value="image" />
      <app-input name="alt" :model-value="alt" label="alt" />
      <q-btn type="submit" :label="$t('submit')" color="teal" />
    </q-form>
  </div>
</template>
<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { useUploadImage } from 'src/composables/image/useImage';
import { uploadImageSchema } from 'src/composables/image/image.validate';
import AppUploader from 'components/AppUploader.vue';
import AppInput from 'components/AppInput.vue';
const { handleSubmit } = useForm({
  validationSchema: uploadImageSchema(),
});
const { request, loading } = useUploadImage();
const { value: image, errorMessage: imageError } = useField<File>('image');
const { value: alt, errorMessage: altError } = useField<string>('alt');
const onSubmit = handleSubmit(async (values) => {
  const formData = new FormData();
  formData.append('image', values.image[0]);
  formData.append('alt', values.alt);
  request(formData);
});
</script>
