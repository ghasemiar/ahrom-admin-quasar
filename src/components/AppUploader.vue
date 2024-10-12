<template>
  <div>
    <app-uploader-ui v-bind="$attrs" v-model="value" :error="getError" />
    <error-message-multiple :names="names"></error-message-multiple>
  </div>
</template>

<script lang="ts">
import { useField } from 'vee-validate';
import { MaybeRef } from 'src/types';
import { unref, watchEffect, watch, PropType, computed } from 'vue';
import AppUploaderUi from 'src/components/AppUploaderUi.vue';
import ErrorMessageMultiple from 'src/components/ErrorMessageMultiple.vue';
export default {
  components: { AppUploaderUi, ErrorMessageMultiple },
  props: {
    name: {
      type: Array as PropType<string[]>,
      required: true,
    },
    names: {
      type: Array as PropType<string[]>,
    },
    modelValue: {
      type: String as PropType<string>,
      default: '',
    },
    error: String,
  },
  setup(props, { emit }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const { errorMessage, value, setValue } = useField(
      props.name as unknown as MaybeRef<string>,
      undefined,
      { initialValue: props.modelValue }
    );
    const getError = computed(() => props.error || unref(errorMessage));
    watchEffect(() => {
      emit('update:modelValue', unref(value));
    });
    watch(
      () => props.modelValue,
      (value) => {
        setValue(value);
      }
    );
    return {
      errorMessage,
      value,
      getError,
    };
  },
};
</script>
