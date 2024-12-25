import { launch } from "puppeteer-core";
import type { LaunchOptions } from "puppeteer-core";
import { sleep } from "bun";

async function getPrice() {
  const launchOptions: LaunchOptions = {
    headless: true,
    executablePath: "/usr/bin/chromium",
  };
  const browser = await launch(launchOptions);
  const page = await browser.newPage();

  await page.goto("https://bartio.bex.berachain.com/");
  await sleep(1500);
  const checkbox = (await page.waitForSelector(`xpath///*[@id="terms"]`))!;
  await checkbox.click();
  await sleep(1500);
  const agree = (await page.waitForSelector(
    `xpath///*[@id="radix-:r3:"]/div[2]/div[5]/button[1]`,
  ))!;
  await agree.click();
  await sleep(2500);
  const price = (await page.waitForSelector(
    "xpath//html/body/div[2]/div[2]/main/div/section[1]/div/div[4]/div[2]/span/span[2]",
  ))!;
  const result = parseFloat(await price.evaluate((el) => el.textContent!));
  await browser.close();
  return result;
}

const Server = Bun.serve({
  port: 7615,
  hostname: "127.0.0.1",
  development: true,
  async fetch(req) {
    // const url = new URL(req.url);
    // const urlParams = new URLSearchParams(url.search);
    if (req.method === "GET") {
      const price = await getPrice();
      return new Response(JSON.stringify({ price: price }));
    }

    return new Response(JSON.stringify({ ok: false }));
  },
});
