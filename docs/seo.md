# SEO maintenance

The source HTML contains all service checklists, FAQs, contact details and prices without requiring JavaScript. After changing the service catalog in `script.js`, run `node tools/build-seo.cjs` and commit the refreshed `index.html` too. Netlify also refreshes these automatically during deployment.

## Production domain

Netlify runs `node tools/build-seo.cjs --publish` and publishes only `dist/`. Set the Netlify environment variable `SITE_URL` to the official HTTPS origin when using a custom domain (no path, query or fragment). Otherwise the build uses Netlify's `URL`, the site's main production URL, rather than a preview URL. The build generates a consistent canonical link, social metadata, organization URL, `robots.txt` and `sitemap.xml`. Publishing fails if no production origin is available. For other hosts, set `SITE_URL`, run the same build and upload `dist/`.

## Follow-up required from the business owner

- Confirm the official domain and actual cities/regions served. Add those locations naturally to visible content before describing them in structured data. Do not claim an unverified service area or invent an address.
- Verify the production domain in Google Search Console, submit `/sitemap.xml`, and inspect the homepage URL to request indexing. Verification needs the owner's Google/DNS access.
- Create or complete the Google Business Profile with accurate service areas, phone, hours and website. Request honest reviews from real customers.
- Review Search Console impressions, clicks and search terms over time. Indexing, ranking and traffic gains are not guaranteed by these code changes.

Organization markup currently uses only known business information. LocalBusiness rich-result markup is deferred until the required real business details are available. There are no fabricated reviews or ratings. Deep Cleaning remains unavailable.

## Validation

Run `powershell -ExecutionPolicy Bypass -File tests/site-content.tests.ps1` and `node tests/seo.tests.cjs`. The SEO test builds ignored `dist/` files using `https://example.com` for assertions; do not upload that test output. Rebuild with the real production environment before publishing. After deployment, check the live homepage canonical, `/robots.txt`, `/sitemap.xml`, and the Search Console URL Inspection result.

References: [Google canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [business details](https://developers.google.com/search/docs/appearance/establish-business-details).
