import browser from 'webextension-polyfill';
import interact from 'interactjs';

// 创建按钮元素的函数
function createButton() {
  const button = document.createElement('button');

  // 设置按钮的样式以固定在右下角并使其圆形
  button.style.position = 'fixed';
  button.style.bottom = '20px'; // 距离底部20px
  button.style.right = '20px'; // 距离右侧20px
  button.style.zIndex = '10001'; // 确保按钮在其他元素之上
  button.style.width = '50px'; // 按钮宽度
  button.style.height = '50px'; // 按钮高度
  button.style.borderRadius = '50%'; // 圆形按钮
  button.style.border = '1px solid #ccc'; 
  button.style.backgroundColor = 'white'; // 背景颜色
  button.style.cursor = 'pointer'; // 鼠标指针样式
  button.style.padding = '0'; // 移除内边距
  button.style.overflow = 'hidden'; // 确保图片不会溢出按钮
  button.style.padding = '5px';

  // 创建图片元素
  const img = document.createElement('img');
  img.src = browser.runtime.getURL('assets/pencil.png'); // 假设图片位于 assets 文件夹中
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover'; // 确保图片填满按钮

  button.appendChild(img);

  return button;
}

// 创建iframe元素的函数
function createIframe() {
  const iframe = document.createElement('iframe');
  iframe.src = 'https://excalidraw.com/';
  iframe.style.border = 'none'; // 去掉边框
  iframe.style.backgroundColor = 'white';
  iframe.style.flexGrow = '1'; // 使iframe占据剩余空间
  iframe.style.borderRadius = '15px';

  return iframe;
}

// 创建窗口元素的函数
function createWindow(iframe: HTMLIFrameElement) {
  const windowDiv = document.createElement('div');
  windowDiv.style.position = 'fixed'; // 保持为固定定位
  windowDiv.style.top = '20px';

  // 计算 left 值
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  const windowWidth = 500; // 窗口的初始宽度
  const rightMargin = 20; // 原来距离右侧的距离
  const leftValue = viewportWidth - windowWidth - rightMargin;

  windowDiv.style.left = `${leftValue}px`; // 使用计算出的 left 值
  windowDiv.style.width = `${windowWidth}px`;
  windowDiv.style.height = '700px';
  windowDiv.style.zIndex = '10000';
  windowDiv.style.overflow = 'hidden'; // 允许滚动
  windowDiv.style.padding = '10px'; // 设置内边距
  windowDiv.style.backgroundColor = '#f0f0f0';
  windowDiv.style.borderRadius = '15px'; // 设置圆角
  windowDiv.style.display = 'none'; // 初始隐藏
  windowDiv.style.flexDirection = 'column'; // 垂直排列

  // 初始化 data-x 和 data-y 属性
  windowDiv.setAttribute('data-x', '0');
  windowDiv.setAttribute('data-y', '0');

  // 创建标题栏
  const titleBar = document.createElement('div');
  titleBar.style.backgroundColor = '#f0f0f0'; // 标题栏背景颜色
  titleBar.style.cursor = 'move'; // 鼠标指针样式
  titleBar.style.padding = '0 10px 10px 10px'; // 标题栏内边距
  titleBar.textContent = 'Move me'; // 标题栏文本

  windowDiv.appendChild(titleBar);
  windowDiv.appendChild(iframe);

  let isInteracting = false; // 新增：跟踪是否正在交互
  let resizeOverlay: HTMLDivElement | null = null;

  function createResizeOverlay() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '10002'; // 确保在最上层
    overlay.style.cursor = 'se-resize'; // 或根据调整方向设置不同的 cursor
    return overlay;
  }

  // 使用 Interact.js 实现拖拽和调整大小
  interact(titleBar)
    .draggable({
      listeners: {
        start() {
          isInteracting = true;
        },
        move(event) {
          if (!isInteracting) return; // 如果不在交互状态，则不执行移动逻辑
          const target = windowDiv;
          const x = (parseFloat(target.getAttribute('data-x') || '0') || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y') || '0') || 0) + event.dy;

          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute('data-x', x.toString());
          target.setAttribute('data-y', y.toString());
        },
        end() {
          isInteracting = false;
        },
      },
    });

  interact(windowDiv)
    .resizable({
      edges: { left: true, right: true, bottom: true }, // 移除 top 边界
      listeners: {
        start() {
          isInteracting = true;
          resizeOverlay = createResizeOverlay();
          document.body.appendChild(resizeOverlay);
        },
        move(event) {
          if (!isInteracting) return; // 如果不在交互状态，则不执行调整大小逻辑

          const target = event.target as HTMLElement;
          let x = parseFloat(target.getAttribute('data-x') || '0') || 0;
          let y = parseFloat(target.getAttribute('data-y') || '0') || 0;

          // 更新宽度高度
          const width = event.rect.width;
          const height = event.rect.height;

          // 更新位置
          if (event.edges.left) {
            x += event.deltaRect.left;
          }

          Object.assign(target.style, {
            width: `${width}px`,
            height: `${height}px`,
            transform: `translate(${x}px, ${y}px)`,
          });

          target.setAttribute('data-x', x.toString());
          target.setAttribute('data-y', y.toString());
        },
        end() {
          isInteracting = false;
          if (resizeOverlay) {
            document.body.removeChild(resizeOverlay);
            resizeOverlay = null;
          }
        },
      },
    });

  // 添加全局 mouseup 事件监听器
  document.addEventListener('mouseup', () => {
    if (isInteracting) {
      isInteracting = false;
      if (resizeOverlay) {
        document.body.removeChild(resizeOverlay);
        resizeOverlay = null;
      }
    }
  });

  // 禁用文本选择
  windowDiv.addEventListener('mousedown', (e) => {
    e.preventDefault(); // 防止文本选择
  });

  return windowDiv;
}

// 主函数
(async () => {
  const button = createButton();
  document.body.appendChild(button);

  const iframe = createIframe();
  const windowDiv = createWindow(iframe);
  document.body.appendChild(windowDiv);

  // 按钮点击事件
  button.addEventListener('click', () => {
    // 切换窗口的显示和隐藏
    if (windowDiv.style.display === 'none') {
      windowDiv.style.display = 'flex'; // 显示窗口
    } else {
      windowDiv.style.display = 'none'; // 隐藏窗口
    }
  });
})();
