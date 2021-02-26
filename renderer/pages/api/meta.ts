import type { NextApiRequest, NextApiResponse } from "next";
import playwright from "playwright";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = req.query.url as string;

  const browser = await playwright.chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(url);

  const title = await page.title();
  await browser.close();

  res.status(200).json({ title });
};
