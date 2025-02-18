<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <el-form ref="formRef" :model="props.propsData" :label-width="140">
      <el-form-item
        :label="props.propsSchema[key].name || key"
        :prop="key"
        v-for="(value, key) in props.propsData"
        :key="key"
      >
        <template #label="{ label }">
          <div class="flex items-center whitespace-nowrap">
            <el-tooltip
              v-if="props.propsSchema[key].tips"
              class="ml-1"
              effect="dark"
              :content="props.propsSchema[key].tips"
              placement="top"
            >
              <span class="flex items-center">
                {{ label }}
                <component
                  class="block w-6 h-6 px-1"
                  :is="useRenderIcon('formkit:info', { online: true })"
                />
              </span>
            </el-tooltip>
            <span v-else>{{ label }}</span>
            :
          </div>
        </template>
        <component
          :is="getComponent(key)"
          v-bind="props.propsSchema[key].componentProps"
          v-model="props.propsData[key]"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getPropComponentFromPropShcema } from "../utils";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import type {
  FieldProps,
  FormProps,
  FieldPropsSchema,
  FormPropsSchema,
} from "../types";
interface Props {
  propsData: FieldProps | FormProps; // props数据
  propsSchema: FieldPropsSchema | FormPropsSchema; // props Schema
}

const props = defineProps<Props>();
defineExpose({
  validate,
});
const formRef = ref(null);
const getComponent = (key: string) =>
  getPropComponentFromPropShcema(props.propsSchema[key]);

function validate() {
  return formRef.value && formRef.value.validate();
}
</script>
