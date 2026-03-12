'use strict';

const { createElement: h, useState, useEffect, useRef } = React;

// ── Icon helpers ────────────────────────────────────────────────────────────
const Icon = ({ d, viewBox = '0 0 24 24' }) =>
  h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox,
    className: 'w-5 h-5 text-violet-400',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }, h('path', { d }));

const icons = {
  globe: (props) => Icon({ ...props, d: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10A15 15 0 0 1 12 2z' }),
  mapPin: (props) => Icon({ ...props, d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' }),
  monitor: (props) => Icon({ ...props, d: 'M2 3h20v14H2zM8 21h8M12 17v4' }),
  terminal: (props) => Icon({ ...props, d: 'M4 17l6-6-6-6M12 19h8' }),
  refresh: (props) => Icon({ ...props, d: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15' }),
  download: (props) => Icon({ ...props, d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3' }),
  copy: (props) => Icon({ ...props, d: 'M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' }),
  check: (props) => Icon({ ...props, d: 'M20 6L9 17l-5-5' }),
  screen: (props) => Icon({ ...props, d: 'M2 3h20v14H2zM8 21h8M12 17v4' }),
  layers: (props) => Icon({ ...props, d: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' }),
};

// ── Data collection ─────────────────────────────────────────────────────────

function detectBrowser(ua) {
  if (ua.includes('Edg/')) {
    const v = ua.match(/Edg\/([0-9.]+)/);
    return { name: 'Edge', version: v ? v[1] : '' };
  }
  if (ua.includes('OPR/') || ua.includes('Opera')) {
    const v = ua.match(/OPR\/([0-9.]+)/) || ua.match(/Opera\/([0-9.]+)/);
    return { name: 'Opera', version: v ? v[1] : '' };
  }
  if (ua.includes('Brave')) {
    const v = ua.match(/Chrome\/([0-9.]+)/);
    return { name: 'Brave', version: v ? v[1] : '' };
  }
  if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) {
    const v = ua.match(/Chrome\/([0-9.]+)/);
    return { name: 'Chrome', version: v ? v[1] : '' };
  }
  if (ua.includes('Firefox')) {
    const v = ua.match(/Firefox\/([0-9.]+)/);
    return { name: 'Firefox', version: v ? v[1] : '' };
  }
  if (ua.includes('Safari') && !ua.includes('Chrome')) {
    const v = ua.match(/Version\/([0-9.]+)/);
    return { name: 'Safari', version: v ? v[1] : '' };
  }
  return { name: 'Unknown', version: '' };
}

function detectEngine(ua) {
  if (ua.includes('Gecko/') && ua.includes('Firefox')) {
    const v = ua.match(/rv:([0-9.]+)/);
    return { name: 'Gecko', version: v ? v[1] : '' };
  }
  if (ua.includes('AppleWebKit/')) {
    const v = ua.match(/AppleWebKit\/([0-9.]+)/);
    if (ua.includes('Chrome')) {
      return { name: 'Blink', version: v ? v[1] : '' };
    }
    return { name: 'WebKit', version: v ? v[1] : '' };
  }
  return { name: 'Unknown', version: '' };
}

function detectOS(ua) {
  const macOSNames = {
    '10.13': 'High Sierra', '10.14': 'Mojave', '10.15': 'Catalina',
    '11': 'Big Sur', '12': 'Monterey', '13': 'Ventura',
    '14': 'Sonoma', '15': 'Sequoia',
  };

  if (ua.includes('Mac OS X')) {
    const m = ua.match(/Mac OS X ([0-9._]+)/);
    if (m) {
      const ver = m[1].replace(/_/g, '.');
      const major = ver.split('.').slice(0, 2).join('.');
      const majorOnly = ver.split('.')[0];
      const name = macOSNames[major] || macOSNames[majorOnly];
      // Always include version number; append friendly name if known
      return { os: 'macOS', osVersion: name ? `${name} (${ver})` : ver };
    }
    return { os: 'macOS', osVersion: '' };
  }
  if (ua.includes('Windows')) {
    const ntMatch = ua.match(/Windows NT ([0-9.]+)/);
    const ntVer = ntMatch ? ntMatch[1] : '';
    const winNames = { '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7' };
    const name = winNames[ntVer];
    return { os: 'Windows', osVersion: name ? `${name} (NT ${ntVer})` : ntVer };
  }
  if (ua.includes('Android')) {
    const m = ua.match(/Android ([0-9.]+)/);
    return { os: 'Android', osVersion: m ? m[1] : '' };
  }
  if (/iPhone|iPad|iPod/.test(ua)) {
    const m = ua.match(/OS ([0-9_]+)/);
    return { os: 'iOS', osVersion: m ? m[1].replace(/_/g, '.') : '' };
  }
  if (ua.includes('Linux')) {
    if (ua.includes('Ubuntu')) return { os: 'Linux', osVersion: 'Ubuntu' };
    if (ua.includes('Fedora')) return { os: 'Linux', osVersion: 'Fedora' };
    if (ua.includes('Debian')) return { os: 'Linux', osVersion: 'Debian' };
    return { os: 'Linux', osVersion: '' };
  }
  return { os: 'Unknown', osVersion: '' };
}

function detectDeviceType(ua) {
  if (/iPad|tablet/i.test(ua)) return 'Tablet';
  if (/Mobile|Android|iPhone|iPod/.test(ua)) return 'Mobile';
  return 'Desktop';
}

function collectClientData() {
  const ua = navigator.userAgent;
  const browser = detectBrowser(ua);
  const engine = detectEngine(ua);
  const { os, osVersion } = detectOS(ua);
  const deviceType = detectDeviceType(ua);

  return {
    browser: { name: browser.name, version: browser.version },
    engine: { name: engine.name, version: engine.version },
    device: { os, osVersion, type: deviceType },
    connection: {
      protocol: location.protocol === 'https:' ? 'HTTPS' : 'HTTP',
      host: location.host || 'localhost',
      method: 'GET',
      path: location.pathname || '/',
    },
    screen: { width: window.screen.width, height: window.screen.height },
    viewport: { width: window.innerWidth, height: window.innerHeight },
    javascript: true,
    cookies: navigator.cookieEnabled,
    userAgent: ua,
  };
}

async function fetchIPData() {
  try {
    const res = await fetch('https://ipinfo.io/json');
    if (!res.ok) throw new Error('IP API error');
    const data = await res.json();
    const [lat, lng] = (data.loc || '').split(',');
    const orgParts = (data.org || '').match(/^(AS\d+)\s+(.+)$/);
    const isp = orgParts ? orgParts[2] : (data.org || '');
    return {
      address: data.ip || '',
      isp,
      city: data.city || '',
      region: data.region || '',
      country: data.country || '',
      countryCode: data.country || '',
      timezone: data.timezone || '',
      lat: lat || '',
      lng: lng || '',
    };
  } catch {
    return null;
  }
}

async function fetchHeaders() {
  try {
    const res = await fetch('https://httpbin.org/headers');
    if (!res.ok) throw new Error('Headers API error');
    const data = await res.json();
    return data.headers || {};
  } catch {
    return null;
  }
}

// ── UI Components ───────────────────────────────────────────────────────────

const DataRow = ({ label, value }) =>
  h('div', { className: 'mb-2 last:mb-0' },
    h('div', { className: 'text-xs uppercase tracking-wider text-slate-400/70 mb-0.5' }, label),
    h('div', { className: 'text-sm font-mono text-slate-300 break-all' }, value || '\u2014'),
  );

const Card = ({ icon, title, children }) =>
  h('div', {
    className: 'bg-slate-800/50 rounded-xl p-5 border border-slate-700/50',
  },
    h('div', { className: 'flex items-center gap-2 mb-4' },
      h(icon, null),
      h('h2', { className: 'text-xs font-semibold uppercase tracking-wider text-slate-400' }, title),
    ),
    children,
  );

// ── Main App ────────────────────────────────────────────────────────────────

const BrowserInfo = () => {
  const [clientData, setClientData] = useState(collectClientData);
  const [ipData, setIpData] = useState(null);
  const [headers, setHeaders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const loadExternalData = async () => {
    setLoading(true);
    const [ip, hdrs] = await Promise.all([fetchIPData(), fetchHeaders()]);
    setIpData(ip);
    setHeaders(hdrs);
    setLoading(false);
  };

  const refresh = () => {
    setClientData(collectClientData());
    loadExternalData();
  };

  useEffect(() => { loadExternalData(); }, []);

  // ── Build JSON report ───────────────────────────────────────────────────

  const buildReport = () => ({
    generatedAt: new Date().toISOString(),
    ip: ipData || { address: 'Unavailable' },
    browser: clientData.browser,
    engine: clientData.engine,
    device: clientData.device,
    connection: clientData.connection,
    display: {
      screen: clientData.screen,
      viewport: clientData.viewport,
    },
    features: {
      javascript: clientData.javascript,
      cookies: clientData.cookies,
    },
    userAgent: clientData.userAgent,
    headers: headers || {},
  });

  // ── Export functions ────────────────────────────────────────────────────

  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(buildReport(), null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = JSON.stringify(buildReport(), null, 2);
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadAsJSON = () => {
    const blob = new Blob([JSON.stringify(buildReport(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `browser-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Render ──────────────────────────────────────────────────────────────

  const ip = ipData || {};

  return h('div', { className: 'min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 p-4 md:p-8' },
    h('div', { className: 'max-w-3xl mx-auto' },

      // ── Main card ────────────────────────────────────────────────────
      h('div', { className: 'bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden' },

        // Header bar
        h('div', { className: 'flex items-center justify-between px-5 md:px-8 pt-6 pb-2' },
          h('div', { className: 'flex items-center gap-2' },
            h('div', { className: 'w-2 h-2 rounded-full bg-violet-400' }),
            h('span', { className: 'text-sm font-mono font-semibold text-slate-400 tracking-wide' }, 'browser.fyi'),
          ),
          h('button', {
            onClick: refresh,
            className: 'text-slate-500 hover:text-violet-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800',
            title: 'Refresh',
          }, h(icons.refresh)),
        ),

        // Content
        h('div', { className: 'px-5 md:px-8 py-6 space-y-5' },

          // ── Row 1: Browser & Device + Display (2 cols) ──────────────
          h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },

            h(Card, { icon: icons.monitor, title: 'Browser & Device' },
              h(DataRow, { label: 'Browser', value: `${clientData.browser.name} ${clientData.browser.version}` }),
              h(DataRow, { label: 'Operating System', value: `${clientData.device.os} ${clientData.device.osVersion}`.trim() }),
              h(DataRow, { label: 'Device Type', value: clientData.device.type }),
              h(DataRow, { label: 'Engine', value: `${clientData.engine.name} ${clientData.engine.version}`.trim() }),
            ),

            h(Card, { icon: icons.screen, title: 'Display' },
              h(DataRow, { label: 'Screen', value: `${clientData.screen.width} x ${clientData.screen.height}` }),
              h(DataRow, { label: 'Viewport', value: `${clientData.viewport.width} x ${clientData.viewport.height}` }),
              h(DataRow, { label: 'JavaScript', value: clientData.javascript ? 'Enabled' : 'Disabled' }),
              h(DataRow, { label: 'Cookies', value: clientData.cookies ? 'Enabled' : 'Disabled' }),
            ),
          ),

          // ── Row 2: Network & Location (full width) ──────────────────
          h(Card, { icon: icons.mapPin, title: 'Network & Location' },
            h('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2' },
              h(DataRow, { label: 'IP Address', value: loading && !ip.address ? 'Loading...' : (ip.address || 'Unavailable') }),
              h(DataRow, { label: 'ISP', value: ip.isp }),
              h(DataRow, { label: 'City', value: ip.city }),
              h(DataRow, { label: 'Region', value: ip.region }),
              h(DataRow, { label: 'Country', value: ip.country }),
              h(DataRow, { label: 'Timezone', value: ip.timezone }),
              h(DataRow, { label: 'Coordinates', value: ip.lat && ip.lng ? `${ip.lat}, ${ip.lng}` : '' }),
            ),
          ),

          // ── Raw User Agent ──────────────────────────────────────────
          h('div', { className: 'bg-slate-800/30 rounded-xl p-5 border border-slate-700/50' },
            h('div', { className: 'flex items-center gap-2 mb-3' },
              h(icons.terminal),
              h('h2', { className: 'text-xs font-semibold uppercase tracking-wider text-slate-400' }, 'Raw User Agent'),
            ),
            h('p', { className: 'text-sm font-mono text-slate-400 break-all leading-relaxed' }, clientData.userAgent),
          ),

          // Generated date
          h('p', { className: 'text-xs text-slate-500 font-mono text-right' },
            'Generated ', new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          ),
        ),

        // ── Export section ─────────────────────────────────────────────
        h('div', { className: 'px-5 md:px-8 py-6 border-t border-slate-700/50' },
          h('div', { className: 'flex flex-col sm:flex-row gap-3' },
            h('button', {
              onClick: copyJSON,
              className: `flex-1 flex items-center justify-center gap-2 ${copied ? 'bg-emerald-600' : 'bg-violet-600 hover:bg-violet-500'} text-white font-mono text-sm py-3 px-5 rounded-xl transition-colors`,
            },
              copied ? h(icons.check) : h(icons.copy),
              copied ? 'Copied!' : 'Copy JSON',
            ),
            h('button', {
              onClick: downloadAsJSON,
              className: 'flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-mono text-sm py-3 px-5 rounded-xl transition-colors',
            },
              h(icons.download),
              'Download JSON',
            ),
          ),
          h('p', { className: 'text-xs text-slate-500 font-mono mt-4 text-center' },
            'All information is collected locally in your browser. Nothing is stored or sent to any server.',
          ),
        ),
      ), // end main card

      // Credit
      h('div', { className: 'text-slate-500 text-center text-xs font-mono mt-4' },
        'made with ',
        h('span', null, '\u26A1\uFE0F'),
        ' by ',
        h('a', {
          href: 'https://linkedin.com/in/wrightclick',
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'text-slate-500 hover:text-violet-400 transition-colors underline underline-offset-2',
        }, 'thomas'),
      ),
    ),
  );
};

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(BrowserInfo));
