<template>
  <el-tabs class="flex flex-col h-full" v-model="activeName" stretch>
    <el-tab-pane label="表单项配置" name="FIELD" v-if="props.currentField">
      <FieldConfig :field="currentField" ref="fieldConfigRef" />
    </el-tab-pane>
    <el-tab-pane label="表单配置" name="FORM">
      <FormPropsConfig :form-props="config.props" ref="formPropsConfigRef" />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import FormPropsConfig from "./FormPropsConfig.vue";
import FieldConfig from "./FieldConfig.vue";
import type { Config, Field } from "../types";
interface Props {
  config: Config;
  currentField?: Field;
}
const props = defineProps<Props>();
defineExpose({
  validate
});

const activeName = ref("FORM");

const fieldConfigRef = ref(null);
const formPropsConfigRef = ref(null);

function validate() {
  return Promise.all(
    [fieldConfigRef, formPropsConfigRef].map(
      item => item && item.validate && item.validate()
    )
  );
}

watch(
  () => props.currentField,
  value => {
    activeName.value = value ? "FIELD" : "FORM";
  }
);
</script>

<style scoped lang="scss">
::v-deep {
  .el-tabs__content {
    overflow: auto;
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
