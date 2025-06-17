const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = 3001;

let browser; // 全局复用浏览器实例

// 立即启动浏览器
(async () => {
  browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });
  console.log('Browser launched');
})();

app.get('/screenshot', async (req, res) => {
  const url = req.query.url || 'https://splatoon3.ink/salmonrun';
  const filename = `salmonrun_${Date.now()}.png`;
  const filepath = path.join(os.tmpdir(), filename);

  let page;

  try {
    if (!browser) {
      // 如果浏览器没启动，启动一个（兜底）
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox']
      });
    }

    page = await browser.newPage();

    // 你之前的语言环境设置和 viewport 设置
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'zh-CN,zh;q=0.9'
    });
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'language', { get: () => 'zh-CN' });
      Object.defineProperty(navigator, 'languages', { get: () => ['zh-CN', 'zh'] });
    });

    await page.setViewport({ width: 1600, height: 1200 });

    await page.goto(url, { waitUntil: 'networkidle2' });

    // 等待内容加载
    await page.waitForSelector('.content, main', { timeout: 10000 }).catch(() => {
      console.warn('Content selector not found, fallback to body');
    });
    await page.waitForTimeout(2000);

    const contentArea = await page.evaluate(() => {
      const content = document.querySelector('.content') ||
                      document.querySelector('main') ||
                      document.body;
      const rect = content.getBoundingClientRect();
      const scrollHeight = content.scrollHeight || document.body.scrollHeight;
      return {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        scrollHeight
      };
    });

    await page.setViewport({
      width: 1600,
      height: Math.min(2400, Math.ceil(contentArea.scrollHeight))
    });

    const clipX = Math.max(0, Math.floor(contentArea.x));
    const clipY = Math.max(0, Math.floor(contentArea.y));
    const clipWidth = Math.min(1600 - clipX, Math.floor(contentArea.width));
    const clipHeight = Math.min(2400 - clipY, Math.floor(contentArea.height));

    await page.screenshot({
      path: filepath,
      clip: { x: clipX, y: clipY, width: clipWidth, height: clipHeight }
    });

    res.sendFile(filepath, err => {
      if (err) console.error('Send file error:', err);
      fs.unlink(filepath, err => {
        if (err) console.error('Delete temp file error:', err);
      });
    });

  } catch (error) {
    console.error('Screenshot error:', error);
    res.status(500).json({ error: 'Failed to capture screenshot' });
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (e) {
        console.warn('Page close failed:', e);
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Screenshot service running at http://localhost:${PORT}`);
});
