import { ref } from "vue";

export function useColumns() {
  const columns = ref([
    {
      label: "序号",
      type: "index",
      width: 70,
      align: "center",
      hide: ({ checkList }) => !checkList.includes("序号")
    },

    {
      label: "ID",
      prop: "id",
      //  width: 180,
      align: "center",
      hide: ({ checkList }) => !checkList.includes("ID")
    },
    {
      label: "表单名称",
      prop: "name",
      align: "center"
    },

    {
      label: "操作",
      slot: "operation",
      align: "center",
      width: 300
    }
  ]);

  return {
    columns
  };
}
