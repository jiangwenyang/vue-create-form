<template>
  <FieldPropsConfig ref="fieldPropsConfigRef" :field="props.field" />
  <template v-if="isFormGroupType">
    <FieldDataConfig ref="fieldDataConfigRef" :field="props.field" />
    <FiledRulesConfig ref="filedRulesConfig" :field="props.field" />
  </template>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import FieldPropsConfig from "./FieldPropsConfig.vue";
import FieldDataConfig from "./FieldDataConfig.vue";
import FiledRulesConfig from "./FiledRulesConfig.vue";
import type { Field } from "../types";
interface Props {
  field: Field;
}
const props = defineProps<Props>();
defineExpose({
  validate
});
const fieldPropsConfigRef = ref(null);
const fieldDataConfigRef = ref(null);
const filedRulesConfig = ref(null);

const isFormGroupType = computed(() => props.field.groupType === "FORM");

function validate() {
  return Promise.all(
    [fieldPropsConfigRef, fieldDataConfigRef].map(item =>
      item.value && item.value.validate
        ? item.value.validate()
        : Promise.resolve(true)
    )
  );
}
</script>
