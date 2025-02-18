<template>
  <Draggable
    class="w-full h-full"
    :class="{
      'min-h-40 border border-slate-400 border-dashed p-4': !!props.layout
    }"
    :style="props.layout?.style"
    :list="props.fields"
    v-bind="dragOptions"
    :component-data="{
      tag: 'div',
      type: 'transition-group',
      name: !drag ? 'flip-list' : null
    }"
    item-key="id"
    @start="drag = true"
    @end="drag = false"
  >
    <template #item="{ element, index }">
      <FieldTargetItem
        :active="currentField === element"
        :field="element"
        :currentField="currentField"
        @click.stop="updateCurrentField(element)"
        @copy="handleCopy(element, index, props.fields)"
        @delete="handleDelete(element, index, props.fields)"
      />
    </template>
  </Draggable>
</template>

<script setup lang="ts">
import { inject, ref } from "vue";
import Draggable from "vuedraggable";
import { nanoid } from "nanoid";
import FieldTargetItem from "./FieldTargetItem.vue";

import type { Field, Fields } from "../types";
import { reactive } from "vue";

interface Props {
  fields: Fields;
  currentField?: Field;
  layout?: Record<string, string>; // 布局样式
}
const props = defineProps<Props>();

const drag = ref(false);
const dragOptions = reactive({
  animation: 200,
  group: { name: "FIELD" },
  disabled: false,
  ghostClass: "ghost"
});

const updateCurrentField = inject<Function>("updateCurrentField");

// 处理点击复制
function handleCopy(data, index, list) {
  const getCopyData = data => {
    const { label, children } = data;
    const id = nanoid();
    return {
      ...data,
      id,
      label: `${label}-copy`,
      children: children ? children.map(getCopyData) : undefined
    };
  };

  const copyData = getCopyData(data);

  list.splice(index + 1, 0, copyData);
}
// 处理点击删除
function handleDelete(data, index, list) {
  list.splice(index, 1);
  updateCurrentField(null);
}
</script>

<style lang="scss" scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #dbe9f0;
}
</style>
