import dotenv from "dotenv";

dotenv.config();

import loadCompanyUrls from "./actions/loadCompanies";
import extractData from "./actions/extractData";

(async () => {
  const sitemapUrl = process.env.SITEMAP_URL!;

  const urls = await loadCompanyUrls(sitemapUrl);

  await extractData(urls);
})();
