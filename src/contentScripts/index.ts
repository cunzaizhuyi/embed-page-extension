// 创建按钮元素的函数
function createButton() {
  const button = document.createElement('button')

  // 设置按钮的样式以固定在右下角并使其圆形
  button.style.position = 'fixed'
  button.style.bottom = '20px' // 距离底部20px
  button.style.right = '20px' // 距离右侧20px
  button.style.zIndex = '10001' // 确保按钮在其他元素之上
  button.style.width = '50px' // 按钮宽度
  button.style.height = '50px' // 按钮高度
  button.style.borderRadius = '50%' // 圆形按钮
  button.style.border = 'none' // 去掉边框
  button.style.backgroundColor = 'white' // 背景颜色
  button.style.cursor = 'pointer' // 鼠标指针样式

  // 创建SVG图标
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M2 12c0-1.1.9-2 2-2h1.5c.55 0 1 .45 1 1s-.45 1-1 1H4c-.55 0-1 .45-1 1s.45 1 1 1h1.5c.55 0 1 .45 1 1s-.45 1-1 1H4c-1.1 0-2-.9-2-2zm20 0c0 1.1-.9 2-2 2h-1.5c-.55 0-1-.45-1-1s.45-1 1-1H20c.55 0 1-.45 1-1s-.45-1-1-1h-1.5c-.55 0-1-.45-1-1s.45-1 1-1H20c1.1 0 2 .9 2 2zm-8-8c0-1.1.9-2 2-2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-4-8c0-1.1.9-2 2-2h1.5c.55 0 1 .45 1 1s-.45 1-1 1H10c-.55 0-1 .45-1 1s.45 1 1 1h1.5c.55 0 1 .45 1 1s-.45 1-1 1H10c-1.1 0-2-.9-2-2zm8-8c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
    </svg>
  `

  button.innerHTML = svgIcon // 将SVG图标插入按钮

  return button
}

// 创建iframe元素的函数
function createIframe() {
  const iframe = document.createElement('iframe')
  iframe.src = 'https://excalidraw.com/'
  iframe.style.border = 'none' // 去掉边框
  iframe.style.backgroundColor = 'white'
  iframe.style.flexGrow = '1' // 使iframe占据剩余空间
  iframe.style.borderRadius = '15px'

  return iframe
}

// 创建窗口元素的函数
function createWindow(iframe: HTMLIFrameElement) {
  const windowDiv = document.createElement('div')
  windowDiv.style.position = 'fixed'
  windowDiv.style.top = '20px'
  windowDiv.style.right = '20px'
  windowDiv.style.width = '500px'
  windowDiv.style.height = '700px'
  windowDiv.style.zIndex = '10000'
  windowDiv.style.display = 'none' // 初始隐藏
  windowDiv.style.resize = 'both' // 允许调整大小
  windowDiv.style.overflow = 'hidden' // 允许滚动
  windowDiv.style.padding = '10px' // 设置内边距
  windowDiv.style.backgroundColor = '#f0f0f0'
  windowDiv.style.borderRadius = '15px' // 设置圆角
  windowDiv.style.display = 'flex' // 使用flex布局
  windowDiv.style.flexDirection = 'column' // 垂直排列

  // 创建标题栏
  const titleBar = document.createElement('div')
  titleBar.style.backgroundColor = '#f0f0f0' // 标题栏背景颜色
  titleBar.style.cursor = 'move' // 鼠标指针样式
  titleBar.style.padding = '0 10px 10px 10px' // 标题栏内边距
  titleBar.textContent = 'Move me' // 标题栏文本

  windowDiv.appendChild(titleBar)
  windowDiv.appendChild(iframe)

  // 允许拖动窗口
  let isDragging = false
  let isResizing = false
  let offsetX: number, offsetY: number
  let startWidth: number, startHeight: number

  titleBar.addEventListener('mousedown', (e) => {
    isDragging = true
    offsetX = e.clientX - windowDiv.getBoundingClientRect().left
    offsetY = e.clientY - windowDiv.getBoundingClientRect().top
  })

  // 添加鼠标移动事件以处理窗口大小调整
  windowDiv.addEventListener('mousemove', (e) => {
    const rect = windowDiv.getBoundingClientRect()
    const isOnLeftEdge = e.clientX >= rect.left - 10 && e.clientX <= rect.left
    const isOnRightEdge = e.clientX >= rect.right - 10 && e.clientX <= rect.right
    const isOnTopEdge = e.clientY >= rect.top - 10 && e.clientY <= rect.top
    const isOnBottomEdge = e.clientY >= rect.bottom - 10 && e.clientY <= rect.bottom

    const isOnTopLeftCorner = isOnLeftEdge && isOnTopEdge
    const isOnTopRightCorner = isOnRightEdge && isOnTopEdge
    const isOnBottomLeftCorner = isOnLeftEdge && isOnBottomEdge
    const isOnBottomRightCorner = isOnRightEdge && isOnBottomEdge

    if (isOnBottomRightCorner || isOnTopLeftCorner) {
      windowDiv.style.cursor = 'nwse-resize' // 右下角或左上角
    }
    else if (isOnBottomLeftCorner || isOnTopRightCorner) {
      windowDiv.style.cursor = 'nesw-resize' // 左下角或右上角
    }
    else if (isOnRightEdge || isOnLeftEdge) {
      windowDiv.style.cursor = 'ew-resize' // 右边或左边
    }
    else if (isOnBottomEdge || isOnTopEdge) {
      windowDiv.style.cursor = 'ns-resize' // 底边或顶边
    }
    else {
      windowDiv.style.cursor = 'default' // 默认光标
    }
  })

  windowDiv.addEventListener('mousedown', (e) => {
    const rect = windowDiv.getBoundingClientRect()
    if (e.clientX >= rect.right - 10 && e.clientY >= rect.bottom - 10) {
      isResizing = true
      startWidth = rect.width
      startHeight = rect.height
    }
    else if (e.clientX <= rect.left + 10 && e.clientY >= rect.bottom - 10) {
      isResizing = true
      startWidth = rect.width
      startHeight = rect.height
      offsetX = -10 // 处理左边
    }
    else if (e.clientX >= rect.right - 10 && e.clientY <= rect.top + 10) {
      isResizing = true
      startWidth = rect.width
      startHeight = rect.height
      offsetY = -10 // 处理上边
    }
    else if (e.clientX <= rect.left + 10 && e.clientY <= rect.top + 10) {
      isResizing = true
      startWidth = rect.width
      startHeight = rect.height
      offsetX = -10 // 处理左边
      offsetY = -10 // 处理上边
    }
    else if (e.clientX >= rect.right - 10 && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      isResizing = true
      startWidth = rect.width
      startHeight = rect.height
      offsetY = -10 // 处理上边
    }
    else if (e.clientX <= rect.left + 10 && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      isResizing = true
      startWidth = rect.width
      startHeight = rect.height
      offsetY = -10 // 处理上边
    }
  })

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      windowDiv.style.left = `${e.clientX - offsetX}px`
      windowDiv.style.top = `${e.clientY - offsetY}px`
    }
    else if (isResizing) {
      const rect = windowDiv.getBoundingClientRect()
      if (offsetX === -10 && offsetY === -10) { // 左上角
        const newWidth = startWidth - (e.clientX - rect.left)
        const newHeight = startHeight - (e.clientY - rect.top)
        windowDiv.style.width = `${newWidth}px`
        windowDiv.style.height = `${newHeight}px`
        windowDiv.style.left = `${e.clientX}px`
        windowDiv.style.top = `${e.clientY}px`
      }
      else if (offsetX === -10) { // 左边
        const newWidth = startWidth - (e.clientX - rect.left)
        windowDiv.style.width = `${newWidth}px`
        windowDiv.style.left = `${e.clientX}px`
      }
      else if (offsetY === -10) { // 上边
        const newHeight = startHeight - (e.clientY - rect.top)
        windowDiv.style.height = `${newHeight}px`
        windowDiv.style.top = `${e.clientY}px`
      }
      else { // 右下角
        const newWidth = startWidth + (e.clientX - rect.left - startWidth)
        const newHeight = startHeight + (e.clientY - rect.top - startHeight)
        windowDiv.style.width = `${newWidth}px`
        windowDiv.style.height = `${newHeight}px`
      }
    }
  })

  document.addEventListener('mouseup', () => {
    isDragging = false
    isResizing = false
    windowDiv.style.cursor = 'default' // 重置光标
  })

  return windowDiv
}

// 主函数
(async () => {
  const button = createButton()
  document.body.appendChild(button)

  const iframe = createIframe()
  const windowDiv = createWindow(iframe)
  document.body.appendChild(windowDiv)

  // 按钮点击事件
  button.addEventListener('click', () => {
    // 切换窗口的显示和隐藏
    if (windowDiv.style.display === 'none') {
      windowDiv.style.display = 'block' // 显示窗口
    }
    else {
      windowDiv.style.display = 'none' // 隐藏窗口
    }
  })
})()
