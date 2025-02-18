import type { Component } from "vue";
import { nanoid } from "nanoid";
import { http } from "@/utils";
// import { getDict } from "@/api";
import { FORM_FIELDS_SCHEMA } from "./constant";

import {
  BooleanType,
  CheckboxType,
  DateType,
  InputNumberType,
  InputType,
  SelectType,
} from "./components/formComponents";

import type {
  Field,
  GroupType,
  FieldProps,
  FieldPropsSchema,
  CommonPropSchema,
  FieldSchema,
  DataSource,
  ResponseType,
  DataSourceType,
  Config,
  DataSourceAdapter,
} from "./types";

type DataSourceGetter = (dataSource: DataSource) => any;
type DataSourceMap = Record<DataSourceType, DataSourceGetter>;

/**
 * 生成Field
 * @param {FieldSchema} data
 * @return {*}  {Field}
 */
const generateFieldItem = (data: FieldSchema): Field => {
  const {
    name,
    type,
    groupType,
    props,
    dataSource,
    getExtra = () => ({}),
  } = data;
  const id = nanoid();

  const commonSchema = {
    id,
    type,
    groupType,
    props: getDefaultPropsFromFiledPropsSchema(props),
    ...getExtra(),
  };

  const groupTypeSchemaMap = {
    FORM: {
      prop: id,
      label: `${name}`,
      "label-width": "",
      dataSource: getDefaultDataSource(dataSource),
      rules: [],
    },
    LAYOUT: {},
    ASSIST: {},
  };

  const groupTypeSchema = groupTypeSchemaMap[groupType];

  return { ...commonSchema, ...groupTypeSchema };
};

/**
 * 根据groupType获取对应表单配置项
 * @param {GroupType} groupType
 */
const getFieldSchemasByGroupType = (groupType: GroupType) =>
  FORM_FIELDS_SCHEMA.filter((item) => item.groupType === groupType);

/**
 * 根据类型查找表单项Schema
 * @param {string} fieldType
 * @return {*}  {FieldSchema}
 */
const getFieldSchemaByType = (fieldType: string): FieldSchema => {
  return FORM_FIELDS_SCHEMA.find((item) => item.type === fieldType);
};

/**
 * 根据props配置获取props默认值
 * @param {FieldPropsSchema} filedProps
 * @return {*}
 */
const getDefaultPropsFromFiledPropsSchema = (
  fieldPropsSchema: FieldPropsSchema
): FieldProps => {
  return Object.entries(fieldPropsSchema).reduce(
    (props, [propName, propConfig]) => {
      const { default: defaultValue } = propConfig;
      return {
        ...props,
        [propName]: defaultValue,
      };
    },
    {}
  );
};

/**
 * 获取默认数据字典配置数据
 * @param {boolean} [hasDataSource] 是否支持数据字典
 * @return {*}  {DataSource} 数据字典
 */
const getDefaultDataSource = (hasDataSource?: boolean): DataSource => {
  if (!hasDataSource) {
    return undefined;
  }

  return {
    type: "DIC",
    method: undefined,
    value: "",
  };
};

/**
 * 根据propSchema返回prop对应组件
 * @param {CommonPropSchema} propSchema
 * @return {*}  {Component}
 */
const getPropComponentFromPropShcema = (
  propSchema: CommonPropSchema
): Component => {
  const { type, multiple, componentProps } = propSchema;

  const hasOptions = !!(
    componentProps &&
    componentProps.options &&
    componentProps.options.length
  );

  switch (true) {
    case hasOptions && multiple:
      return CheckboxType;
    case type === Number:
      return InputNumberType;
    case hasOptions:
      return SelectType;
    case type === Boolean:
      return BooleanType;
    case type === Date:
      return DateType;
    default:
      return InputType;
  }
};

/**
 * 获取静态数据源数据
 * @param {DataSource} dataSource
 * @return {*}
 */
const getStaticDataSourceData = (dataSource: DataSource) => {
  const { value } = dataSource;
  let data;

  try {
    data = JSON.parse(value as string);
  } catch (error) {
    console.log(error);
  }

  return data;
};

/**
 * 获取url数据源数据
 * @param {DataSource} dataSource
 * @return {*}
 */
const getUrlDataSourceData = async (dataSource: DataSource) => {
  const { method, value: url, params: paramsString } = dataSource;
  if (!url) {
    return;
  }

  const paramKeyMap = {
    get: "params",
    post: "data",
  };

  let params;

  try {
    params = JSON.parse(paramsString);
  } catch (error) {
    console.log(error);
  }

  const axiosParams = params
    ? {
        [paramKeyMap[method!]]: params,
      }
    : undefined;

  let data;

  try {
    const res = await http.request<ResponseType>({
      method,
      ...axiosParams,
    });
    data = res.data;
  } catch (error) {
    console.log(error);
  }

  return data;
};

/**
 * 获取数据字典数据源数据
 * @param {DataSource} dataSource
 * @return {*}
 */
const getDicCodeDataSourceData = async (dataSource: DataSource) => {
  const { value: dictId } = dataSource;
  if (!dictId) {
    return;
  }

  // TODO: 调用接口获取数据字典数据
  // const res = await getDict({
  //   dictId,
  //   dictItemStatus: 1,
  // });

  interface DicItem {
    dictItemName: string;
    dictItemValue: string;
    dictItemRemark: string;
  }

  const res: { data: DicItem[] } = { data: [] };

  return (res.data || []).map((item) => ({
    label: item.dictItemName || item.dictItemRemark,
    value: item.dictItemValue,
  }));
};

/**
 * 获取不同类型数据源数据
 * @param {DataSource} dataSource
 * @param {boolean} transform
 * @return {*}
 */
const getDataSourceData = async (dataSource: DataSource, transform = false) => {
  const { type } = dataSource;

  const typeHandlerMap: DataSourceMap = {
    STATIC: getStaticDataSourceData,
    URL: getUrlDataSourceData,
    DIC: getDicCodeDataSourceData,
  };

  let data = await typeHandlerMap[type](dataSource);

  if (dataSource.adapter && transform) {
    const result = getTransformData(data, dataSource.adapter);
    data = result.data;
  }

  return data;
};

/**
 * 获取适配器转换后的数据
 * @param {Record<string, any>[]} data 数据
 * @param {DataSourceAdapter} adapterJSONString 适配器｜可解析为适配器的JSON
 * @return {*}
 */
const getTransformData = (
  data: Record<string, any>[],
  adapterJSONString: DataSourceAdapter
) => {
  if (!adapterJSONString) {
    return {
      data: undefined,
      error: "暂未配置数据转换",
    };
  }

  const getArrayAdapterResult = (adapter) => {
    const [labelKey, valueKey] = adapter;
    return {
      data: (data || []).map((item) => ({
        label: item[labelKey],
        value: item[valueKey],
      })),
      error: undefined,
    };
  };

  const getFunctionAdapterResult = (adapter) => {
    try {
      if (!adapter.startsWith("return")) {
        adapter = `return ${adapter}`;
      }
      const adapterFunction = new Function("data", adapter);
      const result = adapterFunction(data);
      return {
        data: result,
        error: undefined,
      };
    } catch (error) {
      console.log(error);
      return {
        data: undefined,
        error: `执行函数适配器失败：${error.message}`,
      };
    }
  };

  const getAdapter = (adapterJSONString) => {
    if (Array.isArray(adapterJSONString)) {
      return { data: adapterJSONString, error: undefined };
    }

    try {
      return JSON.parse(adapterJSONString);
    } catch (error) {
      console.log(error);
      return adapterJSONString;
    }
  };

  const adapter = getAdapter(adapterJSONString);

  if (Array.isArray(adapter)) {
    return getArrayAdapterResult(adapter);
  } else {
    return getFunctionAdapterResult(adapter);
  }
};

/**
 * 校验表单配置
 * @param {Config} config
 * @return {*}
 */
const validateConfig = (config: Config) => {
  const { fields } = config;

  if (!fields.length) {
    return Promise.reject("请先添加表单项");
  }

  /**
   * 生成校验提示信息
   * @param {*} label
   * @param {number} index
   * @param {string} message
   * @return {*}
   */
  const getErrorMessage = (label, index: number, message: string) => {
    const nameMessage = label ? `表单项"${label}"` : `第${index + 1}条表单项`;
    return `${nameMessage}配置错误：“${message}”，请检查`;
  };

  /**
   * 校验表单fields
   * @param {*} fields
   * @return {*}
   */
  const validateFields = (fields) => {
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index];
      const { label, prop, type, groupType, children } = field;

      if (groupType === "FORM") {
        const filedSchema = getFieldSchemaByType(type);
        if (!label) {
          return Promise.reject(
            getErrorMessage(label, index, "标签文本不能为空")
          );
        }

        if (!prop) {
          return Promise.reject(
            getErrorMessage(label, index, "属性名不能为空")
          );
        }

        // TODO：校验数据源
        if (filedSchema.dataSource) {
          const { value } = field.dataSource;
          if (!value) {
            return Promise.reject(
              getErrorMessage(label, index, "数据源内容不能为空")
            );
          }
        }
      }

      if (children && children.length) {
        return validateFields(children);
      }
    }

    return Promise.resolve(true);
  };

  return validateFields(fields);
};

/**
 * 获取表单model
 * @param {Config} config
 */
const getFormModel = (config: Config) => {
  const _getFormModel = (fields) => {
    if (!(fields && fields.length)) {
      return {};
    }
    return fields.reduce((data, field) => {
      const { prop, props, type, groupType, children } = field;

      const filedModel = {};

      if (groupType === "FORM") {
        const filedSchema = getFieldSchemaByType(type);
        const { defaultValue } = filedSchema;

        filedModel[prop] = defaultValue ? defaultValue(props) : "";
      }

      const childrenModels = _getFormModel(children);

      return {
        ...data,
        ...filedModel,
        ...childrenModels,
      };
    }, {});
  };

  return _getFormModel(config.fields);
};

/**
 * 转换表单配置到字符串
 * @param {Config} config
 * @return {string}
 */
const stringifyConfig = (config: Config) => {
  return JSON.stringify(config);
};

/**
 * 获取布局样式
 * @param {Field["type"]} type
 * @param {Field["props"]} props
 * @return {*}
 */
const getLayoutStyle = (type: Field["type"], props: Field["props"]) => {
  const typeStyleGetterMap = {
    grid: () => {
      const style: any = {
        display: "grid",
      };

      const { cols, gap, justify, align } = props;

      if (cols) {
        style["grid-template-columns"] = `repeat(${cols},1fr)`;
      }

      if (gap) {
        style.gap = gap + "px";
      }

      if (justify) {
        style["justify-items"] = justify;
      }

      if (align) {
        style["align-items"] = align;
      }

      return style;
    },

    row: () => {
      const style: any = {
        display: "flex",
      };

      const { gutter, justify, align } = props;

      if (gutter) {
        style.gap = gutter + "px";
      }

      if (justify) {
        style["justify-content"] = justify;
      }

      if (align) {
        const alignStyleMap = {
          top: "start",
          middle: "center",
          bottom: "end",
        };
        const alignStyle = alignStyleMap[align];
        style["align-items"] = alignStyle;
      }

      return style;
    },
    col: () => {
      const sumCol = 24;
      const { offset, span } = props;
      const style: any = {};
      if (offset) {
        const offsetStyle = `${(offset / sumCol) * 100}%`;
        style["margin-left"] = offsetStyle;
      }

      if (span) {
        const spanStyle = `${(span / sumCol) * 100}%`;
        style["width"] = spanStyle;
      }

      return style;
    },
  };
  return typeStyleGetterMap[type]();
};

export {
  generateFieldItem,
  getFieldSchemasByGroupType,
  getFieldSchemaByType,
  getDefaultPropsFromFiledPropsSchema,
  getPropComponentFromPropShcema,
  getDefaultDataSource,
  getDataSourceData,
  validateConfig,
  stringifyConfig,
  getFormModel,
  getLayoutStyle,
  getTransformData,
};
