// Tab View JavaScript - Account Groups with Email List

let allAccounts = [];
let groups = [];
let collapseState = {};
let currentAccount = null;
let currentFolder = null;
let isDarkMode = false;

// Initialize tab view
async function init() {
  try {
    console.log('Initializing Account Groups tab...');
    
    // Load theme preference
    await loadTheme();
    
    // Load data
    await loadAccounts();
    await loadGroups();
    await loadCollapseState();
    
    // Render UI
    renderAccountsPanel();
    
    // Setup event listeners
    setupEventListeners();
    
    // Listen for storage changes (from options page)
    messenger.storage.onChanged.addListener(handleStorageChange);
    
    console.log('Account Groups tab initialized successfully');
  } catch (error) {
    console.error('Error initializing tab:', error);
  }
}

// Load theme preference
async function loadTheme() {
  try {
    const result = await messenger.storage.local.get('darkMode');
    isDarkMode = result.darkMode || false;
    applyTheme();
  } catch (error) {
    console.error('Error loading theme:', error);
  }
}

// Apply theme
function applyTheme() {
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    document.getElementById('toggleTheme').textContent = '☀️';
    document.getElementById('toggleTheme').title = 'Toggle Light Mode';
  } else {
    document.body.classList.remove('dark-mode');
    document.getElementById('toggleTheme').textContent = '🌙';
    document.getElementById('toggleTheme').title = 'Toggle Night Mode';
  }
}

// Toggle theme
async function toggleTheme() {
  isDarkMode = !isDarkMode;
  applyTheme();
  
  try {
    await messenger.storage.local.set({ darkMode: isDarkMode });
  } catch (error) {
    console.error('Error saving theme:', error);
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
    renderAccountsPanel();
  }
}

// Render the accounts panel (left side)
function renderAccountsPanel() {
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
  
  const collapseIcon = document.createElement('span');
  collapseIcon.className = 'collapse-icon' + (isCollapsed ? ' collapsed' : '');
  collapseIcon.textContent = '▼';
  
  const groupIcon = document.createElement('span');
  groupIcon.className = 'group-icon';
  groupIcon.textContent = '📁';
  
  const groupName = document.createElement('span');
  groupName.className = 'group-name';
  groupName.textContent = group.name;
  
  const accountCount = document.createElement('span');
  accountCount.className = 'account-count';
  accountCount.textContent = groupAccounts.length;
  
  headerDiv.appendChild(collapseIcon);
  headerDiv.appendChild(groupIcon);
  headerDiv.appendChild(groupName);
  headerDiv.appendChild(accountCount);
  
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
  
  const iconSpan = document.createElement('span');
  iconSpan.className = 'account-icon';
  iconSpan.textContent = icon;
  
  const infoDiv = document.createElement('div');
  infoDiv.className = 'account-info';
  
  const nameDiv = document.createElement('div');
  nameDiv.className = 'account-name';
  nameDiv.textContent = account.name;
  infoDiv.appendChild(nameDiv);
  
  if (account.identities && account.identities[0]) {
    const emailDiv = document.createElement('div');
    emailDiv.className = 'account-email';
    emailDiv.textContent = account.identities[0].email;
    infoDiv.appendChild(emailDiv);
  }
  
  accountDiv.appendChild(iconSpan);
  accountDiv.appendChild(infoDiv);
  
  // Add click handler
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

// Handle account click - load emails
async function handleAccountClick(account) {
  console.log('Account clicked:', account.name);
  
  // Mark account as active
  document.querySelectorAll('.account-item').forEach(el => el.classList.remove('active'));
  const clickedElement = document.querySelector(`[data-account-id="${account.id}"]`);
  if (clickedElement) {
    clickedElement.classList.add('active');
  }
  
  // Update current account
  currentAccount = account;
  
  // Update header
  document.getElementById('currentAccountName').textContent = account.name;
  
  try {
    // Get the account's folders (use rootFolder.id for newer Thunderbird versions)
    const folders = await messenger.folders.getSubFolders(account.rootFolder.id);
    
    if (folders && folders.length > 0) {
      // Try to find the Inbox first
      let targetFolder = folders.find(f => f.type === 'inbox' || f.name.toLowerCase() === 'inbox');
      if (!targetFolder) {
        targetFolder = folders[0]; // Use first available folder
      }
      
      currentFolder = targetFolder;
      document.getElementById('currentFolderName').textContent = targetFolder.name;
      
      // Load emails from this folder
      await loadEmails(targetFolder);
    } else {
      showError('No folders found for this account');
    }
  } catch (error) {
    console.error('Error loading account:', error);
    showError('Error loading emails: ' + error.message);
  }
}

// Load emails from a folder
async function loadEmails(folder) {
  const container = document.getElementById('emailListContainer');
  
  // Show loading
  container.textContent = '';
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading-message';
  loadingDiv.textContent = '⏳ Loading emails...';
  container.appendChild(loadingDiv);
  
  try {
    // Get messages from the folder (use folder.id for newer Thunderbird versions)
    const messagePage = await messenger.messages.list(folder.id);
    const messages = messagePage.messages || [];
    
    // Update count
    document.getElementById('emailCount').textContent = messages.length;
    
    if (messages.length === 0) {
      container.textContent = '';
      const welcomeDiv = document.createElement('div');
      welcomeDiv.className = 'welcome-message';
      const p = document.createElement('p');
      p.textContent = 'No messages in this folder';
      welcomeDiv.appendChild(p);
      container.appendChild(welcomeDiv);
      return;
    }
    
    // Render email list
    const emailListDiv = document.createElement('div');
    emailListDiv.className = 'email-list';
    
    messages.forEach(message => {
      const emailItem = createEmailItem(message);
      emailListDiv.appendChild(emailItem);
    });
    
    container.innerHTML = '';
    container.appendChild(emailListDiv);
    
  } catch (error) {
    console.error('Error loading emails:', error);
    showError('Error loading emails: ' + error.message);
  }
}

// Create an email item
function createEmailItem(message) {
  const div = document.createElement('div');
  div.className = 'email-item' + (message.read ? '' : ' unread');
  div.dataset.messageId = message.id;
  
  // Format date
  const date = new Date(message.date);
  const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  
  // Get from name/email
  const from = message.author || 'Unknown';
  
  // Get subject
  const subject = message.subject || '(No subject)';
  
  const headerRow = document.createElement('div');
  headerRow.className = 'email-header-row';
  
  const fromSpan = document.createElement('span');
  fromSpan.className = 'email-from';
  fromSpan.textContent = from;
  
  const dateSpan = document.createElement('span');
  dateSpan.className = 'email-date';
  dateSpan.textContent = dateStr;
  
  headerRow.appendChild(fromSpan);
  headerRow.appendChild(dateSpan);
  
  const subjectDiv = document.createElement('div');
  subjectDiv.className = 'email-subject';
  subjectDiv.textContent = subject;
  
  div.appendChild(headerRow);
  div.appendChild(subjectDiv);
  
  // Add click handler to open message
  div.addEventListener('click', () => handleEmailClick(message));
  
  return div;
}

// Handle email click
async function handleEmailClick(message) {
  console.log('Email clicked:', message.subject);
  
  try {
    // Open the message in a new tab
    await messenger.messageDisplay.open({
      messageId: message.id,
      location: 'tab'
    });
  } catch (error) {
    console.error('Error opening message:', error);
  }
}

// Show error message
function showError(message) {
  const container = document.getElementById('emailListContainer');
  container.textContent = '';
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = '❌ ' + message;
  container.appendChild(errorDiv);
}

// Setup event listeners
function setupEventListeners() {
  // Toggle theme button
  document.getElementById('toggleTheme').addEventListener('click', toggleTheme);
  
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

// Start the tab view
init();

