<template>
  <q-select
    outlined
    :placeholder="selectModel === undefined ? getPlaceholder : ''"
    :label="label ? $t(label) : ''"
    :disable="disable"
    :behavior="behavior"
    anchor="bottom middle"
    self="top middle"
    :loading="getIsLoading"
    input-class="text-gray"
    :class="errorMessage ? 'tw-mb-8' : 'tw-mb-0'"
    v-model="selectModel"
    :option-value="(item) => (objectOutput ? item : item[outputValue])"
    :error-message="errorMessage"
    :hide-dropdown-icon="hideDropdownIcon"
    :error="!!errorMessage"
    :input-debounce="getInputDebounce"
    :options="options"
    :option-label="optionLabel"
    :multiple="multiple"
    :use-chips="useChips"
    :option-disable="optionDisable"
    :use-input="useInput"
    @filter="filterFn"
    :map-options="filterService ? false : true"
    :emit-value="filterService ? false : true"
    :dense="dense"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          {{ $t('No results') }}
        </q-item-section>
      </q-item>
    </template>

    <template v-for="(_, name) in $slots" #[name]="data">
      <slot :name="name" v-bind="data || {}" />
    </template>
  </q-select>
</template>

<script setup lang="ts">
import _get from 'lodash.get';
import {
  ref,
  unref,
  watch,
  watchEffect,
  defineEmits,
  computed,
  onMounted,
} from 'vue';
import { useField } from 'vee-validate';
import { MaybeRef } from 'src/types';
interface Props {
  name: string;
  modelValue?: any;
  hint?: string;
  label?: string;
  options?: any[];
  useInput?: boolean;
  filterService?: (value: string) => Promise<any>;
  requestOnMounted?: boolean;
  inputDebounce?: number;
  optionAppend?: boolean;
  hideDropdownIcon?: boolean;
  dense?: boolean;
  optionValue?: string;
  optionLabel?: string;
  optionDisable?: string;
  loading?: boolean;
  useChips?: boolean;
  multiple?: boolean;
  placeholder?: string;
  behavior?: string;
  disable?: boolean;
  objectOutput?: boolean;
  outputValue?: string;
  outputLabel?: string;
}
const emit = defineEmits(['update:modelValue']);
const props = withDefaults(defineProps<Props>(), {
  outputLabel: 'label',
  outputValue: 'value',
  behavior: 'menu',
  objectOutput: true,
  useInput: true,
  requestOnMounted: true,
  dense: true,
  hideDropdownIcon: false,
  loading: false,
});
const getInputDebounce = computed(() => {
  return (
    props.inputDebounce || (typeof props.filterService == 'function' ? 500 : 0)
  );
});
const localOptions = ref(props.options || []);
watch(
  () => props.options,
  (value) => {
    localOptions.value = value ?? [];
  }
);

const isLoading = ref(false);
const getIsLoading = computed(() => {
  return unref(isLoading) || props.loading;
});
const getPlaceholder = computed(() => {
  return props.placeholder?.replace('را وارد نمایید', '');
});
const sendRequest = (value: string) => {
  if (value.length > 1) {
    isLoading.value = true;
    return props.filterService!(value)
      .then((response) => {
        if (response != undefined) {
          localOptions.value = response;
        }
      })
      .finally(() => {
        isLoading.value = false;
      });
  }
};
onMounted(() => {
  if (props.requestOnMounted && typeof props.filterService === 'function') {
    sendRequest('');
  }
});
const filterFn = (val, update, abort) => {
  if (typeof props.filterService === 'function') {
    if (typeof val == 'string' && (val.length > 2 || val.length == 0)) {
      sendRequest(val).then(() => {
        update();
      });
    } else {
      update();
    }
  } else {
    update(() => {
      const needle = val.toLowerCase();
      // localOptions.value = (props.options || []).filter(
      //   (v) => v.toLowerCase().indexOf(needle) > -1
      // );
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const {
  errorMessage,
  value: modelValue,
  setValue,
} = useField(props.name as MaybeRef<string>, undefined, {
  initialValue: props.modelValue,
});
const selectModel = computed({
  get() {
    return unref(getIsLoading) ? undefined : unref(modelValue);
  },
  set(val) {
    modelValue.value = val;
  },
});
// watchEffect(() => {
//   console.log('watchEffect', modelValue);
//   emit('update:modelValue', unref(modelValue));
// });
// watch(
//   () => props.modelValue,
//   (value) => {
//     console.log('watchEffect', value);
//     setValue(value);
//   }
// );
// const getOptions = computed(() => {
//   const currentOptions = unref(localOptions);
//   if (props.optionValue || props.optionLabel) {
//     return currentOptions.map((item) => {
//       return {
//         ...(props.optionAppend ? item : {}),
//         value: props?.optionValue?.includes(',')
//           ? props?.optionValue?.split(',')?.map((v) => _get(item, v))
//           : _get(item, props.optionValue),
//         label: _get(item, props.optionLabel),
//       };
//     });
//   }
//   return currentOptions;
// });
</script>

<style lang="scss">
label {
  div {
    div {
      div {
        div {
          input {
            max-width: 160px !important;
          }
        }
      }
    }
  }
}
</style>
