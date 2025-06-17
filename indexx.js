const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3001;

let browser; // 用于复用浏览器实例

// 启动浏览器实例（仅在第一次请求时启动）
async function startBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
      defaultViewport: { width: 1920, height: 1080 }, // 提高默认视口分辨率
    });
  }
}

// 截图函数
async function captureScreenshot(url, selector) {
  const page = await browser.newPage();

  // 设置请求头，强制加载中文
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'zh-CN,zh;q=1.0',
  });

  // 设置浏览器语言为中文
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'language', { get: () => 'zh-CN' });
    Object.defineProperty(navigator, 'languages', { get: () => ['zh-CN', 'zh'] });
  });

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  const element = await page.$(selector);

  // 如果没有找到指定的选择器，默认截图整个页面
  if (!element) {
    console.log('Element not found, capturing full page screenshot.');
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
    const screenshotBuffer = await page.screenshot({ type: 'png' }); // 截取全页面
    await page.close(); // 关闭页面，释放页面内存
    return screenshotBuffer;
  }

  // 设置设备缩放因子，以提高分辨率
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 }); // 设置设备缩放因子为 2

  const screenshotBuffer = await element.screenshot({ type: 'png' }); // 使用 PNG 格式
  await page.close(); // 关闭页面，释放页面内存
  
  return screenshotBuffer;
}

// 路由：处理截图请求，使用 GET 请求接收参数
app.get('/screenshot', async (req, res) => {
  const { url, selectorCode } = req.query; // 从查询参数中获取 URL 和选择器
  // 对 selector 进行 URL 解码，确保选择器是有效的
  selector = decodeURIComponent(selectorCode);
  
  console.log("++++++++ selector: " + selector)

  if (!url) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    await startBrowser(); // 确保浏览器实例已启动
    const screenshotBuffer = await captureScreenshot(url, selector || 'body'); // 传入 URL 和选择器，默认为 body
    res.set('Content-Type', 'image/png');
    res.send(screenshotBuffer);
  } catch (err) {
    console.error('Error during screenshot request:', err);
    res.status(500).send('Failed to capture screenshot');
  }
});

// 启动服务
app.listen(port, () => {
  console.log(`Server is running at http://47.108.235.211:${port}`);
});
