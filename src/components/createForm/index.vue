<template>
  <div
    class="h-full flex-1 flex flex-col create-form-container"
    v-loading="configLoading"
    element-loading-text="表单配置加载中..."
  >
    <div class="flex-1 flex overflow-hidden">
      <aside class="w-1/6 flex-shrink-0 bg-white h-full overflow-y-auto">
        <FieldSource />
      </aside>

      <main class="flex-1 overflow-auto">
        <FieldTarget
          :currentField="currentField"
          :config="config"
          @generate="handleGenerate"
          @reset="handleReset"
          @view="handleView"
        />
      </main>

      <aside class="w-1/4 flex-shrink-0 bg-white h-full">
        <FieldAndFormConfig
          ref="fieldAndFormConfigRef"
          :current-field="currentField"
          :config="config"
        />
      </aside>
    </div>

    <footer
      class="bg-white px-8 pt-4 rounded-sm shadow-sm flex justify-between border-t border-gray-200"
    >
      <el-form ref="baseForm" :model="config" :rules="baseFormRules" inline>
        <el-form-item label="表单名称" prop="name">
          <el-input
            v-model="config.name"
            clearable
            class="w-28"
            placeholder="请输入表单名称"
          />
        </el-form-item>
      </el-form>

      <div class="flex gap-2">
        <el-button type="primary" @click="handleSave" :loading="editLoading">
          保存
        </el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </footer>

    <Preview v-model="previewVisible" :config="config" />

    <GenerateComponentPreview v-model="generateVisible" :config="config" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import { FormInstance, FormRules, ElMessage } from "element-plus";
import { merge } from "lodash";

// import {
//   getForm,
//   saveForm,
// } from "@/api";

import FieldSource from "./components/FieldSource.vue";
import FieldTarget from "./components/FieldTarget.vue";
import FieldAndFormConfig from "./components/Config.vue";
import Preview from "./components/Preview.vue";
import GenerateComponentPreview from "./components/GenerateComponentPreview.vue";

import type { Config, Field } from "./types";
import { FORM_PROPS_SCHEMA } from "./constant";
import {
  generateFieldItem,
  getDefaultPropsFromFiledPropsSchema,
  getFormModel,
  validateConfig,
  stringifyConfig,
} from "./utils";

const route = useRoute();
const router = useRouter();
const configId = computed(() => route.query.id);
const defaultConfig = {
  name: "",
  props: getDefaultPropsFromFiledPropsSchema(FORM_PROPS_SCHEMA),
  fields: [],
};

const baseForm = ref<FormInstance>(null);
const baseFormRules: FormRules = {
  name: [
    {
      required: true,
      message: "请输入表单名称",
    },
  ],
};

let config = ref<Config>(JSON.parse(JSON.stringify(defaultConfig)));
let configLoading = ref(false);
let editLoading = ref(false);

const fieldAndFormConfigRef = ref(null);

let currentField = ref<Field>(null);

const previewVisible = ref(false);
const generateVisible = ref(false);

watchEffect(getConfig);

// 获取配置
async function getConfig() {
  const baseConfig = JSON.parse(JSON.stringify(defaultConfig));
  if (configId.value) {
    configLoading.value = true;
    // TODO: 调用接口获取表单
    // const res = await getForm({ id: configId.value });
    configLoading.value = false;
    const { name, id, formJson } = res.data;
    let configData = {};
    try {
      configData = JSON.parse(formJson);
    } catch (error) {
      console.log(error);
    }

    // 使用merge兼容老数据
    config.value = merge({}, baseConfig, configData, {
      name,
      id,
    });
  } else {
    config.value = baseConfig;
  }
}

provide("generateFieldItem", generateFieldItem);
provide("updateCurrentField", updateCurrentField);

async function save() {
  const { name, id } = config.value;
  config.value.model = getFormModel(config.value);
  editLoading.value = true;
  const formJson = stringifyConfig(config.value);

  // TODO: 调用接口保存表单
  // const res = await saveForm({
  //   name,
  //   id,
  //   formJson,
  // });
  editLoading.value = false;

  ElMessage.success(`${id ? "编辑" : "新增"}表单成功！`);

  if (!config.value.id && res.data.id) {
    config.value.id = res.data.id;
  }
}

// 处理点击保存
function handleSave() {
  baseForm.value
    .validate()
    .then(
      () => validateConfig(config.value).then(save),
      (error) => {
        console.log(error);
      }
    )
    .catch((error) => {
      ElMessage.error({
        message: error,
      });
    });
}

function updateCurrentField(data) {
  currentField.value = data;
}

// 处理点击重置
function handleReset() {
  config.value.fields = [];
  currentField.value = null;
}

// 处理预览生成组件
function handleGenerate() {
  config.value.model = getFormModel(config.value);
  generateVisible.value = true;
}

// 处理点击预览
function handleView() {
  previewVisible.value = true;
}
// 处理点击取消
function handleCancel() {
  router.push("/base/createForm");
}
</script>

<style lang="scss" scoped>
.create-form-container {
  margin: 0 !important;
}
</style>
