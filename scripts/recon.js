const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const URL = 'https://www.meuassessor.com/';

async function run() {
  console.log('Starting puppeteer...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Set viewport to desktop
  await page.setViewport({ width: 1440, height: 1080 });
  console.log(`Navigating to ${URL}...`);
  await page.goto(URL, { waitUntil: 'networkidle2' });

  console.log('Taking desktop screenshot...');
  await page.screenshot({ path: path.join(__dirname, '../docs/design-references/desktop-1440px.png'), fullPage: true });

  // Extract Global Styles and Assets
  console.log('Extracting global styles and assets...');
  const extractedData = await page.evaluate(() => {
    // Colors
    const colors = new Set();
    const fonts = new Set();
    
    document.querySelectorAll('*').forEach(el => {
      const cs = getComputedStyle(el);
      if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') colors.add(cs.backgroundColor);
      if (cs.color && cs.color !== 'rgba(0, 0, 0, 0)') colors.add(cs.color);
      if (cs.fontFamily) fonts.add(cs.fontFamily);
    });

    return {
      colors: Array.from(colors),
      fonts: Array.from(fonts),
      images: [...document.querySelectorAll('img')].map(img => ({
        src: img.src || img.currentSrc,
        alt: img.alt,
        width: img.naturalWidth,
        height: img.naturalHeight,
        parentClasses: img.parentElement ? img.parentElement.className : '',
      })),
      videos: [...document.querySelectorAll('video')].map(v => ({
        src: v.src || (v.querySelector('source') ? v.querySelector('source').src : ''),
      })),
      backgroundImages: [...document.querySelectorAll('*')].filter(el => {
        const bg = getComputedStyle(el).backgroundImage;
        return bg && bg !== 'none';
      }).map(el => ({
        url: getComputedStyle(el).backgroundImage,
        element: el.tagName + '.' + (el.className && typeof el.className === 'string' ? el.className.split(' ')[0] : '')
      })),
      favicons: [...document.querySelectorAll('link[rel*="icon"]')].map(l => ({ href: l.href, sizes: l.sizes ? l.sizes.toString() : '' }))
    };
  });

  fs.writeFileSync(path.join(__dirname, '../docs/research/globals.json'), JSON.stringify(extractedData, null, 2));

  // Switch to mobile viewport
  await page.setViewport({ width: 390, height: 844 });
  console.log('Taking mobile screenshot...');
  // Wait a little bit for layout to adjust
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(__dirname, '../docs/design-references/mobile-390px.png'), fullPage: true });

  await browser.close();
  console.log('Reconnaissance complete.');
}

run().catch(console.error);
