// Run after changing script.js so initial HTML and interactive prices stay aligned.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const publish = process.argv.includes('--publish');
const configuredUrl = process.env.SITE_URL || 'https://triplecleaning.ie';
let origin;
if (configuredUrl) {
  const url = new URL(configuredUrl);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error('SITE_URL must be an HTTPS origin, for example https://your-domain.ie');
  }
  origin = url.origin;
}
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const catalog = vm.runInNewContext(script.split('const contactEmail')[0] + '\nserviceCatalog', {}, { timeout: 1000 });
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const rows = Object.values(catalog).flatMap(service => service.options.map(option => `
              <tr${service.available === false ? ' class="pricing-row-unavailable"' : ''}>
                <td>${service.available === false ? `<span class="availability-label">${escape(service.availabilityMessage)}</span> ` : ''}${escape(service.label)}</td>
                <td>${escape(option.bedrooms)}</td><td>${escape(option.price)}</td><td>${escape(option.estimatedTime)}</td>
              </tr>`)).join('');
const organization = {
  '@context': 'https://schema.org', '@type': 'Organization',
  name: 'Triple Cleaning', email: 'triplecleaning.info@gmail.com', telephone: '+353892721358',
  description: 'Residential cleaning in Celbridge and nearby homes within approximately a 10-minute drive. Weekend appointment requests are subject to confirmation.',
  areaServed: { '@type': 'Place', name: 'Celbridge and nearby areas within approximately a 10-minute drive' },
  ...(origin ? { url: origin + '/', logo: origin + '/assets/logo-cropped.png' } : {}),
  hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Residential Cleaning Services',
    itemListElement: Object.values(catalog).filter(service => service.available !== false).map(service => ({
      '@type': 'OfferCatalog', name: service.label,
      itemListElement: [{ '@type': 'Service', name: service.label, description: service.description,
        areaServed: { '@type': 'Place', name: 'Celbridge and nearby areas within approximately a 10-minute drive' } }]
    })) }
};
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace(/<tbody id="pricingRows">[\s\S]*?<\/tbody>/, `<tbody id="pricingRows">${rows}\n            </tbody>`);
const metadata = `<script type="application/ld+json">\n${JSON.stringify(organization, null, 2)}\n    </script>`;
html = html.replace(/<!-- SEO:STRUCTURED_DATA -->|<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => metadata);
html = html.replace(/\s*<!-- SEO:URLS:START -->[\s\S]*?<!-- SEO:URLS:END -->\s*/, '\n  ');
if (origin) {
  html = html.replace('</head>', `<!-- SEO:URLS:START -->
    <link rel="canonical" href="${escape(origin)}/">
    <meta property="og:url" content="${escape(origin)}/">
    <meta property="og:image" content="${escape(origin)}/assets/hero-clean-home.png">
    <meta property="og:image:alt" content="Freshly cleaned bright residential living room">
    <meta name="twitter:card" content="summary_large_image">
    <!-- SEO:URLS:END -->\n  </head>`);
}
// Reserve intrinsic image space to prevent layout shifts while images load.
html = html.replace(/<img\b[^>]*>/g, tag => {
  const src = tag.match(/src="([^"]+\.png)"/);
  if (!src) return tag;
  const png = fs.readFileSync(path.join(root, src[1]));
  return tag.replace(/\s(?:width|height)="\d+"/g, '').replace('>', ` width="${png.readUInt32BE(16)}" height="${png.readUInt32BE(20)}">`);
});
const output = publish ? path.join(root, 'dist') : root;
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'index.html'), html);
if (publish) {
  for (const file of ['styles.css', 'script.js']) fs.copyFileSync(path.join(root, file), path.join(output, file));
  fs.cpSync(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
  fs.writeFileSync(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(origin)}/</loc></url></urlset>\n`);
}
console.log(`SEO HTML generated for ${origin}; ${Object.values(catalog).reduce((n, s) => n + s.options.length, 0)} price rows. ${publish ? 'Production files: dist/' : 'Source HTML refreshed.'}`);
