<template>
  <div
    class="cursor-move py-1 px-2 flex items-center border-1 border-gray-400 mt-4 rounded-sm shadow-sm hover:border-blue-500 hover:text-blue-500 transition-all"
  >
    <component :is="props.icon" class="w-6 h-6 text-base mr-3" />
    <span class="text-base">{{ props.name }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { GroupType, FieldPropsSchema } from "../types";

interface FieldSchema {
  name: string; // 表单项名称
  type: string; // 表单项类型
  groupType: GroupType; // 分组类型： 表单类型 ｜ 辅助类型 ｜ 布局类型
  icon: Component; // 表单项icon
  props: FieldPropsSchema; // 表单项可配置参数
  dataSource?: boolean; // 表单项目是否可配置数据源
}
const props = defineProps<FieldSchema>();
</script>
