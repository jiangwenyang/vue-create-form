<!-- eslint-disable vue/no-mutating-props -->
<template>
  <section>
    <el-divider content-position="center" border-style="dashed">
      数据配置
    </el-divider>

    <el-form
      ref="formRef"
      :rules="formRules"
      :model="props.field"
      label-suffix=": "
      :label-width="140"
    >
      <el-form-item prop="prop" label="属性名">
        <el-tooltip
          content="表单数据对象的属性名，默认为表单项随机生成id"
          placement="top"
        >
          <el-input
            v-model="props.field.prop"
            placeholder="请输入"
            clearabled
          />
        </el-tooltip>
      </el-form-item>
    </el-form>

    <FieldDataSourceConfig
      ref="fieldDataSourceConfigRef"
      :data-source="props.field.dataSource"
      v-if="hasDataSource"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import FieldDataSourceConfig from "./FieldDataSourceConfig.vue";

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
  prop: [
    {
      required: true,
      message: "请输入属性名"
    }
  ]
};
const fieldDataSourceConfigRef = ref(null);

const fieldSchema = computed(() => getFieldSchemaByType(props.field.type));

const hasDataSource = computed(() => fieldSchema.value.dataSource);

function validate() {
  return Promise.all(
    [formRef, fieldDataSourceConfigRef].map(item =>
      item.value && item.value.validate
        ? item.value.validate()
        : Promise.resolve(true)
    )
  );
}
</script>
