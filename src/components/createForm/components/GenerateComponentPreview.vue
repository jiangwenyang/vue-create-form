<template>
  <el-dialog title="组件生成" width="60%">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="组件" name="component">
        <div class="h-[400px] overflow-auto bg-slate-700">
          <pre class="px-2">
            <code class="language-html" v-html="getSourceCodeHtml(sourceCode)"/>
          </pre>
        </div>
      </el-tab-pane>
      <el-tab-pane label="formSchema" name="formSchema">
        <div class="h-[400px] overflow-auto bg-slate-700">
          <pre class="px-2">
            <code class="language-json" v-html="getSourceCodeHtml(schema)"/>
          </pre>
        </div>
      </el-tab-pane>
      <el-tab-pane label="默认数据" name="model">
        <div class="h-[400px] overflow-auto bg-slate-700">
          <pre class="px-2">
            <code class="language-json" v-html="getSourceCodeHtml(model)"/>
          </pre>
        </div>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <div class="text-center">
        <el-button @click="handleCopy">复制</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.min.css";
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import type { Config } from "../types";
interface Props {
  config: Config;
}

const props = defineProps<Props>();

const schema = computed(() => JSON.stringify(props.config, undefined, 4));
const model = computed(() => JSON.stringify(props.config.model, undefined, 4));
const sourceCode = computed(() => {
  return `<CustomForm :formSchema='${schema.value}' />`;
});

const activeName = ref("component");

function getSourceCodeHtml(data) {
  return Prism.highlight(data, Prism.languages.html);
}

function copy(text: string) {
  try {
    navigator.clipboard.writeText(text);
    ElMessage.success({
      message: "复制成功！"
    });
  } catch (error) {
    console.log(error);
  }
}

function handleCopy() {
  const copyHandlerMap = {
    component: () => copy(sourceCode.value),
    formSchema: () => copy(schema.value),
    model: () => copy(model.value)
  };
  copyHandlerMap[activeName.value]();
}
</script>
