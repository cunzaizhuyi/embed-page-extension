<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  bgColor: {
    type: String,
    default: '#d64ba1',
  },
  txtColor: {
    type: String,
    default: '#ffffff',
  },
  padding: {
    type: String,
    default: '7px 15px',
  },
})

const emit = defineEmits(['click'])

const computedStyle = computed(() => ({
  backgroundColor: props.bgColor,
  color: props.txtColor,
  padding: props.padding,
  border: 'none',
  borderRadius: '12px',
  cursor: props.disabled ? 'not-allowed' : 'pointer',
}))

function onClick() {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<template>
  <button :disabled="disabled" class="my-button" :style="computedStyle" @click="onClick">
    <slot>按钮</slot> <!-- 使用 slot 传递文本 -->
  </button>
</template>

<style scoped>
.my-button {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 12px;
}
</style>
