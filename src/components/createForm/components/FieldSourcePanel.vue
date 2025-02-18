<template>
  <div class="mt-4 first-of-type:mt-0">
    <div class="font-semibold text-lg leading-5">{{ groupTypeName }}</div>
    <FieldSourceGroup
      :fileds="groupFields"
      v-bind="$attrs"
      v-if="groupFields.length"
    />
    <el-empty
      description="开发中..."
      :image-size="80"
      style="padding: 10px 0"
      v-else
    />
  </div>
</template>

<script setup lang="ts">
import FieldSourceGroup from "./FieldSourceGroup.vue";
import { GROUP_TYPE_NAME_MAP } from "../constant";
import { GroupType } from "../types";
import { getFieldSchemasByGroupType } from "../utils";
import { computed } from "vue";

interface Props {
  groupType: GroupType;
}

const props = defineProps<Props>();

const groupTypeName = computed(() => GROUP_TYPE_NAME_MAP[props.groupType]);
const groupFields = computed(() => getFieldSchemasByGroupType(props.groupType));
</script>
