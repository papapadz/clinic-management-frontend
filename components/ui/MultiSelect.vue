<script setup lang="ts">
import { computed, ref } from 'vue'

const model = defineModel<string[]>({
  required: true
})

const props = defineProps({
  options: {
    type: Array as () => { code: string; name: string }[],
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Add item...'
  }
})

const selectedValue = ref('')

const availableOptions = computed(() =>
  props.options.filter(
    option => !model.value.includes(option.code)
  )
)

function addItem() {
  if (
    selectedValue.value &&
    !model.value.includes(selectedValue.value)
  ) {
    model.value.push(selectedValue.value)
  }

  selectedValue.value = ''
}

function removeItem(code: string) {
  model.value = model.value.filter(item => item !== code)
}

function getLabel(code: string) {
  return (
    props.options.find(item => item.code === code)?.name ??
    code
  )
}
</script>

<template>
  <div class="multi-select">
    <select
      v-model="selectedValue"
      class="field-input"
      @change="addItem"
    >
      <option value="">
        {{ placeholder }}
      </option>

      <option
        v-for="option in availableOptions"
        :key="option.code"
        :value="option.code"
      >
        {{ option.name }}
      </option>
    </select>
  
    <div v-if="model.length" class="tags pt-[5px]">
      <span
        v-for="code in model"
        :key="code"
        class="tag"
      >
        {{ getLabel(code) }}

        <button
          type="button"
          class="tag-remove"
          @click="removeItem(code)"
        >
          ×
        </button>
      </span>
    </div>

  </div>
</template>

<style scoped>
.multi-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #eef4ff;
  border: 1px solid #cddcff;
  font-size: 13px;
}

.tag-remove {
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: bold;
}

.selection-count {
  color: #6b7280;
  font-size: 12px;
}

.field-input {
  @apply h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-ring/15;
}
</style>