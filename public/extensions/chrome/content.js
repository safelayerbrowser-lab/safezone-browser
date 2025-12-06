// SafeLaylar Browser Shield - Content Script
// Monitors page content and applies real-time protection

(function() {
  'use strict';

  const SCAN_INTERVAL = 2000;
  const BLUR_CLASS = 'safelaylar-blur';
  const BLOCKED_CLASS = 'safelaylar-blocked';

  let isEnabled = true;
  let filterSettings = {
    antiGrooming: true,
    contentProtection: true,
    romanceScamAlerts: true,
    deepfakeDetection: true,
    spywareProtection: true,
    sensitivityLevel: 'balanced'
  };

  // Load settings
  chrome.storage.local.get(['safeLaylarEnabled', 'safeLaylarSettings'], (result) => {
    if (result.safeLaylarEnabled !== undefined) {
      isEnabled = result.safeLaylarEnabled;
    }
    if (result.safeLaylarSettings) {
      filterSettings = { ...filterSettings, ...result.safeLaylarSettings };
    }
    if (isEnabled) {
      initProtection();
    }
  });

  function initProtection() {
    injectStyles();
    scanPage();
    observeMutations();
    showProtectionBadge();
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .${BLUR_CLASS} {
        filter: blur(10px) !important;
        transition: filter 0.3s ease !important;
        cursor: pointer !important;
        position: relative !important;
      }
      .${BLUR_CLASS}::after {
        content: '🛡️ Content filtered by SafeLaylar' !important;
        position: absolute !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        background: rgba(15, 104, 239, 0.95) !important;
        color: white !important;
        padding: 8px 16px !important;
        border-radius: 8px !important;
        font-size: 12px !important;
        font-family: Inter, sans-serif !important;
        white-space: nowrap !important;
        z-index: 10000 !important;
        pointer-events: none !important;
      }
      .${BLOCKED_CLASS} {
        display: none !important;
      }
      .safelaylar-badge {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        background: linear-gradient(135deg, #1590F0, #0F68EF) !important;
        color: white !important;
        padding: 10px 16px !important;
        border-radius: 50px !important;
        font-size: 12px !important;
        font-family: Inter, sans-serif !important;
        z-index: 999999 !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        box-shadow: 0 4px 20px rgba(15, 104, 239, 0.4) !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
      }
      .safelaylar-badge:hover {
        transform: scale(1.05) !important;
        box-shadow: 0 6px 25px rgba(15, 104, 239, 0.5) !important;
      }
      .safelaylar-badge svg {
        width: 16px !important;
        height: 16px !important;
      }
    `;
    document.head.appendChild(style);
  }

  function scanPage() {
    if (!isEnabled) return;

    const textNodes = getTextNodes(document.body);
    textNodes.forEach(node => {
      const text = node.textContent;
      if (shouldFilter(text)) {
        const parent = node.parentElement;
        if (parent && !parent.classList.contains(BLUR_CLASS)) {
          parent.classList.add(BLUR_CLASS);
          sendToBackground(text);
        }
      }
    });

    // Scan images for potential deepfakes (placeholder - would use ML in production)
    if (filterSettings.deepfakeDetection) {
      scanImages();
    }

    // Scan links for phishing
    if (filterSettings.spywareProtection) {
      scanLinks();
    }
  }

  function getTextNodes(element) {
    const nodes = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.trim().length > 10) {
        nodes.push(node);
      }
    }
    return nodes;
  }

  function shouldFilter(text) {
    const lowerText = text.toLowerCase();
    
    // Toxic content patterns
    const toxicPatterns = [
      /kill.*yourself/i,
      /you.*worthless/i,
      /hate.*you/i,
      /go.*die/i
    ];

    // Grooming patterns
    const groomingPatterns = [
      /don't.*tell.*anyone/i,
      /our.*little.*secret/i,
      /send.*me.*a.*picture/i,
      /how.*old.*are.*you.*really/i,
      /your.*parents.*don't.*need.*to.*know/i
    ];

    // Scam patterns
    const scamPatterns = [
      /congratulations.*you.*won/i,
      /claim.*your.*prize/i,
      /urgent.*account.*suspended/i,
      /verify.*immediately.*or.*lose/i,
      /nigerian.*prince/i,
      /wire.*transfer.*urgent/i
    ];

    // Romance scam patterns
    const romanceScamPatterns = [
      /fallen.*in.*love.*with.*you/i,
      /need.*money.*emergency/i,
      /can't.*video.*call.*right.*now/i,
      /military.*deployed.*overseas/i
    ];

    if (filterSettings.contentProtection) {
      for (const pattern of toxicPatterns) {
        if (pattern.test(lowerText)) return true;
      }
    }

    if (filterSettings.antiGrooming) {
      for (const pattern of groomingPatterns) {
        if (pattern.test(lowerText)) return true;
      }
    }

    if (filterSettings.romanceScamAlerts) {
      for (const pattern of [...scamPatterns, ...romanceScamPatterns]) {
        if (pattern.test(lowerText)) return true;
      }
    }

    return false;
  }

  function scanImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Placeholder for ML-based deepfake detection
      // In production, would send to ML service for analysis
    });
  }

  function scanLinks() {
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      chrome.runtime.sendMessage(
        { type: 'CHECK_URL', url: link.href },
        (response) => {
          if (response && !response.isSafe) {
            link.classList.add(BLUR_CLASS);
            link.addEventListener('click', (e) => {
              e.preventDefault();
              alert('SafeLaylar blocked this link for your protection.');
            });
          }
        }
      );
    });
  }

  function sendToBackground(content) {
    chrome.runtime.sendMessage(
      { type: 'ANALYZE_CONTENT', content },
      (response) => {
        if (response && response.threats.length > 0) {
          console.log('SafeLaylar: Threats detected and blocked', response.threats);
        }
      }
    );
  }

  function observeMutations() {
    const observer = new MutationObserver((mutations) => {
      let shouldScan = false;
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          shouldScan = true;
        }
      });
      if (shouldScan) {
        setTimeout(scanPage, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function showProtectionBadge() {
    const badge = document.createElement('div');
    badge.className = 'safelaylar-badge';
    badge.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
      Protected
    `;
    badge.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'GET_STATS' }, (response) => {
        if (response && response.stats) {
          alert(`SafeLaylar Protection Stats:\n\nThreats Blocked: ${response.stats.threatsBlocked}\nPhishing: ${response.stats.phishingBlocked}\nScams: ${response.stats.scamsBlocked}\nToxic Content: ${response.stats.toxicContentBlocked}`);
        }
      });
    });
    
    document.body.appendChild(badge);
  }

  // Listen for settings changes
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.safeLaylarEnabled) {
      isEnabled = changes.safeLaylarEnabled.newValue;
    }
    if (changes.safeLaylarSettings) {
      filterSettings = { ...filterSettings, ...changes.safeLaylarSettings.newValue };
    }
  });

})();
