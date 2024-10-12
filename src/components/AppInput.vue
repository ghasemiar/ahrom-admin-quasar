<template>
  <q-input
    v-model="value"
    lazy-rules
    :label="$t(label)"
    outlined
    :class="errorMessage ? 'tw-mb-8' : ''"
    dense
    :mask="mask"
    :unmasked-value="unmaskedValue"
    :reverse-fill-mask="reverseFillMask"
    :fill-mask="fillMask"
    :error-message="errorMessage"
    :error="!!errorMessage"
    :maxlength="maxLength"
    :autocomplete="autocomplete"
    :type="type"
    hideHint
  >
    <template #append
      ><slot v-if="!errorMessage" name="append"></slot
    ></template>
    <template #prepend><slot name="prepend"></slot></template>
  </q-input>
</template>

<script lang="ts">
import { useField } from 'vee-validate';
import { MaybeRef } from 'src/types';
import { unref, watchEffect, watch, PropType } from 'vue';

export default {
  name: 'AppInput',
  props: {
    autocomplete: {
      type: String,
      default: 'off',
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      nullable: true,
    },
    modelValue: {
      type: String as PropType<string>,
      default: '',
    },
    maxLength: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    mask: {
      type: String || undefined,
      default: undefined,
    },
    reverseFillMask: {
      type: Boolean,
      default: false,
    },
    fillMask: {
      type: Boolean,
      default: false,
    },
    lazyRules: {
      type: Boolean,
      default: false,
    },
    lazyValidate: {
      type: Boolean,
      default: true,
    },
    unmaskedValue: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const { errorMessage, value, setValue } = useField(
      props.name as MaybeRef<string>,
      undefined,
      {
        initialValue: props.modelValue,
        validateOnValueUpdate: props.lazyValidate,
      }
    );
    watch(value, (val) => {
      if (props.type === 'number') {
        value.value = Number(val);
      }
    });
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
    };
  },
};
</script>
<style lang="scss">
.bg-white {
  background-color: white !important;
  border-width: 1px;
  border-color: $primary;
}
// .q-field__control {
//   height: 44px !important;
// }
// label{
//   div{
//     div{
//       div {
//         i::before {
//           q-icon{
//             background: greenyellow;
//           }
//         }
//       }
//     }
//   }
// }
</style>
