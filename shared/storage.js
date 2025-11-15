// Storage operations for managing account groups

/**
 * Get all groups from storage
 * @returns {Promise<Array>} Array of group objects
 */
async function getGroups() {
  try {
    const result = await messenger.storage.local.get('accountGroups');
    return result.accountGroups || [];
  } catch (error) {
    console.error('Error getting groups:', error);
    return [];
  }
}

/**
 * Save groups to storage
 * @param {Array} groups - Array of group objects
 * @returns {Promise<void>}
 */
async function saveGroups(groups) {
  try {
    await messenger.storage.local.set({ accountGroups: groups });
  } catch (error) {
    console.error('Error saving groups:', error);
    throw error;
  }
}

/**
 * Add a new group
 * @param {string} name - Name of the group
 * @returns {Promise<Object>} The created group object
 */
async function addGroup(name) {
  const groups = await getGroups();
  const newGroup = {
    id: `group_${Date.now()}`,
    name: name,
    accountIds: []
  };
  groups.push(newGroup);
  await saveGroups(groups);
  return newGroup;
}

/**
 * Update a group
 * @param {string} id - Group ID
 * @param {Object} updates - Object with properties to update (name, accountIds)
 * @returns {Promise<Object|null>} Updated group or null if not found
 */
async function updateGroup(id, updates) {
  const groups = await getGroups();
  const groupIndex = groups.findIndex(g => g.id === id);
  
  if (groupIndex === -1) {
    return null;
  }
  
  groups[groupIndex] = { ...groups[groupIndex], ...updates };
  await saveGroups(groups);
  return groups[groupIndex];
}

/**
 * Delete a group
 * @param {string} id - Group ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
async function deleteGroup(id) {
  const groups = await getGroups();
  const initialLength = groups.length;
  const filteredGroups = groups.filter(g => g.id !== id);
  
  if (filteredGroups.length === initialLength) {
    return false; // Group not found
  }
  
  await saveGroups(filteredGroups);
  return true;
}

/**
 * Assign an account to a group
 * @param {string} accountId - Account ID
 * @param {string} groupId - Group ID
 * @returns {Promise<boolean>} True if successful
 */
async function assignAccountToGroup(accountId, groupId) {
  const groups = await getGroups();
  
  // First, remove account from any existing group
  groups.forEach(group => {
    group.accountIds = group.accountIds.filter(id => id !== accountId);
  });
  
  // Then add to the target group
  const targetGroup = groups.find(g => g.id === groupId);
  if (!targetGroup) {
    return false;
  }
  
  if (!targetGroup.accountIds.includes(accountId)) {
    targetGroup.accountIds.push(accountId);
  }
  
  await saveGroups(groups);
  return true;
}

/**
 * Remove an account from all groups
 * @param {string} accountId - Account ID
 * @returns {Promise<void>}
 */
async function removeAccountFromGroup(accountId) {
  const groups = await getGroups();
  
  groups.forEach(group => {
    group.accountIds = group.accountIds.filter(id => id !== accountId);
  });
  
  await saveGroups(groups);
}

/**
 * Get collapse state for groups
 * @returns {Promise<Object>} Object mapping group IDs to collapse state (true = collapsed)
 */
async function getCollapseState() {
  try {
    const result = await messenger.storage.local.get('groupCollapseState');
    return result.groupCollapseState || {};
  } catch (error) {
    console.error('Error getting collapse state:', error);
    return {};
  }
}

/**
 * Save collapse state for a group
 * @param {string} groupId - Group ID
 * @param {boolean} collapsed - Whether the group is collapsed
 * @returns {Promise<void>}
 */
async function setCollapseState(groupId, collapsed) {
  try {
    const state = await getCollapseState();
    state[groupId] = collapsed;
    await messenger.storage.local.set({ groupCollapseState: state });
  } catch (error) {
    console.error('Error setting collapse state:', error);
  }
}

/**
 * Clean up storage by removing accounts that no longer exist
 * @param {Array} validAccountIds - Array of valid account IDs
 * @returns {Promise<void>}
 */
async function cleanupDeletedAccounts(validAccountIds) {
  const groups = await getGroups();
  let modified = false;
  
  groups.forEach(group => {
    const originalLength = group.accountIds.length;
    group.accountIds = group.accountIds.filter(id => validAccountIds.includes(id));
    if (group.accountIds.length !== originalLength) {
      modified = true;
    }
  });
  
  if (modified) {
    await saveGroups(groups);
  }
}

