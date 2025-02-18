import type { Component } from "vue";

// 数据来源类型
type DataSourceType = "STATIC" | "URL" | "DIC";
type DataSourceMethod = "get" | "post";
interface DataSourceOption {
  label: string;
  value: string;
}

type DataSourceValue = string | DataSourceOption[];

type DataSourceAdapterFunctionBody = string; // 函数形式转换器函数体
type DataSourceAdapterEnum = [string, string]; // [label-key,value-key] 形式转换器
type DataSourceAdapter = DataSourceAdapterFunctionBody | DataSourceAdapterEnum;

// 数据来源
interface DataSource {
  type: DataSourceType; // 数据来源类型 STATIC-静态 URL-接口地址 DIC-字典
  method?: DataSourceMethod; // 请求方法，只支持GET和POST,
  value: DataSourceValue;
  params?: any; // 参数，type为URL时有效
  adapter?: DataSourceAdapter; // 数据适配器，type为URL时有效
}

// 表单校验规则类型
type RuleType =
  | "string"
  | "number"
  | "boolean"
  | "method"
  | "regexp"
  | "integer"
  | "float"
  | "array"
  | "object"
  | "enum"
  | "date"
  | "url"
  | "hex"
  | "email";

type RuleTriggerType = "change" | "blur";

// 表单校验规则
interface FormRule {
  _id?: string; // 内部索引
  required: boolean;
  type?: RuleType;
  enum?: string[]; // type为enum时有效，格式为字符串数组，暂时直接输入json数组
  message?: string;
  trigger?: RuleTriggerType | RuleTriggerType[];
}

// 分组类型
type GroupType = "FORM" | "LAYOUT" | "ASSIST";

// prop基础选项
interface BaseOption {
  label: string;
  value: string | number | boolean;
}

// prop选项
type OptionItem = BaseOption | string;

// prop选项列表
type Options = OptionItem[];

// prop组件属性
interface PropComponentProps {
  [key: string]: any;
  options?: Options; // 配置项
}

// 组件通用prop Schema
interface CommonPropSchema {
  name?: string;
  tips?: string;
  type:
    | String
    | Number
    | Boolean
    | Array<any>
    | Object
    | Date
    | Function
    | Symbol;
  default?: any;
  multiple?: boolean; // 是否可以多选
  componentProps?: PropComponentProps;
}

// 配置项Props Schema
type FieldPropsSchema = Record<string, CommonPropSchema>;

// 配置项Schema
interface FieldSchema {
  name: string; // 表单项名称
  type: string; // 表单项类型
  groupType: GroupType; // 分组类型： 表单类型 ｜ 辅助类型 ｜ 布局类型
  icon: Component; // 表单项icon
  props: FieldPropsSchema; // 表单项可配置参数
  defaultValue?: (props: FieldProps) => any; // 组件默认值
  dataSource?: boolean; // 表单项目是否可配置数据源
  getExtra?: () => Record<string, any>; // 额外数据，生成Field时将注入
}

// 配置项列表Schema
type FieldSchemas = Array<FieldSchema>;

// 表单配置schema
type FormPropsSchema = Record<string, CommonPropSchema>;

// 配置props数据
type FieldProps = Record<string, any>;

// 表单props数据
type FormProps = Record<string, any>;

// 配置项数据
interface Field {
  id: string; // 表单数据id
  label?: string; // 表单数据标签
  "label-width"?: string | number; // 标签宽度
  prop?: string; // 表单数据prop
  type: string; // 表单项类型
  groupType: GroupType; // 表单分组类型
  props?: FieldProps; // props
  dataSource?: DataSource; // 数据源
  rules?: Array<FormRule>;
  children?: Fields;
}

type Fields = Array<Field>;

// 配置
interface Config {
  id?: string;
  name: string; // 配置名称
  props: FormProps; // 表单props
  fields: Fields; // 表单配置项
  model?: Record<string, any>; // 表单模型值，最终保存时生成根据fields生成
}

// 表单类型组件配置
interface FiledTypeComponentConfig {
  component: Component;
  previewComponent?: Component; // 预览组件，默认为component，没有时取component
  propsGetter?: (data: any) => Record<string, any>;
}

// 响应类型
interface ResponseType extends Promise<any> {
  data?: object;
  code?: number;
  msg?: string;
  desc?: string;
}

export type {
  GroupType,
  DataSourceType,
  DataSourceAdapter,
  DataSourceMethod,
  DataSource,
  OptionItem,
  Options,
  CommonPropSchema,
  FieldPropsSchema,
  FieldSchema,
  FieldSchemas,
  FormPropsSchema,
  FieldProps,
  FormProps,
  Field,
  Fields,
  Config,
  FiledTypeComponentConfig,
  ResponseType,
  FormRule
};
