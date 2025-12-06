// SafeLaylar Browser Shield - Popup Script

document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadSettings();
  setupEventListeners();
});

function loadStats() {
  chrome.runtime.sendMessage({ type: 'GET_STATS' }, (response) => {
    if (response && response.stats) {
      document.getElementById('threatsBlocked').textContent = response.stats.threatsBlocked || 0;
      document.getElementById('phishingBlocked').textContent = response.stats.phishingBlocked || 0;
      document.getElementById('scamsBlocked').textContent = response.stats.scamsBlocked || 0;
      document.getElementById('toxicBlocked').textContent = response.stats.toxicContentBlocked || 0;
    }
  });
}

function loadSettings() {
  chrome.storage.local.get(['safeLaylarEnabled', 'safeLaylarSettings'], (result) => {
    document.getElementById('enableProtection').checked = result.safeLaylarEnabled !== false;
    
    if (result.safeLaylarSettings) {
      document.getElementById('antiGrooming').checked = result.safeLaylarSettings.antiGrooming !== false;
      document.getElementById('contentFilter').checked = result.safeLaylarSettings.contentProtection !== false;
    }
    
    updateStatus(result.safeLaylarEnabled !== false);
  });
}

function setupEventListeners() {
  document.getElementById('enableProtection').addEventListener('change', (e) => {
    chrome.storage.local.set({ safeLaylarEnabled: e.target.checked });
    updateStatus(e.target.checked);
  });
  
  document.getElementById('antiGrooming').addEventListener('change', updateSettings);
  document.getElementById('contentFilter').addEventListener('change', updateSettings);
}

function updateSettings() {
  const settings = {
    antiGrooming: document.getElementById('antiGrooming').checked,
    contentProtection: document.getElementById('contentFilter').checked,
    romanceScamAlerts: true,
    deepfakeDetection: true,
    spywareProtection: true
  };
  
  chrome.storage.local.set({ safeLaylarSettings: settings });
}

function updateStatus(isEnabled) {
  const statusEl = document.getElementById('status');
  if (isEnabled) {
    statusEl.textContent = 'Protection Active';
    statusEl.style.color = '#10B981';
  } else {
    statusEl.textContent = 'Protection Disabled';
    statusEl.style.color = '#EF4444';
  }
}
