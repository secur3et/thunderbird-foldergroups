// Options Page JavaScript - Group Management with Drag & Drop

let allAccounts = [];
let groups = [];

// Initialize options page
async function init() {
  try {
    await loadAccounts();
    await loadGroups();
    renderUI();
    setupEventListeners();
  } catch (error) {
    console.error('Error initializing options page:', error);
  }
}

// Load all accounts
async function loadAccounts() {
  try {
    allAccounts = await messenger.accounts.list();
    console.log('Loaded accounts:', allAccounts);
  } catch (error) {
    console.error('Error loading accounts:', error);
    allAccounts = [];
  }
}

// Load groups
async function loadGroups() {
  groups = await getGroups();
}

// Render entire UI
function renderUI() {
  renderAccounts();
  renderGroups();
}

// Render accounts list
function renderAccounts() {
  const container = document.getElementById('accountsList');
  const countBadge = document.getElementById('accountsCount');
  
  container.innerHTML = '';
  countBadge.textContent = allAccounts.length;
  
  // Get all grouped account IDs
  const groupedIds = new Set();
  groups.forEach(g => g.accountIds.forEach(id => groupedIds.add(id)));
  
  allAccounts.forEach(account => {
    const isGrouped = groupedIds.has(account.id);
    const element = createAccountElement(account, isGrouped);
    container.appendChild(element);
  });
}

// Create account element
function createAccountElement(account, isGrouped = false, showRemoveBtn = false) {
  const div = document.createElement('div');
  div.className = 'account-item';
  div.draggable = true;
  div.dataset.accountId = account.id;
  
  if (isGrouped && !showRemoveBtn) {
    div.style.opacity = '0.4';
    div.title = 'This account is already in a group';
  }
  
  // Determine icon
  let icon = '📧';
  if (account.type === 'imap') icon = '📨';
  else if (account.type === 'pop3') icon = '📬';
  else if (account.type === 'nntp') icon = '📰';
  
  div.innerHTML = `
    <div class="account-header">
      <span class="account-icon">${icon}</span>
      <div class="account-info">
        <div class="account-name">${escapeHtml(account.name)}</div>
        <div class="account-email">${account.identities && account.identities[0] ? escapeHtml(account.identities[0].email) : ''}</div>
      </div>
      <span class="drag-handle">⋮⋮</span>
    </div>
    ${showRemoveBtn ? '<button class="remove-from-group" title="Remove from group">×</button>' : ''}
  `;
  
  // Drag event handlers
  div.addEventListener('dragstart', handleDragStart);
  div.addEventListener('dragend', handleDragEnd);
  
  // Remove button handler
  if (showRemoveBtn) {
    const removeBtn = div.querySelector('.remove-from-group');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleRemoveFromGroup(account.id);
    });
  }
  
  return div;
}

// Render groups list
function renderGroups() {
  const container = document.getElementById('groupsList');
  const emptyMessage = document.getElementById('emptyGroupsMessage');
  
  container.innerHTML = '';
  
  if (groups.length === 0) {
    container.appendChild(emptyMessage);
    return;
  }
  
  groups.forEach(group => {
    const element = createGroupElement(group);
    container.appendChild(element);
  });
}

// Create group element
function createGroupElement(group) {
  const div = document.createElement('div');
  div.className = 'group-item';
  div.dataset.groupId = group.id;
  
  // Get accounts in this group
  const groupAccounts = allAccounts.filter(acc => group.accountIds.includes(acc.id));
  
  div.innerHTML = `
    <div class="group-header">
      <span class="group-icon">📁</span>
      <span class="group-name-display">${escapeHtml(group.name)}</span>
      <span class="group-account-count">${groupAccounts.length}</span>
      <div class="group-actions">
        <button class="icon-btn rename" title="Rename group">✏️</button>
        <button class="icon-btn delete" title="Delete group">🗑️</button>
      </div>
    </div>
    <div class="group-drop-zone ${groupAccounts.length === 0 ? 'empty' : ''}" data-group-id="${group.id}">
      ${groupAccounts.length === 0 ? '<span>Drop accounts here</span>' : ''}
    </div>
  `;
  
  // Render accounts in group
  const dropZone = div.querySelector('.group-drop-zone');
  groupAccounts.forEach(account => {
    const accountElement = createAccountElement(account, true, true);
    accountElement.draggable = false; // Don't allow dragging from groups
    const emptyMsg = dropZone.querySelector('span');
    if (emptyMsg) emptyMsg.remove();
    dropZone.classList.remove('empty');
    dropZone.appendChild(accountElement);
  });
  
  // Drop zone handlers
  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('drop', (e) => handleDrop(e, group.id));
  dropZone.addEventListener('dragleave', handleDragLeave);
  
  // Button handlers
  div.querySelector('.rename').addEventListener('click', () => handleRenameGroup(group.id));
  div.querySelector('.delete').addEventListener('click', () => handleDeleteGroup(group.id));
  
  return div;
}

// Drag and Drop Handlers
let draggedAccountId = null;

function handleDragStart(e) {
  draggedAccountId = e.currentTarget.dataset.accountId;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', draggedAccountId);
}

function handleDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  draggedAccountId = null;
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  
  const groupItem = e.currentTarget.closest('.group-item');
  if (groupItem) {
    groupItem.classList.add('drag-over');
  }
}

function handleDragLeave(e) {
  const groupItem = e.currentTarget.closest('.group-item');
  if (groupItem && !groupItem.contains(e.relatedTarget)) {
    groupItem.classList.remove('drag-over');
  }
}

async function handleDrop(e, groupId) {
  e.preventDefault();
  
  const groupItem = e.currentTarget.closest('.group-item');
  if (groupItem) {
    groupItem.classList.remove('drag-over');
  }
  
  if (!draggedAccountId) return;
  
  try {
    // Assign account to group
    await assignAccountToGroup(draggedAccountId, groupId);
    
    // Reload and re-render
    await loadGroups();
    renderUI();
  } catch (error) {
    console.error('Error assigning account to group:', error);
    alert('Failed to assign account to group');
  }
}

// Group Management Handlers
async function handleAddGroup() {
  const name = prompt('Enter a name for the new group:');
  if (!name || !name.trim()) return;
  
  try {
    await addGroup(name.trim());
    await loadGroups();
    renderUI();
  } catch (error) {
    console.error('Error adding group:', error);
    alert('Failed to create group');
  }
}

async function handleRenameGroup(groupId) {
  const group = groups.find(g => g.id === groupId);
  if (!group) return;
  
  const newName = prompt('Enter new name for the group:', group.name);
  if (!newName || !newName.trim() || newName === group.name) return;
  
  try {
    await updateGroup(groupId, { name: newName.trim() });
    await loadGroups();
    renderUI();
  } catch (error) {
    console.error('Error renaming group:', error);
    alert('Failed to rename group');
  }
}

async function handleDeleteGroup(groupId) {
  const group = groups.find(g => g.id === groupId);
  if (!group) return;
  
  const confirmed = confirm(`Delete the group "${group.name}"?\n\nAccounts in this group will be moved back to the ungrouped list.`);
  if (!confirmed) return;
  
  try {
    await deleteGroup(groupId);
    await loadGroups();
    renderUI();
  } catch (error) {
    console.error('Error deleting group:', error);
    alert('Failed to delete group');
  }
}

async function handleRemoveFromGroup(accountId) {
  try {
    await removeAccountFromGroup(accountId);
    await loadGroups();
    renderUI();
  } catch (error) {
    console.error('Error removing account from group:', error);
    alert('Failed to remove account from group');
  }
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('addGroupBtn').addEventListener('click', handleAddGroup);
}

// Utility: Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize on load
init();

