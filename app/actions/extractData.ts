import { chromium } from "playwright";
import handleRoleData from "./handleRoleData";

async function extractData(urls: string[]) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const url of urls) {
    await new Promise(async (resolve) => await setTimeout(resolve, 3000));

    await page.goto(url, { waitUntil: "domcontentloaded" });

    const extractedData = await page.evaluate(
      () => window.__NEXT_DATA__?.props?.pageProps?.data || null,
    );

    if (!extractedData) return false;

    const roles = extractedData?.roles;
    const company = {
      description: extractedData.description || "",
      linkedinUrl: extractedData.linkedinUrl || "",
      name: extractedData.name.trim() || "",
      size: extractedData.size || null,
      url: extractedData.websiteUrl || "",
    };

    if (roles.length > 0) {
      await handleRoleData(roles, company);
    } else {
      return false;
    }
  }

  await browser.close();
}

export default extractData;
