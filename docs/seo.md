# SEO maintenance

The source HTML contains all service checklists, FAQs, contact details and prices without requiring JavaScript. After changing the service catalog in `script.js`, run `node tools/build-seo.cjs` and commit the refreshed `index.html` too. Netlify also refreshes these automatically during deployment.

## Production domain

The official domain is `https://triplecleaning.ie/`. Netlify runs `node tools/build-seo.cjs --publish` and publishes only `dist/`. Both source generation and production builds use this domain by default, independently of Netlify preview URLs. Only set `SITE_URL` if the official domain changes (HTTPS origin with no path, query or fragment). The build generates a consistent canonical link, social metadata, organization URL, `robots.txt` and `sitemap.xml`. For other hosts, run the same build and upload `dist/`.

The confirmed service area is Celbridge and nearby homes within approximately a 10-minute drive, subject to address and availability confirmation. This is represented in visible content and Organization/Service structured data. Travel time is not converted to a fixed kilometre radius or an unconfirmed list of towns.

## Follow-up required from the business owner

- Verify the production domain in Google Search Console, submit `/sitemap.xml`, and inspect the homepage URL to request indexing. Verification needs the owner's Google/DNS access.
- Create or complete the Google Business Profile with accurate service areas, phone, hours and website. Request honest reviews from real customers.
- Review Search Console impressions, clicks and search terms over time. Indexing, ranking and traffic gains are not guaranteed by these code changes.

Organization markup currently uses only known business information. LocalBusiness rich-result markup is deferred until the required real business details are available. There are no fabricated reviews or ratings. Deep Cleaning remains unavailable.

## Validation

Run `powershell -ExecutionPolicy Bypass -File tests/site-content.tests.ps1` and `node tests/seo.tests.cjs`. The SEO test checks the official domain, service area and a temporary domain override, then restores `dist/` to the official domain. After deployment, check the live homepage canonical, `/robots.txt`, `/sitemap.xml`, and the Search Console URL Inspection result.

References: [Google canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [business details](https://developers.google.com/search/docs/appearance/establish-business-details).
