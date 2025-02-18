<template>
  <el-dialog title="表单预览" destroy-on-close center>
    <div class="max-h-[600px] overflow-auto">
      <el-form :model="tempData" v-bind="props.config.props">
        <FieldPreview
          v-for="field in props.config.fields"
          class="cursor-pointer flex-1"
          :field="field"
          :data="tempData"
          :key="field.id"
        />
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, useAttrs } from "vue";

import type { Config } from "../types";

import FieldPreview from "./FieldPreview.vue";
import { getFormModel } from "../utils";

interface Props {
  config: Config;
}

const props = defineProps<Props>();

const tempData = ref({});

const attrs = useAttrs();

watch(
  () => attrs.modelValue,
  value => {
    if (value) {
      tempData.value = getFormModel(props.config);
    }
  }
);
</script>
