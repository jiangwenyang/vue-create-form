<template>
  <div
    class="flex items-center cursor-move border rounded-sm py-2 pl-4 mt-2 first-of-type:mt-0 max-w-full overflow-auto"
    :class="[
      {
        'border-solid': props.active,
      },
      props.active ? 'border-blue-500' : 'border-gray-500',
    ]"
    :style="isApplyLayoutStyleToContainer ? {} : layoutStyle"
  >
    <div class="handle flex-shrink-0 mr-2 cursor-move w-6 h-6 text-center">
      <component class="w-full h-full" :is="fieldSchema.icon" />
    </div>

    <el-form-item
      :title="props.field.label"
      class="flex-1 custom-form-item"
      :label="props.field.label"
      :prop="props.field.prop"
      style="margin-bottom: 0"
      v-if="isFormGroupType"
    >
      <component
        v-loading="loading"
        :key="`${props.field.id}-${props.field.props?.multiple}`"
        class="cursor-pointer"
        :is="componentConfig.component"
        v-bind="bindProps"
      />
    </el-form-item>

    <component
      :key="props.field.id"
      v-loading="loading"
      class="cursor-pointer"
      :is="componentConfig.component"
      :currentField="currentField"
      v-bind="bindProps"
      v-else
    />

    <div class="flex w-[150px] mx-4 justify-end">
      <el-tooltip
        v-if="hasDataSource"
        effect="dark"
        content="点击更新数据源数据"
        placement="top"
      >
        <el-button
          title="更新数据"
          size="small"
          :icon="useRenderIcon('carbon:update-now', { online: true })"
          @click="handleUpdate"
        />
      </el-tooltip>
      <el-tooltip effect="dark" content="点击复制当前表单项" placement="top">
        <el-button
          title="复制"
          size="small"
          :icon="useRenderIcon('carbon:copy', { online: true })"
          @click="emit('copy')"
        />
      </el-tooltip>

      <el-popconfirm title="确认删除?" @confirm="emit('delete')">
        <template #reference>
          <el-button
            title="删除"
            size="small"
            type="danger"
            :icon="useRenderIcon('carbon:trash-can', { online: true })"
          />
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import type {
  GroupType,
  FieldProps,
  FormRule,
  Fields,
  DataSource,
} from "../types";
import { FIELD_TYPE_COMPONENT_CONFIG_MAP } from "../constant";
import {
  getDataSourceData,
  getTransformData,
  getLayoutStyle,
  getFieldSchemaByType,
} from "../utils";

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
  currentField?: Field;
  active: boolean;
}

// layout样式是否应用到子容器白名单，默认应用到自身
const APPLY_LAYOUT_STYLE_TO_CONTAINER = ["grid", "row"];

const props = defineProps<Props>();

const hasDataSource = computed(() => !!props.field.dataSource);

const isFormGroupType = computed(() => props.field.groupType === "FORM");

const fieldSchema = computed(() => getFieldSchemaByType(props.field.type));

// 布局样式
const layoutStyle = computed(() => {
  if (props.field.groupType !== "LAYOUT") {
    return {};
  }
  return getLayoutStyle(props.field.type, props.field.props);
});

// 布局样式是否应用到自身
const isApplyLayoutStyleToContainer = computed(() =>
  APPLY_LAYOUT_STYLE_TO_CONTAINER.includes(props.field.type)
);

// 基础属性
const commonProps = computed(() => props.field.props);

// 数据属性
const dataProps = ref({});

// 子属性
const childrenProps = computed(() =>
  props.field.children
    ? {
        fields: props.field.children,
      }
    : {}
);

// 布局属性
const layoutProps = computed(() => {
  if (props.field.groupType !== "LAYOUT") {
    return {};
  }
  return {
    layout: {
      style: isApplyLayoutStyleToContainer.value
        ? layoutStyle.value
        : undefined,
    },
  };
});

const loading = ref(false);

const bindProps = computed(() => ({
  ...commonProps.value,
  ...childrenProps.value,
  ...dataProps.value,
  ...layoutProps.value,
}));

const emit = defineEmits<{
  (e: "copy"): void;
  (e: "delete"): void;
  (e: "update", data: any): void;
}>();

const componentConfig = computed(
  () => FIELD_TYPE_COMPONENT_CONFIG_MAP[props.field.type]
);

async function handleUpdate() {
  if (!props.field.dataSource) {
    return;
  }
  loading.value = true;
  const data = await getDataSourceData(props.field.dataSource, true);

  dataProps.value = componentConfig.value.propsGetter(data);
  loading.value = false;
  emit("update", data);
}
</script>

<style lang="scss" scope>
.custom-form-item {
  .el-form-item__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }
  .el-form-item__content {
    width: 100%;
    height: 100%;
  }
}
</style>
