// Background script for Account Folder Manager

// Initialize storage on first install
messenger.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // Initialize with empty groups array
    await messenger.storage.local.set({ 
      accountGroups: [],
      groupCollapseState: {}
    });
    console.log('Account Folder Manager installed - storage initialized');
  } else if (details.reason === 'update') {
    console.log('Account Folder Manager updated to version', messenger.runtime.getManifest().version);
  }
});

// Handle toolbar button click - open the tab
messenger.browserAction.onClicked.addListener(async () => {
  // Check if tab is already open
  const tabs = await messenger.tabs.query({});
  const existingTab = tabs.find(tab => tab.url && tab.url.includes('tab-view/tab-view.html'));
  
  if (existingTab) {
    // Switch to existing tab
    await messenger.tabs.update(existingTab.id, { active: true });
  } else {
    // Create new tab
    await messenger.tabs.create({
      url: 'tab-view/tab-view.html'
    });
  }
});

// Periodically check for deleted accounts and clean up storage
async function cleanupAccounts() {
  try {
    // Get all current accounts
    const accounts = await messenger.accounts.list();
    const validAccountIds = accounts.map(acc => acc.id);
    
    // Get groups from storage
    const result = await messenger.storage.local.get('accountGroups');
    const groups = result.accountGroups || [];
    
    let modified = false;
    
    // Remove invalid account IDs from groups
    groups.forEach(group => {
      const originalLength = group.accountIds.length;
      group.accountIds = group.accountIds.filter(id => validAccountIds.includes(id));
      if (group.accountIds.length !== originalLength) {
        modified = true;
      }
    });
    
    // Save if modified
    if (modified) {
      await messenger.storage.local.set({ accountGroups: groups });
      console.log('Cleaned up deleted accounts from groups');
    }
  } catch (error) {
    console.error('Error cleaning up accounts:', error);
  }
}

// Run cleanup when extension starts
cleanupAccounts();

// Run cleanup periodically (every 5 minutes)
setInterval(cleanupAccounts, 5 * 60 * 1000);

console.log('Account Folder Manager background script loaded');
