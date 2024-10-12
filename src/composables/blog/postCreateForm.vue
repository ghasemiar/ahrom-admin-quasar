<template>
  <q-form @submit="onSubmit" class="md:tw-p-4">
    <div class="tw-grid md:tw-grid-cols-4 tw-m-block-bw tw-gap-4">
      <div
        class="tw-w-full tw-bg-primary-100 bor tw-flex tw-flex-col tw-gap-4 tw-rounded-lg tw-p-block-in"
      >
        <app-uploader name="image" :model-value="image" label="image" />
        <app-input name="title" :model-value="title" label="title" />
        <app-input
          name="excerpt"
          :model-value="excerpt"
          label="excerpt"
          type="textarea"
        />
        <app-select
          name="categories"
          label="categories"
          :loading="categoryLoading"
          :model-value="categories"
          :options="categoryData"
          :multiple="true"
          option-label="name"
          option-key="id"
        />
        <app-select
          name="tags"
          label="tags"
          :loading="tagLoading"
          :model-value="tags"
          :options="tagData"
          :multiple="true"
          option-label="name"
          option-key="id"
        />
        <div class="separator">SEO fields</div>
        <app-input
          name="description"
          :model-value="description"
          label="description"
          type="textarea"
        />
        <app-input name="slug" :model-value="slug" label="slug" />
        <app-select
          name="keywords"
          label="keywords"
          :model-value="keywords"
          :multiple="true"
          :use-input="true"
          :use-chips="true"
          :hide-dropdown-icon="true"
          :input-debounce="0"
          new-value-mode="add-unique"
        />
      </div>
      <div class="md:tw-col-span-3">
        <editor
          class="tw-h-full"
          v-model="content"
          :api-key="apiKey"
          :init="tinyMCEOptions"
          :tag-name="tagName"
          :file_picker_callback="filePickerCallback"
          :automatic_uploads="true"
          file_picker_types="image"
          images_file_types="jpg,svg,webp"
          :initial-value="'My header is here dear friend'"
        ></editor>
      </div>
    </div>
    <div class="tw-grid md:tw-grid-cols-4 tw-m-block-bw tw-gap-4">
      <app-dialog
        :label="$t('select related post')"
        class="tw-w-full"
        :full_size="true"
      >
        <template #header_actions>
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
            @click="
              () => {
                related_post = [];
              }
            "
          />
        </template>
        <div class="tw-grid tw-grid-cols-4 tw-gap-5">
          <div v-for="post in getPostData" :key="post.id">
            <q-card class="my-card">
              <q-img v-if="!post.image" src="~/assets/no-photo.webp" />
              <q-card-section>
                <div>{{ post.title }}</div>
              </q-card-section>

              <q-card-actions class="q-pt-none">
                <q-btn
                  :label="
                    related_post.includes(post.id)
                      ? $t('unselect')
                      : $t('select')
                  "
                  @click="
                    () => {
                      related_post.push(post.id);
                    }
                  "
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
        <template #footer_actions>
          <q-btn color="teal" :label="$t('submit')" v-close-popup />
        </template>
      </app-dialog>
      <app-dialog :label="$t('preview')" class="tw-w-full" :full_size="true">
        <pre v-html="content"></pre>
      </app-dialog>
      <q-btn
        :loading="loading"
        @click="isPublish = false"
        class="tw-mx-5"
        type="submit"
        :label="$t('draft')"
        color="teal"
      />
      <q-btn
        :loading="loading"
        @click="isPublish = true"
        class="tw-mx-5"
        type="submit"
        :label="$t('publish')"
        color="teal"
      />
    </div>
  </q-form>
  <app-storage-dialog
    v-model:show="imageDialogVisible"
    :images="imageData"
    @select="handleImageSelect"
  />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import Editor from '@tinymce/tinymce-vue';
import { useCategoryList } from 'src/composables/category/useCategory';
import { useTagList } from 'src/composables/tag/useTag';
import AppStorageDialog from 'components/AppStorageDialog.vue';
import { useImageList } from 'src/composables/image/useImage';
import { usePostList, useCreatePost } from 'src/composables/blog/usePost';
import { useField, useForm } from 'vee-validate';
import { createPostSchema } from 'src/composables/blog/post.validate';
import AppDialog from 'components/AppDialog.vue';
import { transformPostFrom } from 'src/composables/blog/postFrom.dto';
import AppInput from 'components/AppInput.vue';
import AppUploader from 'components/AppUploader.vue';
import AppSelect from 'components/AppSelect.vue';

const slugNote = ref(false);
const tagName = ref('h1');
const apiKey = ref('qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc');
const imageDialogVisible = ref(false);
const callbackRef = ref();

const { data: imageData, request: imageRequest } = useImageList();
const filePickerCallback = async (cb, value, meta) => {
  try {
    imageRequest();

    callbackRef.value = cb;

    imageDialogVisible.value = true;
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};

const handleImageSelect = (url: string) => {
  if (callbackRef.value) {
    callbackRef.value(url, { title: 'Selected Image' });
  }
};

const { handleSubmit } = useForm({
  validationSchema: createPostSchema(),
  initialValues: {
    related_post: [],
  },
});
const { value: content, errorMessage: contentError } =
  useField<string>('content');
const { value: categories, errorMessage: categoriesError } =
  useField<object[]>('categories');
const { value: title, errorMessage: titleError } = useField<string>('title');
const { value: isPublish, errorMessage: isPublishError } =
  useField<boolean>('isPublish');
const { value: description, errorMessage: descriptionError } =
  useField<string>('description');
const { value: slug, errorMessage: slugError } = useField<string>('slug');
const { value: tags, errorMessage: tagsError } = useField<object[]>('tags');
const { value: keywords, errorMessage: keywordsError } =
  useField<string[]>('keywords');
const { value: excerpt, errorMessage: excerptError } =
  useField<string>('excerpt');
const { value: related_post, errorMessage: related_postError } =
  useField<number[]>('related_post');
const { value: image, errorMessage: imageError } = useField<FileList | null>(
  'image'
);
const tinyMCEOptions = reactive({
  menubar: false,
  plugins: ['link', 'lists', 'autolink', 'image', 'table'],
  language: 'fa',
  directionality: 'rtl',
  toolbar:
    'undo table redo styles colors forecolor backcolor bold italic alignleft aligncenter alignright alignjustify | bullist numlist outdent indent link unlink image',
  file_picker_callback: filePickerCallback,
  images_file_types: 'jpg,svg,webp',
  fontsize_formats:
    '10px 12px 14px 16px 18px 20px 22px 24px 26px 28px 30px 32px',
});

//save post method
const { request, loading } = useCreatePost();
const onSubmit = handleSubmit(async (values) => {
  const transformedValue = transformPostFrom(values);
  const formData = new FormData();

  for (let key in transformedValue) {
    if (
      Array.isArray(transformedValue[key]) &&
      transformedValue[key].length > 0
    ) {
      transformedValue[key].forEach((item) => {
        formData.append(key, item); // اضافه کردن هر آیتم به عنوان یک مقدار جداگانه
      });
    } else if (transformedValue[key]) {
      formData.append(key, transformedValue[key]); // اضافه کردن مقادیر غیراز آرایه
    }
  }

  formData.append('image', values.image);

  request(formData);
});
//define category and tag
const {
  data: categoryData,
  request: categoryRequest,
  loading: categoryLoading,
} = useCategoryList();
const {
  data: tagData,
  request: tagRequest,
  loading: tagLoading,
} = useTagList();
const {
  loading: getPostsLoading,
  request: getPosts,
  data: getPostData,
} = usePostList();

//call category and tag
onMounted(async () => {
  await categoryRequest();
  await tagRequest();
  await getPosts();
});
</script>
<style scoped lang="css">
.separator {
  display: flex;
  align-items: center;
  text-align: center;
}
.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 3px double #e0e0e0;
}
.separator::before {
  margin-right: 0.5em;
}
.separator::after {
  margin-left: 0.5em;
}
</style>
