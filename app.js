'use strict';

const { createElement: h, useState, useEffect, useMemo } = React;

// ── SVG Icon factory ────────────────────────────────────────────────────────
const I = (d) => () =>
  h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    className: 'w-4 h-4 text-[#C879FF]',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }, h('path', { d }));

const icons = {
  monitor:  I('M2 3h20v14H2zM8 21h8M12 17v4'),
  globe:    I('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10A15 15 0 0 1 12 2z'),
  cpu:      I('M6 6h12v12H6zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3'),
  zap:      I('M13 2L3 14h9l-1 10 10-12h-9l1-10z'),
  server:   I('M2 2h20v8H2zM2 14h20v8H2z'),
  search:   I('M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5zM16 16l5 5'),
  mapPin:   I('M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'),
  terminal: I('M4 17l6-6-6-6M12 19h8'),
  refresh:  I('M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15'),
  download: I('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3'),
  copy:     I('M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'),
  check:    I('M20 6L9 17l-5-5'),
  layers:   I('M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'),
  shield:   I('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'),
  wifi:     I('M12 20h0M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 14 0M1.5 9.5a15 15 0 0 1 21 0'),
  eye:      I('M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'),
  menu:     I('M3 12h18M3 6h18M3 18h18'),
  close:    I('M18 6L6 18M6 6l12 12'),
};

// ── Detection Functions ─────────────────────────────────────────────────────

function detectBrowser(ua) {
  if (window.navigator.brave) {
    const v = ua.match(/Chrome\/([0-9.]+)/);
    return { name: 'Brave', version: v ? v[1] : '' };
  }
  if (ua.includes('Edg/')) {
    const v = ua.match(/Edg\/([0-9.]+)/);
    return { name: 'Edge', version: v ? v[1] : '' };
  }
  if (ua.includes('Vivaldi/')) {
    const v = ua.match(/Vivaldi\/([0-9.]+)/);
    return { name: 'Vivaldi', version: v ? v[1] : '' };
  }
  if (ua.includes('OPR/') || ua.includes('Opera')) {
    const v = ua.match(/OPR\/([0-9.]+)/) || ua.match(/Opera\/([0-9.]+)/);
    return { name: 'Opera', version: v ? v[1] : '' };
  }
  if (ua.includes('SamsungBrowser/')) {
    const v = ua.match(/SamsungBrowser\/([0-9.]+)/);
    return { name: 'Samsung Internet', version: v ? v[1] : '' };
  }
  if (ua.includes('UCBrowser/')) {
    const v = ua.match(/UCBrowser\/([0-9.]+)/);
    return { name: 'UC Browser', version: v ? v[1] : '' };
  }
  if (ua.includes('Electron/')) {
    const v = ua.match(/Electron\/([0-9.]+)/);
    return { name: 'Electron', version: v ? v[1] : '' };
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
    if (ua.includes('Chrome')) return { name: 'Blink', version: v ? v[1] : '' };
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

  if (ua.includes('CrOS')) {
    const m = ua.match(/CrOS\s+\S+\s+([0-9.]+)/);
    return { os: 'ChromeOS', osVersion: m ? m[1] : '' };
  }
  if (ua.includes('Mac OS X')) {
    const m = ua.match(/Mac OS X ([0-9._]+)/);
    if (m) {
      const ver = m[1].replace(/_/g, '.');
      const major = ver.split('.').slice(0, 2).join('.');
      const majorOnly = ver.split('.')[0];
      const name = macOSNames[major] || macOSNames[majorOnly];
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
  if (ua.includes('FreeBSD')) return { os: 'FreeBSD', osVersion: '' };
  return { os: 'Unknown', osVersion: '' };
}

function detectDeviceType(ua) {
  if (/iPad|tablet/i.test(ua)) return 'Tablet';
  if (/Mobile|Android|iPhone|iPod/.test(ua)) return 'Mobile';
  return 'Desktop';
}

function detectWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    const gl = gl2 || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return null;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      version: gl2 ? 'WebGL 2' : 'WebGL 1',
      vendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
      renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    };
  } catch { return null; }
}

function getConnectionInfo() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) return null;
  return {
    effectiveType: conn.effectiveType || null,
    downlink: conn.downlink !== undefined ? conn.downlink : null,
    rtt: conn.rtt !== undefined ? conn.rtt : null,
    saveData: conn.saveData || false,
    type: conn.type || null,
  };
}

function getHTTPVersion() {
  try {
    const entries = performance.getEntriesByType('navigation');
    if (entries.length > 0 && entries[0].nextHopProtocol) {
      const proto = entries[0].nextHopProtocol;
      const map = { 'h2': 'HTTP/2', 'h3': 'HTTP/3', 'http/1.1': 'HTTP/1.1', 'http/1.0': 'HTTP/1.0' };
      return map[proto] || proto;
    }
  } catch {}
  return null;
}

function inferTLS(httpVer) {
  if (!httpVer) return null;
  if (httpVer === 'HTTP/3') return 'TLS 1.3';
  if (httpVer === 'HTTP/2') return 'TLS 1.2+';
  if (location.protocol === 'https:') return 'TLS 1.2+';
  return null;
}

function getOrientation() {
  if (screen.orientation && screen.orientation.type) {
    return screen.orientation.type.includes('landscape') ? 'Landscape' : 'Portrait';
  }
  return window.innerWidth > window.innerHeight ? 'Landscape' : 'Portrait';
}

function getPointerType() {
  if (window.matchMedia('(pointer: fine)').matches) return 'Fine (mouse/trackpad)';
  if (window.matchMedia('(pointer: coarse)').matches) return 'Coarse (touch)';
  return 'None';
}

function storageAvailable(type) {
  try {
    const s = window[type];
    s.setItem('_bfyi', '1');
    s.removeItem('_bfyi');
    return true;
  } catch { return false; }
}

// ── Collect all client data ─────────────────────────────────────────────────

function collectAllClientData() {
  const ua = navigator.userAgent;
  const browser = detectBrowser(ua);
  const engine = detectEngine(ua);
  const { os, osVersion } = detectOS(ua);
  const deviceType = detectDeviceType(ua);
  const gpu = detectWebGL();
  const networkInfo = getConnectionInfo();
  const httpVersion = getHTTPVersion();
  const tlsVersion = inferTLS(httpVersion);
  const orientation = getOrientation();

  return {
    browser: { name: browser.name, version: browser.version },
    engine: { name: engine.name, version: engine.version },
    device: { os, osVersion, type: deviceType, platform: navigator.platform || '' },
    connection: {
      protocol: location.protocol === 'https:' ? 'HTTPS' : 'HTTP',
      host: location.host || 'localhost',
      method: 'GET',
      path: location.pathname || '/',
      httpVersion,
      tlsVersion,
    },
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio || 1,
      orientation,
    },
    viewport: { width: window.innerWidth, height: window.innerHeight },
    language: {
      primary: navigator.language || '',
      all: navigator.languages ? [...navigator.languages] : [navigator.language || ''],
    },
    hardware: {
      cpuCores: navigator.hardwareConcurrency || null,
      deviceMemory: navigator.deviceMemory || null,
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      pointer: getPointerType(),
      hover: window.matchMedia('(hover: hover)').matches,
      gpu,
    },
    features: {
      javascript: true,
      cookies: navigator.cookieEnabled,
      online: navigator.onLine,
      doNotTrack: navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes',
      localStorage: storageAvailable('localStorage'),
      sessionStorage: storageAvailable('sessionStorage'),
      indexedDB: 'indexedDB' in window,
      serviceWorker: 'serviceWorker' in navigator,
      webSocket: 'WebSocket' in window,
      webWorkers: 'Worker' in window,
      sharedWorkers: 'SharedWorker' in window,
      geolocation: 'geolocation' in navigator,
      notifications: 'Notification' in window,
      clipboardAPI: navigator.clipboard !== undefined,
      webRTC: !!(window.RTCPeerConnection || window.webkitRTCPeerConnection),
      webAudio: !!(window.AudioContext || window.webkitAudioContext),
      webGL: !!gpu,
      pdfViewer: navigator.pdfViewerEnabled !== undefined ? navigator.pdfViewerEnabled : null,
      mediaDevices: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      bluetooth: 'bluetooth' in navigator,
      usb: 'usb' in navigator,
      gamepads: 'getGamepads' in navigator,
      vibration: 'vibrate' in navigator,
    },
    networkInfo,
    timezone: {
      name: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      offset: new Date().getTimezoneOffset(),
    },
    userAgent: ua,
  };
}

// ── API Fetchers ────────────────────────────────────────────────────────────

async function fetchIPData() {
  try {
    const res = await fetch('https://ipinfo.io/json');
    if (!res.ok) throw new Error('IP API error');
    const data = await res.json();
    const [lat, lng] = (data.loc || '').split(',');
    const orgParts = (data.org || '').match(/^(AS\d+)\s+(.+)$/);
    const asn = orgParts ? orgParts[1] : '';
    const isp = orgParts ? orgParts[2] : (data.org || '');
    let countryName = data.country || '';
    try { countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(data.country) || data.country; } catch {}
    return {
      address: data.ip || '',
      asn,
      isp,
      city: data.city || '',
      region: data.region || '',
      country: countryName,
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

// ── UI Primitives ───────────────────────────────────────────────────────────

const DataRow = ({ label, value }) =>
  h('div', { className: 'mb-2.5 last:mb-0' },
    h('div', { className: 'text-[10px] uppercase tracking-widest text-[#C1BDB3] mb-0.5' }, label),
    h('div', { className: 'text-sm font-mono text-white/90 break-words' }, value || '\u2014'),
  );

const StatusIcon = ({ ok }) =>
  h('span', {
    className: `inline-flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 ${ok ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-[#C1BDB3]/50'}`,
  },
    h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      className: 'w-3 h-3',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 3,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }, h('path', { d: ok ? 'M20 6L9 17l-5-5' : 'M18 6L6 18M6 6l12 12' })),
  );

const FeatureRow = ({ label, supported }) =>
  h('div', { className: 'flex items-center justify-between py-2 border-b border-white/5 last:border-0' },
    h('span', { className: `text-sm ${supported ? 'text-white/80' : 'text-[#C1BDB3]/50'}` }, label),
    h('div', { className: 'flex items-center gap-1.5' },
      h(StatusIcon, { ok: supported }),
      h('span', { className: `text-xs font-mono ${supported ? 'text-emerald-400' : 'text-[#C1BDB3]/50'}` }, supported ? 'Enabled' : 'Off'),
    ),
  );

const Card = ({ icon, title, children, className: cn }) =>
  h('div', { className: `bg-white/[0.04] rounded-xl p-5 border border-white/[0.06] ${cn || ''}` },
    h('div', { className: 'flex items-center gap-2 mb-4' },
      icon && h(icon),
      h('h2', { className: 'text-[10px] font-semibold uppercase tracking-widest text-[#C1BDB3]' }, title),
    ),
    children,
  );

// ── Tab Bar ─────────────────────────────────────────────────────────────────

const TAB_DEFS = [
  { id: 'overview', label: 'Overview',  icon: icons.monitor },
  { id: 'network',  label: 'Network',   icon: icons.globe },
  { id: 'hardware', label: 'Hardware',  icon: icons.cpu },
  { id: 'features', label: 'Features',  icon: icons.zap },
  { id: 'headers',  label: 'Headers',   icon: icons.server },
];

const TabBar = ({ activeTab, onTabChange, headerCount }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeDef = TAB_DEFS.find(t => t.id === activeTab);

  const handleTabChange = (id) => {
    onTabChange(id);
    setMenuOpen(false);
  };

  return h('div', { className: 'border-b border-white/10 -mx-5 md:-mx-8 px-5 md:px-8' },

    // Desktop tabs
    h('div', { className: 'hidden sm:flex gap-1' },
      TAB_DEFS.map(tab =>
        h('button', {
          key: tab.id,
          onClick: () => onTabChange(tab.id),
          className: [
            'flex items-center gap-1.5 px-3 py-3 text-[11px] font-mono font-semibold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2',
            activeTab === tab.id
              ? 'text-[#C879FF] border-[#C879FF]'
              : 'text-[#C1BDB3]/60 border-transparent hover:text-white/80 hover:bg-white/5',
          ].join(' '),
        },
          h(tab.icon),
          tab.label,
          tab.id === 'headers' && headerCount > 0
            ? h('span', { className: 'ml-1 text-[9px] bg-white/10 text-[#C1BDB3] px-1.5 py-0.5 rounded-full' }, headerCount)
            : null,
        ),
      ),
    ),

    // Mobile: hamburger button showing current tab
    h('div', { className: 'flex sm:hidden items-center justify-between py-2.5' },
      h('div', { className: 'flex items-center gap-2' },
        activeDef && h(activeDef.icon),
        h('span', { className: 'text-[11px] font-mono font-semibold uppercase tracking-wider text-[#C879FF]' }, activeDef ? activeDef.label : ''),
      ),
      h('button', {
        onClick: () => setMenuOpen(!menuOpen),
        className: 'text-[#C1BDB3]/60 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors',
      }, menuOpen ? h(icons.close) : h(icons.menu)),
    ),

    // Mobile dropdown
    menuOpen && h('div', { className: 'sm:hidden pb-2 space-y-0.5' },
      TAB_DEFS.map(tab =>
        h('button', {
          key: tab.id,
          onClick: () => handleTabChange(tab.id),
          className: [
            'flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[11px] font-mono font-semibold uppercase tracking-wider transition-colors',
            activeTab === tab.id
              ? 'text-[#C879FF] bg-[#C879FF]/10'
              : 'text-[#C1BDB3]/60 hover:text-white/80 hover:bg-white/5',
          ].join(' '),
        },
          h(tab.icon),
          tab.label,
          tab.id === 'headers' && headerCount > 0
            ? h('span', { className: 'ml-auto text-[9px] bg-white/10 text-[#C1BDB3] px-1.5 py-0.5 rounded-full' }, headerCount)
            : null,
        ),
      ),
    ),
  );
};

// ── Tab: Overview ───────────────────────────────────────────────────────────

const OverviewTab = ({ data, ipData, loading }) => {
  const ip = ipData || {};
  return h('div', { className: 'space-y-4' },

    h(Card, { icon: icons.mapPin, title: 'Network & Location' },
      h('div', { className: 'mb-4' },
        h('div', { className: 'text-[10px] uppercase tracking-widest text-[#C1BDB3] mb-1' }, 'IP Address'),
        h('div', { className: 'text-xl font-mono font-bold text-white' },
          loading && !ip.address ? 'Loading\u2026' : (ip.address || 'Unavailable'),
        ),
      ),
      h('div', { className: 'grid grid-cols-2 sm:grid-cols-4 gap-x-6' },
        h(DataRow, { label: 'ISP', value: ip.isp }),
        h(DataRow, { label: 'City', value: ip.city }),
        h(DataRow, { label: 'Region', value: ip.region }),
        h(DataRow, { label: 'Country', value: ip.country ? `${ip.country} (${ip.countryCode})` : '' }),
        h(DataRow, { label: 'Timezone', value: ip.timezone }),
        h(DataRow, { label: 'Coordinates', value: ip.lat && ip.lng ? `${ip.lat}, ${ip.lng}` : '' }),
      ),
    ),

    h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },

      h(Card, { icon: icons.monitor, title: 'Browser & Device' },
        h(DataRow, { label: 'Browser', value: `${data.browser.name} ${data.browser.version}` }),
        h(DataRow, { label: 'Operating System', value: `${data.device.os} ${data.device.osVersion}`.trim() }),
        h(DataRow, { label: 'Device Type', value: data.device.type }),
        h(DataRow, { label: 'Platform', value: data.device.platform }),
        h(DataRow, { label: 'Language', value: data.language.primary }),
      ),

      h(Card, { icon: icons.eye, title: 'Display' },
        h(DataRow, { label: 'Screen', value: `${data.screen.width} \u00d7 ${data.screen.height}` }),
        h(DataRow, { label: 'Viewport', value: `${data.viewport.width} \u00d7 ${data.viewport.height}` }),
        h(DataRow, { label: 'JavaScript', value: 'Enabled' }),
        h(DataRow, { label: 'Cookies', value: data.features.cookies ? 'Enabled' : 'Disabled' }),
      ),
    ),
  );
};

// ── Tab: Network ────────────────────────────────────────────────────────────

const NetworkTab = ({ data, ipData, loading }) => {
  const ip = ipData || {};
  const ni = data.networkInfo;

  return h('div', { className: 'space-y-4' },

    h('div', { className: 'bg-white/[0.04] rounded-xl p-5 border border-white/[0.06]' },
      h('div', { className: 'text-[10px] uppercase tracking-widest text-[#C1BDB3] mb-1' }, 'IP Address'),
      h('div', { className: 'text-2xl font-mono font-bold text-white mb-1' },
        loading && !ip.address ? 'Loading\u2026' : (ip.address || 'Unavailable'),
      ),
      (ip.asn || ip.isp)
        ? h('div', { className: 'text-sm font-mono text-[#C1BDB3]/70' }, [ip.asn, ip.isp].filter(Boolean).join(' \u00b7 '))
        : null,
    ),

    h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },

      h(Card, { icon: icons.mapPin, title: 'Location' },
        h(DataRow, { label: 'City', value: ip.city }),
        h(DataRow, { label: 'Region', value: ip.region }),
        h(DataRow, { label: 'Country', value: ip.country ? `${ip.country} (${ip.countryCode})` : '' }),
        h(DataRow, { label: 'Timezone', value: ip.timezone }),
        h(DataRow, { label: 'Coordinates', value: ip.lat && ip.lng ? `${ip.lat}, ${ip.lng}` : '' }),
      ),

      h(Card, { icon: icons.wifi, title: 'Connection' },
        h(DataRow, { label: 'Protocol', value: data.connection.protocol }),
        h(DataRow, { label: 'HTTP Version', value: data.connection.httpVersion }),
        h(DataRow, { label: 'TLS', value: data.connection.tlsVersion }),
        h(DataRow, { label: 'Host', value: data.connection.host }),
        h(DataRow, { label: 'Method', value: data.connection.method }),
        h(DataRow, { label: 'Path', value: data.connection.path }),
      ),
    ),

    ni ? h(Card, { icon: icons.layers, title: 'Network Quality' },
      h('div', { className: 'grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2' },
        h(DataRow, { label: 'Effective Type', value: ni.effectiveType ? ni.effectiveType.toUpperCase() : '' }),
        h(DataRow, { label: 'Downlink', value: ni.downlink !== null ? `${ni.downlink} Mbps` : '' }),
        h(DataRow, { label: 'RTT', value: ni.rtt !== null ? `${ni.rtt} ms` : '' }),
        h(DataRow, { label: 'Save Data', value: ni.saveData ? 'Yes' : 'No' }),
      ),
    ) : null,
  );
};

// ── Tab: Hardware ───────────────────────────────────────────────────────────

const HardwareTab = ({ data }) => {
  const gpu = data.hardware.gpu;
  const tz = data.timezone;
  const offH = Math.floor(Math.abs(tz.offset) / 60);
  const offM = Math.abs(tz.offset) % 60;
  const utcStr = `UTC${tz.offset <= 0 ? '+' : '-'}${String(offH).padStart(2, '0')}:${String(offM).padStart(2, '0')}`;

  return h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },

    h(Card, { icon: icons.eye, title: 'Display' },
      h(DataRow, { label: 'Screen', value: `${data.screen.width} \u00d7 ${data.screen.height}` }),
      h(DataRow, { label: 'Viewport', value: `${data.viewport.width} \u00d7 ${data.viewport.height}` }),
      h(DataRow, { label: 'Color Depth', value: `${data.screen.colorDepth}-bit` }),
      h(DataRow, { label: 'Pixel Ratio', value: `${data.screen.pixelRatio}x` }),
      h(DataRow, { label: 'Orientation', value: data.screen.orientation }),
    ),

    h(Card, { icon: icons.cpu, title: 'Processor & Memory' },
      h(DataRow, { label: 'CPU Cores', value: data.hardware.cpuCores ? `${data.hardware.cpuCores}` : 'Unavailable' }),
      h(DataRow, { label: 'Device Memory', value: data.hardware.deviceMemory ? `${data.hardware.deviceMemory} GB` : 'Unavailable' }),
      h(DataRow, { label: 'Platform', value: data.device.platform }),
    ),

    h(Card, { icon: icons.layers, title: 'GPU / WebGL' },
      gpu
        ? [
            h(DataRow, { key: 'v', label: 'WebGL Version', value: gpu.version }),
            h(DataRow, { key: 'ven', label: 'Vendor', value: gpu.vendor }),
            h(DataRow, { key: 'r', label: 'Renderer', value: gpu.renderer }),
            h(DataRow, { key: 't', label: 'Max Texture Size', value: `${gpu.maxTextureSize}px` }),
          ]
        : h('div', { className: 'text-sm text-[#C1BDB3]/50 italic' }, 'WebGL not available'),
    ),

    h(Card, { icon: icons.monitor, title: 'Input' },
      h(DataRow, { label: 'Touch Support', value: data.hardware.touchSupport ? 'Yes' : 'No' }),
      h(DataRow, { label: 'Max Touch Points', value: `${data.hardware.maxTouchPoints}` }),
      h(DataRow, { label: 'Pointer', value: data.hardware.pointer }),
      h(DataRow, { label: 'Hover', value: data.hardware.hover ? 'Supported' : 'Not supported' }),
    ),

    h(Card, { icon: icons.globe, title: 'Locale & Timezone' },
      h(DataRow, { label: 'Primary Language', value: data.language.primary }),
      h(DataRow, { label: 'All Languages', value: data.language.all.join(', ') }),
      h(DataRow, { label: 'Timezone', value: tz.name }),
      h(DataRow, { label: 'UTC Offset', value: utcStr }),
    ),
  );
};

// ── Tab: Features ───────────────────────────────────────────────────────────

const FeaturesTab = ({ data }) => {
  const f = data.features;
  return h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' },

    h(Card, { icon: icons.shield, title: 'Core' },
      h(FeatureRow, { label: 'JavaScript', supported: f.javascript }),
      h(FeatureRow, { label: 'Cookies', supported: f.cookies }),
      h(FeatureRow, { label: 'Online', supported: f.online }),
      h(FeatureRow, { label: 'Do Not Track', supported: f.doNotTrack }),
    ),

    h(Card, { icon: icons.server, title: 'Storage' },
      h(FeatureRow, { label: 'Local Storage', supported: f.localStorage }),
      h(FeatureRow, { label: 'Session Storage', supported: f.sessionStorage }),
      h(FeatureRow, { label: 'IndexedDB', supported: f.indexedDB }),
    ),

    h(Card, { icon: icons.zap, title: 'Workers & Realtime' },
      h(FeatureRow, { label: 'Service Workers', supported: f.serviceWorker }),
      h(FeatureRow, { label: 'Web Workers', supported: f.webWorkers }),
      h(FeatureRow, { label: 'Shared Workers', supported: f.sharedWorkers }),
      h(FeatureRow, { label: 'WebSocket', supported: f.webSocket }),
      h(FeatureRow, { label: 'WebRTC', supported: f.webRTC }),
    ),

    h(Card, { icon: icons.globe, title: 'Media & Graphics' },
      h(FeatureRow, { label: 'WebGL', supported: f.webGL }),
      h(FeatureRow, { label: 'Web Audio', supported: f.webAudio }),
      h(FeatureRow, { label: 'Media Devices', supported: f.mediaDevices }),
      f.pdfViewer !== null ? h(FeatureRow, { label: 'PDF Viewer', supported: f.pdfViewer }) : null,
    ),

    h(Card, { icon: icons.monitor, title: 'Device APIs' },
      h(FeatureRow, { label: 'Geolocation', supported: f.geolocation }),
      h(FeatureRow, { label: 'Notifications', supported: f.notifications }),
      h(FeatureRow, { label: 'Clipboard API', supported: f.clipboardAPI }),
      h(FeatureRow, { label: 'Vibration', supported: f.vibration }),
      h(FeatureRow, { label: 'Bluetooth', supported: f.bluetooth }),
      h(FeatureRow, { label: 'USB', supported: f.usb }),
      h(FeatureRow, { label: 'Gamepads', supported: f.gamepads }),
    ),
  );
};

// ── Tab: Headers ────────────────────────────────────────────────────────────

const HeadersTab = ({ headers, loading }) => {
  const [filter, setFilter] = useState('');

  const entries = useMemo(() => {
    if (!headers) return [];
    return Object.entries(headers).sort((a, b) => a[0].localeCompare(b[0]));
  }, [headers]);

  const filtered = useMemo(() => {
    if (!filter) return entries;
    const q = filter.toLowerCase();
    return entries.filter(([k, v]) => k.toLowerCase().includes(q) || v.toLowerCase().includes(q));
  }, [entries, filter]);

  if (loading) {
    return h('div', { className: 'text-center py-16 text-[#C1BDB3]/50 font-mono text-sm' }, 'Loading headers\u2026');
  }

  if (!headers || entries.length === 0) {
    return h('div', { className: 'text-center py-16 text-[#C1BDB3]/50 font-mono text-sm' }, 'Headers unavailable');
  }

  return h('div', { className: 'space-y-3' },

    h('div', { className: 'relative' },
      h('div', { className: 'absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none' }, h(icons.search)),
      h('input', {
        type: 'text',
        placeholder: 'Filter headers\u2026',
        value: filter,
        onChange: (e) => setFilter(e.target.value),
        className: 'w-full bg-white/[0.04] border border-white/[0.06] rounded-lg pl-9 pr-16 py-2.5 text-sm font-mono text-white/90 placeholder-[#C1BDB3]/40 focus:outline-none focus:border-[#826AED]/50 focus:ring-1 focus:ring-[#826AED]/30',
      }),
      h('span', { className: 'absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#C1BDB3]/50 font-mono' },
        `${filtered.length} / ${entries.length}`,
      ),
    ),

    h('div', { className: 'bg-white/[0.02] rounded-xl border border-white/[0.06] overflow-hidden' },

      h('div', { className: 'grid grid-cols-[140px_1fr] sm:grid-cols-[200px_1fr] md:grid-cols-[250px_1fr] bg-white/[0.04] px-4 py-2.5 border-b border-white/[0.06]' },
        h('span', { className: 'text-[10px] uppercase tracking-widest text-[#C1BDB3] font-semibold' }, 'Name'),
        h('span', { className: 'text-[10px] uppercase tracking-widest text-[#C1BDB3] font-semibold' }, 'Value'),
      ),

      filtered.length === 0
        ? h('div', { className: 'px-4 py-8 text-center text-sm text-[#C1BDB3]/50 font-mono' }, 'No matching headers')
        : filtered.map(([name, value], i) =>
            h('div', {
              key: name,
              className: `grid grid-cols-[140px_1fr] sm:grid-cols-[200px_1fr] md:grid-cols-[250px_1fr] px-4 py-2.5 border-b border-white/5 last:border-0 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`,
            },
              h('span', { className: 'text-sm font-mono text-[#C879FF] break-words pr-3' }, name),
              h('span', { className: 'text-sm font-mono text-white/80 break-words' }, value),
            ),
          ),
    ),
  );
};

// ── Main Application ────────────────────────────────────────────────────────

const BrowserInfo = () => {
  const [clientData, setClientData] = useState(collectAllClientData);
  const [ipData, setIpData] = useState(null);
  const [headers, setHeaders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  const loadExternalData = async () => {
    setLoading(true);
    const [ip, hdrs] = await Promise.all([fetchIPData(), fetchHeaders()]);
    setIpData(ip);
    setHeaders(hdrs);
    setLoading(false);
  };

  const refresh = () => {
    setClientData(collectAllClientData());
    loadExternalData();
  };

  useEffect(() => { loadExternalData(); }, []);

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
    language: clientData.language,
    hardware: clientData.hardware,
    features: clientData.features,
    networkInfo: clientData.networkInfo,
    timezone: clientData.timezone,
    userAgent: clientData.userAgent,
    headers: headers || {},
  });

  const copyJSON = async () => {
    const json = JSON.stringify(buildReport(), null, 2);
    try {
      await navigator.clipboard.writeText(json);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = json;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const headerCount = headers ? Object.keys(headers).length : 0;

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return h(OverviewTab, { data: clientData, ipData, loading });
      case 'network':  return h(NetworkTab, { data: clientData, ipData, loading });
      case 'hardware': return h(HardwareTab, { data: clientData });
      case 'features': return h(FeaturesTab, { data: clientData });
      case 'headers':  return h(HeadersTab, { headers, loading });
      default: return null;
    }
  };

  // ── Render ────────────────────────────────────────────────────────────

  return h('div', {
    className: 'min-h-screen p-4 md:p-8',
    style: { background: 'linear-gradient(135deg, #e08d5c 0%, #c97b8b 25%, #a87cb8 50%, #826AED 75%, #6a5acd 100%)' },
  },
    h('div', { className: 'max-w-4xl mx-auto' },

      // Main card
      h('div', { className: 'bg-[#07090F]/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 overflow-hidden' },

        // Header bar
        h('div', { className: 'flex items-center justify-between px-5 md:px-8 pt-6 pb-2' },
          h('div', { className: 'flex items-center gap-2' },
            h('div', { className: 'w-2 h-2 rounded-full bg-[#C879FF]' }),
            h('span', { className: 'text-sm font-mono font-semibold text-[#C1BDB3] tracking-wide' }, 'browser.fyi'),
          ),
          h('button', {
            onClick: refresh,
            className: 'text-[#C1BDB3]/60 hover:text-[#C879FF] transition-colors p-1.5 rounded-lg hover:bg-white/5',
            title: 'Refresh all data',
          }, h(icons.refresh)),
        ),

        // Tab bar
        h('div', { className: 'px-5 md:px-8' },
          h(TabBar, { activeTab, onTabChange: setActiveTab, headerCount }),
        ),

        // Tab content
        h('div', { className: 'px-5 md:px-8 py-6' },
          renderTab(),
        ),

        // Raw User Agent
        h('div', { className: 'mx-5 md:mx-8 mb-6' },
          h('div', { className: 'bg-white/[0.04] rounded-xl p-4 border border-white/[0.06]' },
            h('div', { className: 'flex items-center gap-2 mb-2' },
              h(icons.terminal),
              h('h2', { className: 'text-[10px] font-semibold uppercase tracking-widest text-[#C1BDB3]' }, 'User Agent'),
            ),
            h('p', { className: 'text-xs font-mono text-[#C1BDB3]/70 break-words leading-relaxed' }, clientData.userAgent),
          ),
        ),

        // Generated date
        h('div', { className: 'px-5 md:px-8 pb-2' },
          h('p', { className: 'text-[10px] text-[#C1BDB3]/40 font-mono text-right' },
            'Generated ', new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          ),
        ),

        // Export section
        h('div', { className: 'px-5 md:px-8 py-5 border-t border-white/10' },
          h('div', { className: 'flex flex-col sm:flex-row gap-3' },
            h('button', {
              onClick: copyJSON,
              className: `flex-1 flex items-center justify-center gap-2 ${copied ? 'bg-emerald-600' : 'bg-[#826AED] hover:bg-[#9580f0]'} text-white font-mono text-sm py-3 px-5 rounded-xl transition-colors`,
            },
              copied ? h(icons.check) : h(icons.copy),
              copied ? 'Copied!' : 'Copy JSON',
            ),
            h('button', {
              onClick: downloadAsJSON,
              className: 'flex-1 flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/10 text-[#C1BDB3] font-mono text-sm py-3 px-5 rounded-xl transition-colors border border-white/10',
            },
              h(icons.download),
              'Download JSON',
            ),
          ),
          h('p', { className: 'text-[10px] text-[#C1BDB3]/40 font-mono mt-3 text-center' },
            'Data detected locally. IP info via ipinfo.io. Headers via httpbin.org. Nothing stored.',
          ),
        ),
      ),

      // Credit
      h('div', { className: 'text-white/40 text-center text-xs font-mono mt-4' },
        'made with ',
        h('span', null, '\u26A1\uFE0F'),
        ' by ',
        h('a', {
          href: 'https://linkedin.com/in/wrightclick',
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'text-white/40 hover:text-[#C879FF] transition-colors underline underline-offset-2',
        }, 'thomas'),
      ),
    ),
  );
};

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(BrowserInfo));
