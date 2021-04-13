import type { NextApiRequest, NextApiResponse } from "next";
import playwright from "playwright";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = req.query.url as string;

  const browser = await playwright.chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.setViewportSize({
    width: 1200,
    height: 630,
  });

  await page.goto(url);
  await sleep(1000);
  const image = await page.screenshot({ type: "png" });
  await browser.close();
  res.setHeader("Content-Type", "image/png");
  res.end(image);
};

const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
