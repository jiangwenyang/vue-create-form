<template>
  <CommonPropsConfig
    ref="commonPropsConfigRef"
    :props-data="props.formProps"
    :props-schema="FORM_PROPS_SCHEMA"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { FormProps } from "../types";

import CommonPropsConfig from "./CommonPropsConfig.vue";
import { FORM_PROPS_SCHEMA } from "../constant";
interface Props {
  formProps: FormProps;
}
const props = defineProps<Props>();
defineExpose({
  validate
});

const commonPropsConfigRef = ref(null);

function validate() {
  return commonPropsConfigRef.value && commonPropsConfigRef.value.validate
    ? commonPropsConfigRef.value.validate()
    : Promise.resolve(true);
}
</script>
