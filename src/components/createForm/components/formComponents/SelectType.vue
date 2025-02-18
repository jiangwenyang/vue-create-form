<template>
  <el-select placeholder="请选择" clearable>
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Options } from "../../types";
interface Props {
  options?: Options;
}

const props = withDefaults(defineProps<Props>(), {
  options: () => []
});

const options = computed(() =>
  props.options.map(item => {
    if (typeof item !== "string") {
      return item;
    } else {
      return {
        label: item,
        value: item
      };
    }
  })
);
</script>
