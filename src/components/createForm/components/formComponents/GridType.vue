<template>
  <div :style="layoutStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type {
  GroupType,
  FieldProps,
  Fields,
  DataSource,
  FormRule
} from "../../types";

import { getLayoutStyle } from "../../utils";

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
}

const props = defineProps<Props>();

const layoutStyle = computed(() =>
  getLayoutStyle(props.field.type, props.field.props)
);
</script>
