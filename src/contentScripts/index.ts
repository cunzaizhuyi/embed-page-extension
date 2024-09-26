import browser from 'webextension-polyfill'
import interact from 'interactjs'
import { onMessage } from 'webext-bridge/content-script'
import './style.css'

// 创建按钮元素的函数
function createButton() {
  const button = document.createElement('button')
  button.className = 'fd-button'
  button.title = 'Embed Page Extension'

  // 创建图片元素
  const img = document.createElement('img')
  img.src = browser.runtime.getURL('assets/pencil.png')
  img.className = 'fd-button-img'

  button.appendChild(img)
  return button
}

// 修改 createIframe 函数
function createIframe() {
  const iframe = document.createElement('iframe')
  iframe.src = 'https://excalidraw.com/'
  iframe.className = 'fd-iframe'
  return iframe
}

// 创建窗口元素的函数
function createWindow(iframe: HTMLIFrameElement) {
  const windowDiv = document.createElement('div')
  windowDiv.className = 'fd-window'

  // 计算 left 值
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth
  const windowWidth = 500 // 窗口的初始宽度
  const rightMargin = 20 // 原来距离右侧的距离
  const leftValue = viewportWidth - windowWidth - rightMargin

  windowDiv.style.left = `${leftValue}px` // 使用计算出的 left 值

  // 初始化 data-x 和 data-y 属性
  windowDiv.setAttribute('data-x', '0')
  windowDiv.setAttribute('data-y', '0')

  // 创建标题栏
  const titleBar = document.createElement('div')
  titleBar.className = 'fd-title-bar'
  titleBar.textContent = 'Move me' // 标题栏文本

  windowDiv.appendChild(titleBar)
  windowDiv.appendChild(iframe)

  let isInteracting = false // 新增：跟踪是否正在交互
  let resizeOverlay: HTMLDivElement | null = null

  function createResizeOverlay() {
    const overlay = document.createElement('div')
    overlay.className = 'fd-resize-overlay'
    return overlay
  }

  // 使用 Interact.js 实现拖拽和调整大小
  interact(titleBar)
    .draggable({
      listeners: {
        start() {
          isInteracting = true
        },
        move(event) {
          if (!isInteracting)
            return // 如果不在交互状态，则不执行移动逻辑
          const target = windowDiv
          const x = (Number.parseFloat(target.getAttribute('data-x') || '0') || 0) + event.dx
          const y = (Number.parseFloat(target.getAttribute('data-y') || '0') || 0) + event.dy

          target.style.transform = `translate(${x}px, ${y}px)`
          target.setAttribute('data-x', x.toString())
          target.setAttribute('data-y', y.toString())
        },
        end() {
          isInteracting = false
        },
      },
    })

  interact(windowDiv)
    .resizable({
      edges: { left: true, right: true, bottom: true }, // 移除 top 边界
      listeners: {
        start() {
          isInteracting = true
          resizeOverlay = createResizeOverlay()
          document.body.appendChild(resizeOverlay)
        },
        move(event) {
          if (!isInteracting)
            return // 如果不在交互状态，则不执行调整大小逻辑

          const target = event.target as HTMLElement
          let x = Number.parseFloat(target.getAttribute('data-x') || '0') || 0
          const y = Number.parseFloat(target.getAttribute('data-y') || '0') || 0

          // 更新宽度高度
          const width = event.rect.width
          const height = event.rect.height

          // 更新位置
          if (event.edges.left) {
            x += event.deltaRect.left
          }

          Object.assign(target.style, {
            width: `${width}px`,
            height: `${height}px`,
            transform: `translate(${x}px, ${y}px)`,
          })

          target.setAttribute('data-x', x.toString())
          target.setAttribute('data-y', y.toString())
        },
        end() {
          isInteracting = false
          if (resizeOverlay) {
            document.body.removeChild(resizeOverlay)
            resizeOverlay = null
          }
        },
      },
    })

  // 添加全局 mouseup 事件监听器
  document.addEventListener('mouseup', () => {
    if (isInteracting) {
      isInteracting = false
      if (resizeOverlay) {
        document.body.removeChild(resizeOverlay)
        resizeOverlay = null
      }
    }
  })

  // 禁用文本选择
  windowDiv.addEventListener('mousedown', (e) => {
    e.preventDefault() // 防止文本选择
  })

  return windowDiv
}

let globalIframe: HTMLIFrameElement

// 修改 onMessage 的使用，添加类型断言
onMessage('updateIframeUrl', ({ data }) => {
  if (data && typeof (data as { url: string }).url === 'string') {
    const url = (data as { url: string }).url
    globalIframe.src = url
  }
  else {
    console.error('Invalid message data:', data)
  }
});

// 主函数
(async () => {
  const button = createButton()
  document.body.appendChild(button)

  globalIframe = createIframe()
  const windowDiv = createWindow(globalIframe)
  windowDiv.style.display = 'none'
  document.body.appendChild(windowDiv)

  // 按钮点击事件
  button.addEventListener('click', () => {
    // 切换窗口的显示和隐藏
    if (windowDiv.style.display === 'none') {
      windowDiv.style.display = 'flex' // 显示窗口
    }
    else {
      windowDiv.style.display = 'none' // 隐藏窗口
    }
  })
})()
