<!-- eslint-disable vue/no-mutating-props -->
<template>
  <!-- 表单组件 -->
  <template v-if="isFormGroupType">
    <el-form-item
      :label="props.field.label"
      :label-width="props.field['label-width']"
      :prop="props.field.prop"
      :rules="props.field.rules"
    >
      <component
        v-model="props.data[props.field.prop]"
        v-loading="loading"
        :key="`${props.field.id}-${props.field.props?.multiple}`"
        :is="componentConfig.previewComponent || componentConfig.component"
        v-bind="bindProps"
      />
    </el-form-item>
  </template>

  <!-- 容器组件或其他组件，有子组件则递归 -->
  <component
    v-else
    v-loading="loading"
    :key="props.field.id"
    :is="componentConfig.previewComponent || componentConfig.component"
    :field="props.field"
    v-bind="bindProps"
  >
    <template v-if="props.field.children && props.field.children.length > 0">
      <FieldPreview
        v-for="item in props.field.children"
        :key="`${item.id}-${item.props?.multiple}`"
        :field="item"
        :data="props.data"
      />
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";

import type {
  GroupType,
  FieldProps,
  Fields,
  DataSource,
  FormRule
} from "../types";
import { FIELD_TYPE_COMPONENT_CONFIG_MAP } from "../constant";
import { getDataSourceData, getTransformData } from "../utils";

// 配置项数据
interface Field {
  id: string; // 表单数据id
  label?: string; // 表单数据标签
  "label-width"?: string | number; // 标签宽度
  prop?: string; // 表单数据prop
  type: string; // 表单项类型
  groupType: GroupType; // 表单分组类型
  props?: FieldProps; // props
  dataSource?: DataSource; // 数据源
  rules?: Array<FormRule>;
  children?: Fields;
}

interface Props {
  field: Field;
  data: Record<string, any>;
}

const props = defineProps<Props>();

const hasDataSource = computed(
  () => !!props.field.dataSource && props.field.dataSource.value
);

// 基础属性
const commonProps = computed(() => props.field.props);
// 数据属性
const dataProps = ref({});
const loading = ref(false);

const bindProps = computed(() => ({
  ...commonProps.value,
  ...dataProps.value
}));

const componentConfig = computed(
  () => FIELD_TYPE_COMPONENT_CONFIG_MAP[props.field.type]
);

const isFormGroupType = computed(() => props.field.groupType === "FORM");

async function getData() {
  if (!hasDataSource.value) {
    return;
  }
  loading.value = true;
  const data = await getDataSourceData(props.field.dataSource, true);

  dataProps.value = componentConfig.value.propsGetter(data);
  loading.value = false;
}

onMounted(() => {
  getData();
});
</script>
