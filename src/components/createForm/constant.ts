import {
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElRow,
  ElCol,
} from "element-plus";
import FieldTargetContainer from "./components/FieldTargetContainer.vue";
import {
  SelectType,
  RadioType,
  CheckboxType,
  GridType,
} from "./components/formComponents";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import type {
  CommonPropSchema,
  FieldSchema,
  FieldSchemas,
  FormPropsSchema,
  GroupType,
  FiledTypeComponentConfig,
} from "./types";

const DataSourceTypeOptions = [
  { label: "数据字典", value: "DIC" },
  { label: "接口地址", value: "URL" },
  { label: "固定数据", value: "STATIC" },
];
const DataSourceMethodList = ["get", "post"];

// 规则type
const RuleTypeList = [
  "string",
  "number",
  "boolean",
  "method",
  "regexp",
  "integer",
  "float",
  "array",
  "object",
  "enum",
  "date",
  "url",
  "hex",
  "email",
];

// 表单可配置参数
const FORM_PROPS_SCHEMA: FormPropsSchema = {
  inline: {
    name: "行内表单",
    type: Boolean,
    default: false,
  },
  size: {
    name: "尺寸控制",
    type: String,
    default: "small",
    tips: "设置所有表单项目默认尺寸（注意：mini在Element Plus下无效）",
    componentProps: {
      options: ["large", "default", "small", "mini"],
    },
  },
  "label-position": {
    name: "对齐方式",
    type: String,
    default: "right",
    componentProps: {
      options: ["left", "right", "top"],
    },
  },
  "label-width": {
    name: "标签宽度",
    type: String,
    default: "120px",
  },
};

// 公用props
const BASE_PROPS_SCHEMA: Record<string, CommonPropSchema> = {
  style: {
    name: "自定义样式",
    tips: "组件自定义样式，如width:100px;height:100%;",
    type: String,
    default: "",
  },
  class: {
    name: "自定义类名",
    tips: "组件自定义类名,如custom-input",
    type: String,
    default: "",
  },

  size: {
    name: "尺寸",
    type: String,
    tips: "设置表单项尺寸（注意：mini在Element Plus下无效）",
    default: "",
    componentProps: {
      options: ["large", "small", "mini"],
    },
  },
  clearable: {
    name: "一键清空",
    type: Boolean,
    default: false,
  },
  disabled: {
    name: "禁用状态",
    type: Boolean,
    default: false,
  },
};

// 可配置组件列表
const FORM_FIELDS_SCHEMA: FieldSchemas = [
  // 表单组件
  {
    name: "Input 输入框",
    type: "input",
    icon: useRenderIcon("formkit:text", { online: true }),
    groupType: "FORM",
    props: {
      ...BASE_PROPS_SCHEMA,
      type: {
        name: "输入类型",
        type: String,
        default: "text",
        componentProps: {
          options: ["text", "textarea"],
        },
      },
      placeholder: {
        name: "占位文字",
        type: String,
        default: "请输入",
      },
      "show-password": {
        name: "密码框",
        tips: "是否显示切换密码图标",
        type: Boolean,
        default: false,
      },
      maxlength: {
        name: "最大输入长度",
        type: Number,
      },
      minlength: {
        name: "最小输入长度",
        type: Number,
      },
      "show-word-limit": {
        name: "显示统计字数",
        type: Boolean,
        default: false,
      },
      "prefix-icon": {
        name: "前缀图标",
        type: String,
      },
      "suffix-icon": {
        name: "后缀图标",
        type: String,
      },
      rows: {
        name: "输入框行数",
        type: Number,
      },
      autosize: {
        name: "高度自适应",
        tips: "textarea 高度是否自适应，仅 type 为 'textarea' 时生效。 可以接受一个对象，比如: { minRows: 2, maxRows: 6 }",
        type: Boolean,
        default: false,
      },
    },
  },
  {
    name: "InputNumber 数字输入框",
    type: "inputNumber",
    icon: useRenderIcon("formkit:number", { online: true }),
    groupType: "FORM",
    props: {
      ...BASE_PROPS_SCHEMA,
      placeholder: {
        name: "占位文字",
        type: String,
        default: "",
      },
      min: {
        name: "最小值",
        type: Number,
        default: undefined,
      },
      max: {
        name: "最大值",
        type: Number,
        default: undefined,
      },
      step: {
        name: "步长",
        type: Number,
        default: 1,
      },
      "step-strictly": {
        name: "严格步长",
        tips: "是否只能输入 step 的倍数",
        type: Boolean,
        default: false,
      },
      precision: {
        name: "精度",
        type: Number,
        default: 0,
      },
    },
  },
  {
    name: "Select 选择器",
    type: "select",
    groupType: "FORM",
    icon: useRenderIcon("formkit:select", { online: true }),
    props: {
      ...BASE_PROPS_SCHEMA,
      multiple: {
        name: "多选",
        type: Boolean,
        default: false,
      },
      "collapse-tags": {
        name: "多选标签",
        tips: "多选时是否将选中值按文字的形式展示",
        type: Boolean,
        default: false,
      },
      "collapse-tags-tooltip": {
        name: "标签tooltip",
        tips: "当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签。 要使用此属性，collapse-tags属性必须设定为 true",
        type: Boolean,
        default: false,
      },
      "multiple-limit": {
        name: "多选限制",
        tips: "multiple 属性设置为 true 时，代表多选场景下用户最多可以选择的项目数， 为 0 则不限制",
        type: Number,
        default: 0,
      },
      placeholder: {
        name: "占位文字",
        type: String,
        default: "",
      },
      filterable: {
        name: "允许筛选",
        type: Boolean,
        default: false,
      },
      "allow-create": {
        name: "允许创建",
        tips: "是否允许用户创建新条目， 只有当 filterable 设置为 true 时才会生效。",
        type: Boolean,
        default: false,
      },
      "clear-icon": {
        name: "清除图标",
        type: String,
      },
      "suffix-icon": {
        name: "后缀图标",
        type: String,
      },
      "fit-input-width": {
        name: "宽度适应",
        tips: "下拉框的宽度是否与输入框相同",
        type: Boolean,
        default: false,
      },
    },
    dataSource: true,
    defaultValue: (props) => (props.multiple ? [] : ""),
  },
  {
    name: "Radio 单选框",
    type: "radio",
    icon: useRenderIcon("formkit:radio", { online: true }),
    groupType: "FORM",
    props: {
      ...BASE_PROPS_SCHEMA,
    },
    dataSource: true,
  },
  {
    name: "Checkbox 多选框",
    type: "checkbox",
    icon: useRenderIcon("formkit:checkbox", { online: true }),
    groupType: "FORM",
    props: {
      ...BASE_PROPS_SCHEMA,
      min: {
        name: "最小选择",
        type: Number,
      },
      max: {
        name: "最多选择",
        type: Number,
      },
    },
    defaultValue: () => [],
    dataSource: true,
  },
  {
    name: "Date Picker 日期选择器",
    type: "datePicker",
    icon: useRenderIcon("formkit:date", { online: true }),
    groupType: "FORM",
    props: {
      ...BASE_PROPS_SCHEMA,
      type: {
        name: "输入类型",
        type: String,
        default: "datetime",
        componentProps: {
          options: [
            "year",
            "month",
            "date",
            "dates",
            "datetime",
            "week",
            "datetimerange",
            "daterange",
            "monthrange",
          ],
        },
      },
      editable: {
        name: "可输入",
        type: Boolean,
        default: true,
      },
      placeholder: {
        tips: "非范围选择时的占位内容",
        type: String,
        default: "",
      },
      "start-placeholder": {
        type: String,
        tips: "范围选择时开始日期的占位内容",
        default: "",
      },
      "end-placeholder": {
        type: String,
        tips: "范围选择时结束日期的占位内容",
        default: "",
      },
      format: {
        name: "格式化",
        type: String,
        default: "YYYY-MM-DD",
      },
      "range-separator": {
        name: "范围分隔符",
        type: String,
        tips: "选择范围时的分隔符",
        default: "-",
      },
      "default-value": {
        tips: "可选，选择器打开时默认显示的时间",
        type: Date,
      },
      "default-time": {
        tips: "范围选择时选中日期所使用的当日内具体时刻",
        type: Date,
      },
      "value-format": {
        tips: "可选，绑定值的格式。 不指定则绑定值为 Date 对象",
        type: String,
      },
    },
  },

  // 布局组件

  {
    name: "Grid 网格",
    type: "grid",
    icon: useRenderIcon("uil:grid", { online: true }),
    groupType: "LAYOUT",
    props: {
      cols: {
        name: "列数",
        type: Number,
        default: 2,
      },
      gap: {
        name: "间隔宽度",
        type: Number,
        default: 10,
      },
      justify: {
        name: "水平排列",
        type: String,
        componentProps: {
          options: ["start", "end", "center", "stretch"],
        },
        default: "start",
      },
      align: {
        name: "垂直排列",
        type: String,
        componentProps: {
          options: ["start", "end", "center", "stretch"],
        },
        default: "start",
      },
    },
    getExtra: () => ({
      children: [],
    }),
  },

  {
    name: "Row 行",
    type: "row",
    icon: useRenderIcon("pixelarticons:layout-rows", { online: true }),
    groupType: "LAYOUT",
    props: {
      gutter: {
        name: "栅格间隔",
        type: Number,
        default: 0,
      },
      justify: {
        name: "水平排列",
        type: String,
        componentProps: {
          options: [
            "start",
            "end",
            "center",
            "space-around",
            "space-between",
            "space-evenly",
          ],
        },
        default: "start",
      },
      align: {
        name: "垂直排列",
        type: String,
        componentProps: {
          options: ["top", "middle", "bottom"],
        },
      },
    },
    getExtra: () => ({
      children: [],
    }),
  },

  {
    name: "Col 列",
    type: "col",
    icon: useRenderIcon("pixelarticons:view-col", { online: true }),
    groupType: "LAYOUT",
    props: {
      span: {
        name: "占据列数",
        type: Number,
        default: 24,
      },
      offset: {
        name: "间隔格数",
        type: Number,
        default: 0,
      },
    },
    getExtra: () => ({
      children: [],
    }),
  },
];

// 表单type与组件配置映射
const FIELD_TYPE_COMPONENT_CONFIG_MAP: Record<
  FieldSchema["type"],
  FiledTypeComponentConfig
> = {
  input: { component: ElInput },
  select: {
    component: SelectType,
    propsGetter: (data) => ({
      options: data,
    }),
  },
  datePicker: {
    component: ElDatePicker,
  },
  inputNumber: {
    component: ElInputNumber,
  },
  radio: {
    component: RadioType,
    propsGetter: (data) => ({
      options: data,
    }),
  },
  checkbox: {
    component: CheckboxType,
    propsGetter: (data) => ({
      options: data,
    }),
  },
  grid: {
    component: FieldTargetContainer,
    previewComponent: GridType,
  },
  row: {
    component: FieldTargetContainer,
    previewComponent: ElRow,
  },
  col: {
    component: FieldTargetContainer,
    previewComponent: ElCol,
  },
};

// 分组类型名称
const GROUP_TYPE_NAME_MAP: Record<GroupType, string> = {
  FORM: "表单组件",
  LAYOUT: "布局组件",
  ASSIST: "辅助组件",
};

export {
  FORM_PROPS_SCHEMA,
  FIELD_TYPE_COMPONENT_CONFIG_MAP,
  FORM_FIELDS_SCHEMA,
  GROUP_TYPE_NAME_MAP,
  DataSourceTypeOptions,
  DataSourceMethodList,
  RuleTypeList,
};
