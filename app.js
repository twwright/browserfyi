'use strict';

// Icon Components
const BrowserIcon = () => {
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    className: "w-6 h-6"
  }, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10",
    fill: "#E0E7FF",
    stroke: "#6366F1",
    strokeWidth: "1.5"
  }), React.createElement("path", {
    d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10",
    stroke: "#6366F1",
    strokeWidth: "1.5",
    fill: "none"
  }), React.createElement("path", {
    d: "M2 12h20M12 2c-3 4.5-3 15 0 20",
    stroke: "#6366F1",
    strokeWidth: "1.5",
    opacity: "0.5"
  }));
};

const DeviceIcon = () => {
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    className: "w-6 h-6"
  }, React.createElement("rect", {
    x: "2",
    y: "4",
    width: "20",
    height: "14",
    rx: "2",
    fill: "#EEF2FF",
    stroke: "#6366F1",
    strokeWidth: "1.5"
  }), React.createElement("rect", {
    x: "7",
    y: "18",
    width: "10",
    height: "2",
    fill: "#6366F1"
  }), React.createElement("rect", {
    x: "4",
    y: "6",
    width: "16",
    height: "10",
    fill: "#E0E7FF"
  }));
};

const ScreenIcon = () => {
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    className: "w-6 h-6"
  }, React.createElement("rect", {
    x: "2",
    y: "3",
    width: "20",
    height: "14",
    rx: "2",
    fill: "#EEF2FF",
    stroke: "#6366F1",
    strokeWidth: "1.5"
  }), React.createElement("path", {
    d: "M8 21h8M12 17v4",
    stroke: "#6366F1",
    strokeWidth: "1.5"
  }), React.createElement("rect", {
    x: "4",
    y: "5",
    width: "16",
    height: "10",
    fill: "#E0E7FF"
  }));
};

const ViewportIcon = () => {
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    className: "w-6 h-6"
  }, React.createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "2",
    fill: "#EEF2FF",
    stroke: "#6366F1",
    strokeWidth: "1.5"
  }), React.createElement("path", {
    d: "M7 7h10M7 12h10M7 17h10",
    stroke: "#6366F1",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }));
};

const JavaScriptIcon = () => {
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    className: "w-6 h-6"
  }, React.createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "2",
    fill: "#EEF2FF",
    stroke: "#6366F1",
    strokeWidth: "1.5"
  }), React.createElement("text", {
    x: "6",
    y: "16",
    fill: "#6366F1",
    fontSize: "12",
    fontFamily: "monospace",
    fontWeight: "bold"
  }, "JS"));
};

const CookieIcon = () => {
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    className: "w-6 h-6"
  }, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9",
    fill: "#EEF2FF",
    stroke: "#6366F1",
    strokeWidth: "1.5"
  }), React.createElement("circle", {
    cx: "9",
    cy: "10",
    r: "1",
    fill: "#6366F1"
  }), React.createElement("circle", {
    cx: "15",
    cy: "9",
    r: "1",
    fill: "#6366F1"
  }), React.createElement("circle", {
    cx: "8",
    cy: "14",
    r: "1",
    fill: "#6366F1"
  }), React.createElement("circle", {
    cx: "16",
    cy: "14",
    r: "1",
    fill: "#6366F1"
  }), React.createElement("circle", {
    cx: "12",
    cy: "16",
    r: "1",
    fill: "#6366F1"
  }));
};

const BrowserInfo = () => {
  const reportRef = React.useRef(null);
  const [info, setInfo] = React.useState({
    browser: {
      name: '',
      version: '',
    },
    screen: {
      width: 0,
      height: 0,
    },
    device: {
      os: '',
      osVersion: '',
      type: '',
    },
    viewport: {
      width: 0,
      height: 0,
    },
    javascript: true,
    cookies: false,
  });

  React.useEffect(() => {
    // Detect browser info
    const ua = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = '';

    if (ua.includes('Chrome')) {
      browserName = 'Chrome';
      browserVersion = ua.match(/Chrome\/([0-9.]+)/)[1];
    } else if (ua.includes('Firefox')) {
      browserName = 'Firefox';
      browserVersion = ua.match(/Firefox\/([0-9.]+)/)[1];
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      browserName = 'Safari';
      browserVersion = ua.match(/Version\/([0-9.]+)/)[1];
    }

    // Enhanced OS detection
    let os = 'Unknown';
    let osVersion = '';
    
    // macOS detection
    if (ua.includes('Mac OS X')) {
      os = 'macOS';
      const macOSVersion = ua.match(/Mac OS X ([0-9._]+)/);
      if (macOSVersion) {
        const version = macOSVersion[1].replace(/_/g, '.');
        // Map version numbers to names
        const macOSNames = {
          '10.13': 'High Sierra',
          '10.14': 'Mojave',
          '10.15': 'Catalina',
          '11': 'Big Sur',
          '12': 'Monterey',
          '13': 'Ventura',
          '14': 'Sonoma'
        };
        const majorVersion = version.split('.').slice(0, 2).join('.');
        osVersion = macOSNames[majorVersion] || version;
      }
    }
    // Windows detection
    else if (ua.includes('Windows')) {
      os = 'Windows';
      if (ua.includes('Windows NT 10.0')) osVersion = '10/11';
      else if (ua.includes('Windows NT 6.3')) osVersion = '8.1';
      else if (ua.includes('Windows NT 6.2')) osVersion = '8';
      else if (ua.includes('Windows NT 6.1')) osVersion = '7';
    }
    // Linux detection
    else if (ua.includes('Linux')) {
      os = 'Linux';
      if (ua.includes('Ubuntu')) osVersion = 'Ubuntu';
      else if (ua.includes('Fedora')) osVersion = 'Fedora';
      else if (ua.includes('Debian')) osVersion = 'Debian';
    }
    // iOS/Android detection
    else if (ua.includes('iOS')) {
      os = 'iOS';
      const matches = ua.match(/OS ([0-9_]+)/);
      if (matches) osVersion = matches[1].replace(/_/g, '.');
    }
    else if (ua.includes('Android')) {
      os = 'Android';
      const matches = ua.match(/Android ([0-9.]+)/);
      if (matches) osVersion = matches[1];
    }

    // Update state with detected info
    setInfo({
      browser: {
        name: browserName,
        version: browserVersion,
      },
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
      device: {
        os,
        osVersion,
        type: /Mobile|Android|iOS/.test(ua) ? 'Mobile' : 'Desktop',
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      javascript: true,
      cookies: navigator.cookieEnabled,
    });
  }, []);

  const downloadAsImage = async () => {
    if (reportRef.current && window.html2canvas) {
      try {
        const canvas = await window.html2canvas(reportRef.current, {
          backgroundColor: 'white',
          scale: 2,
          logging: false,
          useCORS: true,
          windowWidth: reportRef.current.offsetWidth,
          windowHeight: reportRef.current.offsetHeight
        });

        canvas.toBlob((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `browser-report-${new Date().toISOString().split('T')[0]}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 'image/png');
      } catch (err) {
        console.error('Failed to generate image:', err);
      }
    }
  };
  
  const InfoCard = ({ icon: Icon, title, children }) => {
    return React.createElement("div", {
      className: "bg-white rounded-lg p-4 shadow-sm border border-indigo-100"
    }, React.createElement("div", {
      className: "flex items-center gap-3 mb-2"
    }, React.createElement("div", {
      className: "flex-shrink-0"
    }, React.createElement(Icon, null)), React.createElement("h2", {
      className: "text-lg font-mono text-indigo-600"
    }, title)), React.createElement("div", {
      className: "text-gray-700 font-mono pl-9 text-sm"
    }, children));
  };
  
  return React.createElement("div", {
    className: "min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-6"
  }, React.createElement("div", {
    className: "max-w-3xl mx-auto"
  }, React.createElement("div", {
    className: "bg-white/95 backdrop-blur rounded-xl shadow-xl p-8 mb-8 border border-indigo-200"
  }, 
    // Content to be captured
    React.createElement("div", {
      ref: reportRef,
      className: "mb-8"
    },
      // Header
      React.createElement("div", {
        className: "flex items-baseline mb-6"
      }, React.createElement("h1", {
        className: "text-2xl font-mono font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
      }, "browser.fyi")),
      
      // Date
      React.createElement("p", {
        className: "text-indigo-900 mb-6 font-mono"
      }, "Report generated on ", new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })),
      
      // Info Cards Grid
      React.createElement("div", {
        className: "grid grid-cols-2 gap-x-6 gap-y-3"
      }, 
        React.createElement("div", {
          className: "space-y-3"
        }, 
          React.createElement(InfoCard, {
            icon: BrowserIcon,
            title: "Browser"
          }, info.browser.name, React.createElement("br"), info.browser.version),
          
          React.createElement(InfoCard, {
            icon: DeviceIcon,
            title: "Device"
          }, info.device.os, " ", info.device.osVersion, React.createElement("br"), info.device.type),
          
          React.createElement(InfoCard, {
            icon: JavaScriptIcon,
            title: "JavaScript"
          }, info.javascript ? 'Available' : 'Not Available')
        ),
        
        React.createElement("div", {
          className: "space-y-3"
        }, 
          React.createElement(InfoCard, {
            icon: ScreenIcon,
            title: "Screen"
          }, "Width: ", info.screen.width, "px", React.createElement("br"), "Height: ", info.screen.height, "px"),
          
          React.createElement(InfoCard, {
            icon: ViewportIcon,
            title: "Viewport"
          }, "Width: ", info.viewport.width, "px", React.createElement("br"), "Height: ", info.viewport.height, "px"),
          
          React.createElement(InfoCard, {
            icon: CookieIcon,
            title: "Cookies"
          }, info.cookies ? 'Available' : 'Not Available')
        )
      )
    ),
    
    // Share Section (outside of capture area)
    React.createElement("div", {
      className: "border-t border-indigo-200 pt-6"
    }, 
      React.createElement("h2", {
        className: "text-xl font-mono font-semibold text-indigo-900 mb-4"
      }, "Share this information"),
      
      React.createElement("p", {
        className: "text-indigo-800 mb-4 font-mono"
      }, "Click the button below to download this report as an image that you can easily share."),
      
      React.createElement("button", {
        onClick: downloadAsImage,
        className: "w-full bg-indigo-600 hover:bg-indigo-700 text-white font-mono py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
      }, React.createElement("svg", {
        className: "w-5 h-5",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, React.createElement("path", {
        d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
      }), React.createElement("polyline", {
        points: "7 10 12 15 17 10"
      }), React.createElement("line", {
        x1: "12",
        y1: "15",
        x2: "12",
        y2: "3"
      })), "DOWNLOAD AS IMAGE")
    ),
    
    // Privacy Notice (outside of capture area)
    React.createElement("div", {
      className: "mt-4 bg-indigo-50 rounded-lg p-4"
    }, React.createElement("p", {
      className: "font-mono text-sm text-indigo-800"
    }, "All information is collected anonymously and cannot be used to identify you or your device."))
  )));
};

// Mount the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(BrowserInfo));