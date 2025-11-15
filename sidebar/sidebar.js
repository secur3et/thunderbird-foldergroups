// Sidebar JavaScript - Account Groups Display

let allAccounts = [];
let groups = [];
let collapseState = {};

// Initialize sidebar
async function init() {
  try {
    console.log('Initializing Account Groups popup...');
    
    // Check if messenger API is available
    if (typeof messenger === 'undefined') {
      console.error('messenger API not available!');
      document.body.innerHTML = '<div style="padding: 20px;">Error: Thunderbird API not available. Please reload the extension.</div>';
      return;
    }
    
    // Load data
    await loadAccounts();
    await loadGroups();
    await loadCollapseState();
    
    // Render UI
    renderUI();
    
    // Setup event listeners
    setupEventListeners();
    
    // Listen for storage changes (from options page)
    messenger.storage.onChanged.addListener(handleStorageChange);
    
    console.log('Account Groups popup initialized successfully');
  } catch (error) {
    console.error('Error initializing sidebar:', error);
    document.body.innerHTML = '<div style="padding: 20px; color: red;">Error loading: ' + error.message + '</div>';
  }
}

// Load all accounts from Thunderbird
async function loadAccounts() {
  try {
    allAccounts = await messenger.accounts.list();
    console.log('Loaded accounts:', allAccounts);
  } catch (error) {
    console.error('Error loading accounts:', error);
    allAccounts = [];
  }
}

// Load groups from storage
async function loadGroups() {
  groups = await getGroups();
}

// Load collapse state from storage
async function loadCollapseState() {
  collapseState = await getCollapseState();
}

// Handle storage changes
async function handleStorageChange(changes, area) {
  if (area !== 'local') return;
  
  if (changes.accountGroups) {
    await loadGroups();
    renderUI();
  }
}

// Render the entire UI
function renderUI() {
  renderGroups();
  renderUngroupedAccounts();
  
  // Show/hide empty state
  const emptyState = document.getElementById('emptyState');
  if (allAccounts.length === 0) {
    emptyState.style.display = 'block';
    document.getElementById('ungroupedSection').style.display = 'none';
    document.getElementById('groupsContainer').style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    document.getElementById('ungroupedSection').style.display = 'block';
    document.getElementById('groupsContainer').style.display = 'block';
  }
}

// Render groups
function renderGroups() {
  const container = document.getElementById('groupsContainer');
  container.innerHTML = '';
  
  groups.forEach(group => {
    const groupElement = createGroupElement(group);
    container.appendChild(groupElement);
  });
}

// Create a group element
function createGroupElement(group) {
  const groupDiv = document.createElement('div');
  groupDiv.className = 'group-item';
  groupDiv.dataset.groupId = group.id;
  
  // Get accounts in this group
  const groupAccounts = allAccounts.filter(acc => group.accountIds.includes(acc.id));
  const isCollapsed = collapseState[group.id] || false;
  
  // Group header
  const headerDiv = document.createElement('div');
  headerDiv.className = 'group-header';
  headerDiv.innerHTML = `
    <span class="collapse-icon ${isCollapsed ? 'collapsed' : ''}">▼</span>
    <span class="group-icon">📁</span>
    <span class="group-name">${escapeHtml(group.name)}</span>
    <span class="account-count">${groupAccounts.length}</span>
  `;
  
  // Group accounts container
  const accountsDiv = document.createElement('div');
  accountsDiv.className = `group-accounts ${isCollapsed ? 'hidden' : ''}`;
  
  groupAccounts.forEach(account => {
    const accountElement = createAccountElement(account);
    accountsDiv.appendChild(accountElement);
  });
  
  // Add click handler for collapse/expand
  headerDiv.addEventListener('click', () => toggleGroup(group.id));
  
  groupDiv.appendChild(headerDiv);
  groupDiv.appendChild(accountsDiv);
  
  return groupDiv;
}

// Render ungrouped accounts
function renderUngroupedAccounts() {
  const container = document.getElementById('ungroupedAccounts');
  container.innerHTML = '';
  
  // Get all account IDs that are in groups
  const groupedAccountIds = new Set();
  groups.forEach(group => {
    group.accountIds.forEach(id => groupedAccountIds.add(id));
  });
  
  // Filter ungrouped accounts
  const ungroupedAccounts = allAccounts.filter(acc => !groupedAccountIds.has(acc.id));
  
  if (ungroupedAccounts.length === 0) {
    document.getElementById('ungroupedSection').style.display = 'none';
  } else {
    document.getElementById('ungroupedSection').style.display = 'block';
    ungroupedAccounts.forEach(account => {
      const accountElement = createAccountElement(account);
      container.appendChild(accountElement);
    });
  }
}

// Create an account element
function createAccountElement(account) {
  const accountDiv = document.createElement('div');
  accountDiv.className = 'account-item';
  accountDiv.dataset.accountId = account.id;
  
  // Determine account icon based on type
  let icon = '📧';
  if (account.type === 'imap') icon = '📨';
  else if (account.type === 'pop3') icon = '📬';
  else if (account.type === 'nntp') icon = '📰';
  
  accountDiv.innerHTML = `
    <span class="account-icon">${icon}</span>
    <div class="account-info">
      <div class="account-name">${escapeHtml(account.name)}</div>
      ${account.identities && account.identities[0] ? 
        `<div class="account-email">${escapeHtml(account.identities[0].email)}</div>` : ''}
    </div>
  `;
  
  // Add click handler (future: navigate to account)
  accountDiv.addEventListener('click', () => handleAccountClick(account));
  
  return accountDiv;
}

// Toggle group collapse/expand
async function toggleGroup(groupId) {
  const isCurrentlyCollapsed = collapseState[groupId] || false;
  const newState = !isCurrentlyCollapsed;
  
  // Update state
  collapseState[groupId] = newState;
  await setCollapseState(groupId, newState);
  
  // Update UI
  const groupElement = document.querySelector(`[data-group-id="${groupId}"]`);
  if (groupElement) {
    const collapseIcon = groupElement.querySelector('.collapse-icon');
    const accountsDiv = groupElement.querySelector('.group-accounts');
    
    if (newState) {
      collapseIcon.classList.add('collapsed');
      accountsDiv.classList.add('hidden');
    } else {
      collapseIcon.classList.remove('collapsed');
      accountsDiv.classList.remove('hidden');
    }
  }
}

// Handle account click
async function handleAccountClick(account) {
  console.log('Account clicked:', account.name);
  
  try {
    // Get the account's root folder
    const folders = await messenger.folders.getSubFolders(account);
    
    if (folders && folders.length > 0) {
      // Try to find the Inbox first, otherwise use the first folder
      let targetFolder = folders.find(f => f.type === 'inbox' || f.name.toLowerCase() === 'inbox');
      if (!targetFolder) {
        targetFolder = folders[0]; // Use first available folder
      }
      
      // Get the current mail tab
      const tabs = await messenger.tabs.query({ mailTab: true });
      
      if (tabs && tabs.length > 0) {
        // Update the current mail tab to show this folder
        await messenger.mailTabs.update(tabs[0].id, {
          displayedFolder: targetFolder
        });
        
        console.log('Navigated to:', targetFolder.name, 'in account:', account.name);
      } else {
        console.error('No mail tab found');
      }
    } else {
      console.warn('No folders found for account:', account.name);
    }
  } catch (error) {
    console.error('Error opening account:', error);
  }
}

// Setup event listeners
function setupEventListeners() {
  // Open options button
  document.getElementById('openOptions').addEventListener('click', () => {
    messenger.runtime.openOptionsPage();
  });
}

// Utility: Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Start the sidebar
init();

