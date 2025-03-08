import axios from "axios";
import { parseStringPromise } from "xml2js";
import fs from "fs";
import path from "path";

import dotenv from "dotenv";
dotenv.config();

async function getFilteredCompanyUrls(sitemapUrl: string): Promise<string[]> {
  try {
    const response = await axios.get(sitemapUrl);
    const xmlData = response.data;

    const parsedData = await parseStringPromise(xmlData);

    const urls: string[] = parsedData.urlset.url.map(
      (entry: any) => entry.loc[0],
    );

    const companyUrlRegex = new RegExp(process.env.COMPANY_URL_REGEX!);

    const filteredUrls = urls.filter((url) => companyUrlRegex.test(url));

    const filePath = path.resolve(__dirname, "../companies.json");

    fs.writeFileSync(filePath, JSON.stringify(filteredUrls, null, 2));

    console.log(`Filtered company URLs saved to: ${filePath}`);

    return filteredUrls;
  } catch (error) {
    console.error("Error fetching, parsing, or writing sitemap data:", error);
    return [];
  }
}

export default getFilteredCompanyUrls;
