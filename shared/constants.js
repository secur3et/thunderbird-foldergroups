// Constants shared across the extension

const STORAGE_KEYS = {
  GROUPS: 'accountGroups',
  COLLAPSE_STATE: 'groupCollapseState'
};

const DEFAULT_UNGROUPED_NAME = 'Ungrouped Accounts';

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STORAGE_KEYS, DEFAULT_UNGROUPED_NAME };
}

