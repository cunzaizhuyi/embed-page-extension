<script setup lang="ts">
import { ref } from 'vue'
import browser from 'webextension-polyfill'
import { sendMessage } from 'webext-bridge/popup'
import packageJson from '../../package.json'
import Button from '~/components/Button.vue' // 导入 Button 组件

// 版本号
const version = packageJson.version // 获取版本号
const url = ref('https://excalidraw.com/')

async function updateIframeUrl() {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  })
  try {
    await sendMessage('updateIframeUrl', { url: url.value }, `content-script@${tabs[0].id}`)
  }
  catch (error) {
    console.error('Error sending message:', error)
  }
}
</script>

<template>
  <main class="w-[300px] px-4 py-5 text-gray-700">
    <h3>Click the icon in the bottom right corner of the page.</h3>

    <div class="my-30px flex flex-col items-end">
      <input v-model="url" type="text" placeholder="输入网址" class="w-full px-2 py-1 border rounded mb-2">
      <Button bg-color="#4CAF50" padding="5px 10px" @click="updateIframeUrl">
        Submit URL
      </Button>
    </div>

    <!-- 添加 GitHub 链接 -->
    <div class="mt-4 flex justify-center">
      <a
        href="https://github.com/cunzaizhuyi/embed-page-extension" target="_blank"
        class="flex items-center text-black hover:underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="w-5 h-5 mr-2">
          <path
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.54 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.83-.01-1.5-2.24.49-2.71-1.08-2.71-1.08-.36-.91-.88-1.15-.88-1.15-.72-.49.05-.48.05-.48.8.06 1.22.82 1.22.82.71 1.22 1.86.87 2.31.67.07-.51.28-.87.51-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.58.82-2.14-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.84A7.66 7.66 0 0 1 8 2.5c.68 0 1.36.09 2 .26 1.53-1.06 2.2-.84 2.2-.84.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.14 0 3.07-1.87 3.75-3.66 3.95.29.25.55.74.55 1.49 0 1.08-.01 1.95-.01 2.21 0 .21.15.46.55.38C13.71 14.54 16 11.54 16 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
      </a>
      <span>V{{ version }}</span> <!-- 在版本号前加大写的V -->
    </div>
  </main>
</template>
