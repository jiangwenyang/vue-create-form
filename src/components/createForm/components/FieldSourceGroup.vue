<template>
  <Draggable
    :list="props.fileds"
    :group="{ name: 'FIELD', pull: 'clone', put: false }"
    :clone="generateFieldItem"
    :sort="false"
    item-key="name"
  >
    <template #item="{ element }">
      <FieldSourceItem v-bind="element" />
    </template>
  </Draggable>
</template>

<script setup lang="ts">
import { inject } from "vue";
import Draggable from "vuedraggable";
import FieldSourceItem from "./FieldSourceItem.vue";
import type { FieldSchemas } from "../types";

interface Props {
  fileds: FieldSchemas;
}

const props = defineProps<Props>();

const generateFieldItem = inject<Function>("generateFieldItem");
</script>
