<template>
  <div class="px-4 py-2">
    <FieldSourcePanel
      :groupType="groupType"
      v-for="groupType in groupTypes"
      :key="groupType"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
import FieldSourcePanel from "./FieldSourcePanel.vue";
import { GROUP_TYPE_NAME_MAP } from "../constant";
import { GroupType } from "../types";

const groupTypes = Object.keys(GROUP_TYPE_NAME_MAP) as GroupType[];
</script>
