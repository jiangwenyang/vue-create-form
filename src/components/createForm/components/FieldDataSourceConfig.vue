<!-- eslint-disable vue/no-mutating-props -->
<template>
  <el-form
    ref="formRef"
    :model="props.dataSource"
    :rules="formRules"
    label-suffix=": "
    :label-width="140"
  >
    <el-form-item prop="type" label="数据源类型">
      <el-select v-model="props.dataSource.type">
        <el-option
          v-for="item in DataSourceTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item v-if="isURLDataSource" prop="method" label="请求类型">
      <el-select v-model="props.dataSource.method">
        <el-option
          v-for="item in DataSourceMethodList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>

    <el-form-item prop="value" label="数据源内容">
      <SelectType
        v-if="isDicDataSource"
        :options="dicTypeList"
        v-model="props.dataSource.value"
        filterable
      />
      <el-tooltip
        v-else
        effect="dark"
        :content="valuePlaceholder"
        placement="top"
      >
        <el-input
          v-model="props.dataSource.value"
          :type="isStaticDataSource ? 'textarea' : 'text'"
          :rows="4"
          clearable
          placeholder="请输入"
        />
      </el-tooltip>
    </el-form-item>

    <el-form-item prop="params" label="数据源参数" v-if="isURLDataSource">
      <el-tooltip
        effect="dark"
        content="数据请求参数，JSON格式，将作为get请求的query或者post请求的data"
        placement="top"
      >
        <el-input
          v-model="props.dataSource.params"
          type="textarea"
          :rows="4"
          clearable
          placeholder="请输入"
        />
      </el-tooltip>
    </el-form-item>

    <el-form-item prop="params" label="数据转换" v-if="isURLDataSource">
      <template #label="{ label }">
        <div class="flex items-center whitespace-nowrap">
          <el-tooltip class="ml-1" effect="dark" placement="top">
            <template #content>
              对接口数据进行转换，支持两种定义方式：<br />
              1. 指定label和value的key，如 ["label-key","value-key"] <br />
              2. 定义函数（只需要书写函数体，接收data作为参数,
              可省略return），如 : data.map(item=>({
              label:item.name,value:item.id }))
            </template>
            <span class="flex items-center">
              {{ label }}
              <component
                class="block w-6 h-6 px-1"
                :is="useRenderIcon('formkit:info', { online: true })"
              />
            </span>
          </el-tooltip>
          :
        </div>
      </template>

      <AdapterInput
        v-model="props.dataSource.adapter"
        :dataSource="dataSource"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
// eslint-disable vue/no-mutating-props
import { ref, computed, watch } from "vue";
import { DataSourceTypeOptions, DataSourceMethodList } from "../constant";
import { SelectType } from "./formComponents";
import AdapterInput from "./AdapterInput.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { DataSource, DataSourceType } from "../types";
// import { getDicTypeData } from "@/api";
interface Props {
  dataSource: DataSource;
}

const valuePlaceholderMap: Record<DataSourceType, string> = {
  STATIC: `请输入JSON列表数据，如 [{
	"label": "label1",
	"value": 1
}, {
	"label": "label2",
	"value": 2
}]`,
  URL: "请输入请求地址,如 /common-services/version",
  DIC: "请选择数据字典编码",
};

const props = defineProps<Props>();
defineExpose({
  validate,
});

const formRef = ref(null);
const formRules = {
  value: [
    {
      required: true,
      message: "请输入数据源内容",
    },
  ],
};

const dicTypeList = ref([]);
const isURLDataSource = computed(() => props.dataSource.type === "URL");
const isDicDataSource = computed(() => props.dataSource.type === "DIC");
const isStaticDataSource = computed(() => props.dataSource.type === "STATIC");

watch(
  () => props.dataSource.type,
  (value) => {
    // eslint-disable-next-line vue/no-mutating-props
    props.dataSource.method = value === "URL" ? "get" : undefined;
    // eslint-disable-next-line vue/no-mutating-props
    props.dataSource.value = "";
    // eslint-disable-next-line vue/no-mutating-props
    props.dataSource.params = "";
  }
);

watch(
  () => isDicDataSource,
  (value) => {
    if (value.value) {
      getDicTypeList();
    }
  },
  { immediate: true }
);

const valuePlaceholder = computed(
  () => valuePlaceholderMap[props.dataSource.type]
);

async function getDicTypeList() {
  // TODO: 获取字典类型列表
  // const res = await getDicTypeData();
  const res = {};
  dicTypeList.value = (res.data || [])
    .sort(
      (a, b) =>
        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
    )
    .map((item) => ({
      label: item.dictName,
      value: item.id,
    }));
}

function validate() {
  return formRef.value && formRef.value.validate
    ? formRef.value.validate()
    : Promise.resolve(true);
}
</script>
