/* Aquanaut — stránka "ve výstavbě".
   Servíruje index.html (CZ) a en.html (EN). Všechny ostatní adresy,
   hlavně stránky starého webu, které má Google v indexu, přesměruje
   na úvod, aby lidé nepadali na 404. */

const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;
const PUBLIC = path.join(__dirname, 'public');

app.disable('x-powered-by');
app.set('trust proxy', 1);

// www.aquanaut.cz -> aquanaut.cz, ať existuje jen jedna adresa
app.use((req, res, next) => {
  const host = req.headers.host || '';
  if (host.startsWith('www.')) {
    return res.redirect(301, `https://${host.slice(4)}${req.originalUrl}`);
  }
  next();
});

app.get(['/', '/index.html'], (req, res) => res.sendFile(path.join(PUBLIC, 'index.html')));
app.get(['/en', '/en.html'], (req, res) => res.sendFile(path.join(PUBLIC, 'en.html')));

// Cokoli jiného (staré stránky, překlepy) -> úvod.
// 302 a ne 301: až poběží nový web, budou mít tyhle adresy zase obsah
// a trvalé přesměrování by si prohlížeče zapamatovaly.
app.use((req, res) => res.redirect(302, '/'));

app.listen(PORT, '0.0.0.0', () => console.log(`Aquanaut výstavba běží na portu ${PORT}`));
