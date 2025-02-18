<template>
  <div class="w-full h-full flex flex-col p-2">
    <FieldTargetToolbar v-bind="attrs" />
    <div class="flex-1 mt-2 p-2 rounded-sm overflow-auto target-container">
      <el-form
        class="h-full"
        v-bind="props.config.props"
        @click="emit('resetCurrentFiled')"
      >
        <FieldTargetContainer
          :fields="props.config.fields"
          :currentField="props.currentField"
        />
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAttrs } from "vue";
import FieldTargetToolbar from "./FieldTargetToolbar.vue";
import FieldTargetContainer from "./FieldTargetContainer.vue";
import type { Config, Field } from "../types";
interface Props {
  config: Config;
  currentField: Field;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "resetCurrentFiled"): void;
}>();

const attrs = useAttrs();
</script>

<style lang="scss" scoped>
.target-container {
  background-color: white;
  background: white;
  background-image: linear-gradient(white 14px, transparent 0),
    linear-gradient(90deg, #ccc 1px, transparent 0);
  background-size: 15px 15px, 15px 15px;
}
</style>
