<!-- eslint-disable vue/no-mutating-props -->
<template>
  <section>
    <el-divider content-position="center" border-style="dashed">
      基础Props配置
    </el-divider>
    <el-form
      v-if="isFormGroupType"
      ref="formRef"
      :rules="formRules"
      :model="props.field"
      label-suffix=": "
      :label-width="140"
    >
      <el-form-item prop="label" label="标签文本">
        <el-input v-model="props.field.label" placeholder="请输入" clearabled />
      </el-form-item>
      <el-form-item prop="label-width" label="标签文本宽度">
        <el-input
          v-model="props.field['label-width']"
          placeholder="请输入"
          clearabled
        />
      </el-form-item>
    </el-form>

    <CommonPropsConfig
      ref="commonPropsConfigRef"
      :props-data="field.props"
      :props-schema="propsSchema"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import CommonPropsConfig from "./CommonPropsConfig.vue";
import { getFieldSchemaByType } from "../utils";
import type { Field } from "../types";
interface Props {
  field: Field;
}
const props = defineProps<Props>();
defineExpose({
  validate
});

const formRef = ref(null);
const formRules = {
  label: [
    {
      required: true,
      message: "请输入标签文本"
    }
  ]
};
const commonPropsConfigRef = ref(null);

const propsSchema = computed(() => {
  const filedSchema = getFieldSchemaByType(props.field.type);
  return filedSchema.props;
});

const isFormGroupType = computed(() => props.field.groupType === "FORM");

function validate() {
  return Promise.all(
    [formRef, commonPropsConfigRef].map(item =>
      item.value && item.value.validate
        ? item.value.validate()
        : Promise.resolve(true)
    )
  );
}
</script>
