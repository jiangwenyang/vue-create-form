<template>
  <el-dialog v-model="dialogVisible" title="数据转换预览" width="80%">
    <div class="p-2">
      <el-alert :title="error" type="error" v-if="error" />
      <div class="flex justify-between items-center gap-4 mt-3">
        <el-card header="原数据" v-loading="loading" class="flex-1 h-full">
          <div class="h-[200px] overflow-auto bg-slate-700">
            <pre class="px-2">
              <code class="language-json" v-if="originData" v-html="getSourceCodeHtml(originData)"/>
            </pre>
          </div>
        </el-card>
        <component
          :is="useRenderIcon('iconoir:arrow-right', { online: true })"
          class="w-10 h-10 text-lg"
        />
        <el-card header="转换数据" class="flex-1 h-full">
          <div class="h-[200px] overflow-auto bg-slate-700">
            <pre class="px-2">
              <code class="language-json" v-if="transformData" v-html="getSourceCodeHtml(transformData)"/>
            </pre>
          </div>
        </el-card>
      </div>
      <div class="text-center mt-4" />
    </div>
  </el-dialog>

  <el-input
    type="textarea"
    :rows="4"
    v-bind="$attrs"
    clearable
    placeholder="请输入"
  />

  <el-button class="mt-3" size="small" type="primary" @click="handleTransfrom">
    试一试
  </el-button>
</template>

<script setup lang="ts">
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.min.css";

import { ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { DataSource } from "../types";
import { getDataSourceData, getTransformData } from "../utils";
interface Props {
  dataSource: DataSource;
}
const props = defineProps<Props>();

const dialogVisible = ref(false);
const error = ref("");
const loading = ref(false);
const originData = ref(null);
const transformData = ref(null);

function getSourceCodeHtml(data) {
  const JSONString = JSON.stringify(data, undefined, 4);
  return Prism.highlight(JSONString, Prism.languages.html);
}

const getDataSource = async () => {
  loading.value = true;
  originData.value = await getDataSourceData(props.dataSource);
  loading.value = false;
};

const reset = () => {
  error.value = "";
  originData.value = "";
  transformData.value = "";
};

const handleTransfrom = async () => {
  reset();
  try {
    dialogVisible.value = true;
    await getDataSource();

    const { data, error: errorMessage } = getTransformData(
      originData.value,
      props.dataSource.adapter
    );

    transformData.value = data;
    error.value = errorMessage;
  } catch (error) {
    error.value = error.message;
  }
};
</script>
