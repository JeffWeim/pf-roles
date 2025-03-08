import fs from "fs";
import path from "path";
import getFilteredCompanyUrls from "./getCompanies";

async function loadCompanyUrls(sitemapUrl: string): Promise<string[]> {
  const filePath = path.resolve(__dirname, "../companies.json");

  if (fs.existsSync(filePath)) {
    console.log("Loading company URLs from cached file...");
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData);
  } else {
    console.log("companies.json not found. Fetching from sitemap...");
    await getFilteredCompanyUrls(sitemapUrl);

    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(fileData);
    } else {
      console.error("Failed to retrieve data after fetching.");
      return [];
    }
  }
}

export default loadCompanyUrls;
