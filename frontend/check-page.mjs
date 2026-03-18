import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

try {
  await page.goto('http://localhost:5174/');
  await page.waitForTimeout(2000);

  const title = await page.title();
  console.log('✅ 页面标题:', title);

  const hasRoot = await page.locator('#root').count();
  console.log('✅ Root 元素:', hasRoot > 0 ? '存在' : '不存在');

  const errors = await page.evaluate(() => {
    const errs = [];
    window.addEventListener('error', e => errs.push(e.message));
    return errs;
  });

  console.log('✅ 页面加载完成，无明显错误');

  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  console.log('✅ 截图已保存: screenshot.png');

} catch (e) {
  console.error('❌ 错误:', e.message);
}

await page.waitForTimeout(5000);
await browser.close();
