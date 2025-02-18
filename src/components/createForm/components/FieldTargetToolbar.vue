<template>
  <div class="flex justify-end py-1 px-2 bg-white">
    <el-button
      @click="emit('view')"
      type="primary"
      :icon="useRenderIcon('carbon:view', { online: true })"
    >
      预览
    </el-button>
    <el-button
      @click="emit('reset')"
      type="danger"
      :icon="useRenderIcon('carbon:reset', { online: true })"
    >
      清空
    </el-button>

    <el-button
      @click="emit('generate')"
      :icon="useRenderIcon('ri:ai-generate', { online: true })"
    >
      生成组件
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

const emit = defineEmits<{
  (e: "view"): void;
  (e: "reset"): void;
  (e: "generate"): void;
}>();
</script>
