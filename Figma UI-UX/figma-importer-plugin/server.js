const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3840;
const DOCS_DIR = path.resolve(__dirname, '..');

// Load screen titles from sources
function loadMetadata() {
  const meta = {
    'UF-07': { title: 'UF-07 · Identity Unmatched Queue', screens: {} },
    'UF-08': { title: 'UF-08 · Provisioning Execution Queue', screens: {} },
    'UF-09': { title: 'UF-09 · Employee Offboarding Workflow', screens: {} },
    'UF-10': { title: 'UF-10 · License Cost Optimization Dashboard', screens: {} },
  };

  try {
    const uf07 = require(path.join(DOCS_DIR, 'UF-07-Sources', 'uf07-data.js'));
    if (uf07 && uf07.screens) {
      uf07.screens.forEach(s => {
        meta['UF-07'].screens[s.id] = { title: s.title, subtitle: s.subtitle || '' };
      });
    }
  } catch (e) {
    console.warn('Cannot load UF-07 metadata:', e.message);
  }

  try {
    const uf08 = require(path.join(DOCS_DIR, 'UF-08-Sources', 'uf08-data.js'));
    if (uf08 && uf08.screens) {
      uf08.screens.forEach(s => {
        meta['UF-08'].screens[s.id] = { title: s.title, subtitle: s.subtitle || '' };
      });
    }
  } catch (e) {
    console.warn('Cannot load UF-08 metadata:', e.message);
  }

  try {
    const uf09Module = require(path.join(DOCS_DIR, 'UF-09-Sources', 'uf09-data.js'));
    const uf09 = uf09Module.createUF09Data ? uf09Module.createUF09Data() : null;
    if (uf09 && uf09.screens) {
      uf09.screens.forEach(s => {
        meta['UF-09'].screens[s.id] = { title: s.title, subtitle: s.subtitle || '' };
      });
    }
  } catch (e) {
    console.warn('Cannot load UF-09 metadata:', e.message);
  }

  try {
    const uf10Module = require(path.join(DOCS_DIR, 'UF-10-Sources', 'uf10-data.js'));
    const uf10 = uf10Module.createUF10Data ? uf10Module.createUF10Data() : null;
    if (uf10 && uf10.screens) {
      uf10.screens.forEach(s => {
        meta['UF-10'].screens[s.id] = { title: s.title, subtitle: s.subtitle || '' };
      });
    }
  } catch (e) {
    console.warn('Cannot load UF-10 metadata:', e.message);
  }

  return meta;
}

// Build manifest of all 122 image frames
function buildFrameManifest() {
  const metadata = loadMetadata();
  const flows = ['UF-07', 'UF-08', 'UF-09', 'UF-10'];
  const themes = ['Light', 'Dark'];
  const frames = [];

  for (const flow of flows) {
    for (const theme of themes) {
      const folderPath = path.join(DOCS_DIR, `${flow}-FullFrames`, theme);
      if (!fs.existsSync(folderPath)) continue;

      const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.png'));
      files.sort();

      for (const file of files) {
        // e.g. UF-08-Light-01.png
        const match = file.match(new RegExp(`^${flow}-${theme}-(\\d+)\\.png$`, 'i'));
        const screenId = match ? match[1] : '';
        const screenMeta = (metadata[flow] && metadata[flow].screens[screenId]) || { title: `Screen ${screenId}`, subtitle: '' };

        frames.push({
          flow,
          flowTitle: metadata[flow].title,
          theme,
          screenId,
          title: screenMeta.title,
          subtitle: screenMeta.subtitle,
          fileName: file,
          url: `/image/${flow}/${theme}/${file}`,
        });
      }
    }
  }

  return { flows, metadata, totalFrames: frames.length, frames };
}

const server = http.createServer((req, res) => {
  // Add CORS headers for Figma plugin fetch
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  if (pathname === '/status' || pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'ok', message: 'SaaS-Sentry Figma Importer Server is running', port: PORT }));
    return;
  }

  if (pathname === '/manifest') {
    const manifest = buildFrameManifest();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(manifest));
    return;
  }

  // Route /image/:flow/:theme/:fileName
  const imageMatch = pathname.match(/^\/image\/(UF-\d+)\/(Light|Dark)\/([^/]+)$/i);
  if (imageMatch) {
    const [, flow, theme, fileName] = imageMatch;
    const safeFileName = path.basename(fileName);
    const filePath = path.join(DOCS_DIR, `${flow}-FullFrames`, theme, safeFileName);

    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': stat.size,
        'Cache-Control': 'no-cache',
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'File not found', path: filePath }));
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  SaaS-Sentry Figma Importer Server đang chạy tại:`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`  Manifest: http://localhost:${PORT}/manifest`);
  console.log(`=======================================================`);
  console.log(`  Server đang sẵn sàng kết nối với Figma Plugin.`);
  console.log(`  Nhấn Ctrl + C để dừng server.`);
});
