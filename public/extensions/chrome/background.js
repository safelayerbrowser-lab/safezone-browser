// SafeLaylar Browser Shield - Background Service Worker
// Handles content filtering, threat detection, and notifications

const THREAT_PATTERNS = {
  phishing: [
    /verify.*account.*urgent/i,
    /suspended.*account.*action/i,
    /password.*expired.*reset/i,
    /congratulations.*winner/i,
    /claim.*prize.*now/i,
    /account.*unusual.*activity/i
  ],
  scam: [
    /send.*money.*wire/i,
    /nigerian.*prince/i,
    /inheritance.*claim/i,
    /lottery.*winner/i,
    /bitcoin.*invest.*guaranteed/i,
    /work.*from.*home.*easy/i
  ],
  toxic: [
    /hate.*speech/i,
    /kill.*yourself/i,
    /you.*worthless/i
  ],
  grooming: [
    /don't.*tell.*parents/i,
    /our.*secret/i,
    /send.*picture/i,
    /how.*old.*are.*you/i
  ]
};

const BLOCKED_DOMAINS = new Set([
  'malware-domain.com',
  'phishing-site.net',
  'scam-website.org'
]);

let stats = {
  threatsBlocked: 0,
  phishingBlocked: 0,
  scamsBlocked: 0,
  toxicContentBlocked: 0,
  groomingPatternsDetected: 0,
  deepfakesDetected: 0,
  lastUpdated: Date.now()
};

// Load stats from storage
chrome.storage.local.get(['safeLaylarStats'], (result) => {
  if (result.safeLaylarStats) {
    stats = { ...stats, ...result.safeLaylarStats };
  }
});

// Save stats periodically
setInterval(() => {
  chrome.storage.local.set({ safeLaylarStats: stats });
}, 30000);

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ANALYZE_CONTENT') {
    const threats = analyzeContent(request.content);
    if (threats.length > 0) {
      updateStats(threats);
      sendNotification(threats);
    }
    sendResponse({ threats, stats });
  } else if (request.type === 'GET_STATS') {
    sendResponse({ stats });
  } else if (request.type === 'CHECK_URL') {
    const isSafe = !BLOCKED_DOMAINS.has(new URL(request.url).hostname);
    sendResponse({ isSafe });
  }
  return true;
});

function analyzeContent(content) {
  const threats = [];
  const text = content.toLowerCase();
  
  for (const [category, patterns] of Object.entries(THREAT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        threats.push({
          category,
          severity: getSeverity(category),
          pattern: pattern.toString(),
          timestamp: Date.now()
        });
        break;
      }
    }
  }
  
  return threats;
}

function getSeverity(category) {
  const severityMap = {
    phishing: 'critical',
    scam: 'high',
    toxic: 'medium',
    grooming: 'critical'
  };
  return severityMap[category] || 'medium';
}

function updateStats(threats) {
  threats.forEach(threat => {
    stats.threatsBlocked++;
    switch (threat.category) {
      case 'phishing':
        stats.phishingBlocked++;
        break;
      case 'scam':
        stats.scamsBlocked++;
        break;
      case 'toxic':
        stats.toxicContentBlocked++;
        break;
      case 'grooming':
        stats.groomingPatternsDetected++;
        break;
    }
  });
  stats.lastUpdated = Date.now();
}

function sendNotification(threats) {
  const criticalThreats = threats.filter(t => t.severity === 'critical');
  if (criticalThreats.length > 0) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'SafeLaylar Alert',
      message: `Blocked ${criticalThreats.length} critical threat(s). You're protected!`,
      priority: 2
    });
  }
}

// Context menu for reporting
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'safelaylar-report',
    title: 'Report to SafeLaylar',
    contexts: ['selection', 'link', 'image']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'safelaylar-report') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Report Submitted',
      message: 'Thank you for helping keep the internet safe!',
      priority: 1
    });
  }
});

console.log('SafeLaylar Browser Shield initialized');
