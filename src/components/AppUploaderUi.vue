<template>
  <label
    class="tw-block tw-bg-neutral-95 tw-relative tw-overflow-hidden tw-rounded-xl tw-border-2 tw-h-[12rem] tw-border-dashed tw-flex-1 tw-cursor-pointer"
    :class="{
      'tw-border-neutral-70': !error,
      'tw-border-red-500': error,
    }"
  >
    <input
      class="overlayed tw-cursor-pointer tw-opacity-0"
      type="file"
      multiple
      :accept="accept"
      @change="handleChange($event)"
    />

    <span class="overlayed tw-pointer-events-none t-center tw-flex-col">
      <q-icon class="text-dark" size="96px" color="black">
        <img src="~assets/upload.svg" />
      </q-icon>
      <span class="tw-text-center tw-text-xs tw-text-gray-400">{{
        $t('drop file here')
      }}</span>
      <span class="tw-text-center tw-my-2 tw-text-xs tw-text-gray-400">{{
        uploadInfo
      }}</span>
      <span v-if="label" class="tw-text-center tw-text-xs tw-text-gray-500">
        ({{ label }})
      </span>
      <span v-if="error" class="tw-text-center tw-text-xs tw-text-red-500">
        ({{ error }})
      </span>
    </span>
    <!-- <div class="tw-p-3">
      <q-linear-progress
        v-show="progress || error"
        stripe
        size="15px"
        :value="progressBarValue"
      >
        <div class="absolute-full flex flex-center">
          <q-badge
            color="white"
            :text-color="error ? 'blue' : 'accent'"
            :label="error ? error : `${progress}%`"
          />
        </div>
      </q-linear-progress>
    </div> -->
  </label>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, watchEffect } from 'vue';

export default defineComponent({
  props: {
    accept: {
      type: String as PropType<string>,
      default: 'image/*',
    },
    multiple: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    wrapperClass: {
      type: [String, Object, Array],
    },
    modelValue: {
      type: [Object, Array],
    },
    progress: Number,
    error: String,
    label: String,
  },
  setup(props, { emit }) {
    // // // console.log("props.multiple" , props.multiple)
    const handleChange = ($e: any) => {
      emit('update:modelValue', $e.target.files);
    };
    const uploadInfo = computed(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return `${props.modelValue?.length} عکس انتخاب شده است.`;
    });
    const progressBarValue = computed(() => (props.progress || 0) / 100);
    watchEffect(() => {
      if (props.modelValue) {
        // // // console.log(props.multiple);
        // // // console.log(props.modelValue);
        // // // console.log(props.modelValue?.length);
      }
    });
    return { handleChange, progressBarValue, uploadInfo };
  },
});
</script>
<style scoped>
.overlayed {
  @apply tw-absolute tw-inset-0 tw-w-full;
}
</style>
