<!-- eslint-disable vue/no-mutating-props -->
<template>
  <section>
    <el-divider content-position="center" border-style="dashed">
      校验规则配置
    </el-divider>

    <el-form
      ref="formRef"
      :model="props.field.rules"
      label-suffix=": "
      :label-width="86"
    >
      <div
        class="flex justify-between items-center gap-2"
        v-for="(rule, index) in props.field.rules"
        :key="rule._id"
      >
        <div
          class="flex-1 border border-dashed border-gray-300 pt-4 pr-6 mt-2 rounded-sm"
        >
          <el-form-item :prop="`${index}.type`" label="类型">
            <SelectType
              :options="RuleTypeList"
              v-model="rule.type"
              @change="val => handleTypeChange(val, rule)"
            />
          </el-form-item>

          <el-form-item :prop="`${index}.enum`" label="枚举值" v-if="rule.enum">
            <div
              v-for="(enumItem, enumItemIndex) in rule.enum"
              :key="enumItemIndex"
              class="flex items-center gap-2 mb-2"
            >
              <el-input
                placeholder="请输入枚举值"
                v-model="rule.enum[enumItemIndex]"
              />
              <div class="w-10 flex">
                <el-button
                  size="small"
                  icon="Remove"
                  type="danger"
                  v-if="rule.enum.length > 1"
                  @click="rule.enum.splice(enumItemIndex, 1)"
                />
                <el-button
                  size="small"
                  type="primary"
                  icon="CirclePlus"
                  v-if="enumItemIndex === rule.enum.length - 1"
                  @click="rule.enum.push('')"
                />
              </div>
            </div>
          </el-form-item>

          <el-form-item :prop="`${index}.required`" label="是否必填">
            <RadioType :options="requiredOptions" v-model="rule.required" />
          </el-form-item>

          <el-form-item :prop="`${index}.message`" label="提示信息">
            <el-input v-model="rule.message" placeholder="请输入提示信息" />
          </el-form-item>

          <el-form-item :prop="`${index}.trigger`" label="触发类型">
            <SelectType
              :options="triggerTypeList"
              v-model="rule.trigger"
              multiple
            />
          </el-form-item>
        </div>

        <div>
          <el-button
            size="small"
            icon="Remove"
            type="danger"
            @click="props.field.rules.splice(index, 1)"
          />
        </div>
      </div>
    </el-form>
    <div class="m-4 text-center">
      <el-button @click="handleAddRule" type="primary" icon="CirclePlus">
        添加规则
      </el-button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { nanoid } from "nanoid";

import type { Field } from "../types";
import { SelectType, RadioType } from "./formComponents";
import { RuleTypeList } from "../constant";
interface Props {
  field: Field;
}
const props = defineProps<Props>();
defineExpose({
  validate
});
const formRules = reactive({});

const formRef = ref(null);

const requiredOptions = [
  {
    label: "是",
    value: true
  },
  {
    label: "否",
    value: false
  }
];

const triggerTypeList = [
  {
    label: "blur",
    value: "blur"
  },
  {
    label: "change",
    value: "change"
  }
];

function handleTypeChange(type, rule) {
  rule.enum = type === "enum" ? [""] : undefined;
}

function handleAddRule() {
  // eslint-disable-next-line vue/no-mutating-props
  props.field.rules.push({
    _id: nanoid(),
    required: true,
    type: "string",
    message: "",
    trigger: ["blur", "change"]
  });
}

function validate() {
  return formRef.value ? formRef.value.validate() : Promise.resolve(true);
}
</script>
