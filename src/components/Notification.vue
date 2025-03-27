<!-- src/components/Notification.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  type?: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const visible = ref(false)
let timeout: NodeJS.Timeout | null = null

const icons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
}

const colors = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
}

const backgrounds = {
  success: 'bg-green-50 dark:bg-green-900/20',
  error: 'bg-red-50 dark:bg-red-900/20',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20',
  info: 'bg-blue-50 dark:bg-blue-900/20',
}

onMounted(() => {
  if (props.show) {
    visible.value = true
    if (props.duration && props.duration > 0) {
      timeout = setTimeout(() => {
        visible.value = false
        emit('close')
      }, props.duration)
    }
  }
})

onUnmounted(() => {
  if (timeout) {
    clearTimeout(timeout)
  }
})

const close = () => {
  visible.value = false
  if (timeout) {
    clearTimeout(timeout)
  }
  emit('close')
}
</script>

<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
    >
      <div :class="[backgrounds[type || 'info'], 'p-4']">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <component
              :is="icons[type || 'info']"
              class="h-6 w-6"
              :class="colors[type || 'info']"
              aria-hidden="true"
            />
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ title }}
            </p>
            <p
              v-if="message"
              class="mt-1 text-sm text-gray-500 dark:text-gray-400"
            >
              {{ message }}
            </p>
          </div>
          <div class="ml-4 flex flex-shrink-0">
            <button
              type="button"
              class="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              @click="close"
            >
              <span class="sr-only">Close</span>
              <XMarkIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template> 