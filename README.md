# Account Folder Manager for Thunderbird

A modern Thunderbird extension that helps you organize email accounts into custom groups with a tab-based interface and email viewing capabilities.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Thunderbird](https://img.shields.io/badge/thunderbird-91%2B-orange.svg)

## 🚀 Quick Start

### Installation

1. **Download or Clone**
   ```bash
   git clone https://github.com/secur3-et/thunderbird-foldergroups.git
   ```

2. **Open Thunderbird**
   - Press `Ctrl+Shift+A` (or `Cmd+Shift+A` on Mac) to open Add-ons
   - Click the ⚙️ gear icon → **Debug Add-ons**
   - Click **Load Temporary Add-on**
   - Browse to the extension folder and select `manifest.json`

3. **Done!** Look for the **Account Groups** button in your Thunderbird toolbar

### How to Use

1. **Open the Extension**
   - Click the **Account Groups** button in the Thunderbird toolbar
   - A new tab opens with a two-pane interface

2. **Create Your First Group**
   - Click the **⚙️ Settings** icon in the top-left
   - Click **+ Add Group** 
   - Name it (e.g., "Work", "Personal", "Projects")

3. **Add Accounts to Groups**
   - Drag any account from the left panel
   - Drop it onto a group on the right panel
   - That's it! The account is now organized

4. **View Your Emails**
   - Go back to the main tab (close settings)
   - Click any account in the left panel
   - Emails from that account load on the right
   - Click any email to open it

5. **Toggle Night Mode**
   - Click the **🌙** moon icon for dark theme
   - Click the **☀️** sun icon to switch back

## ✨ Features

- 📁 **Custom Account Groups** - Organize your email accounts into categories like "Work", "Personal", "Projects", etc.
- 🖱️ **Drag-and-Drop Management** - Easy-to-use interface for moving accounts between groups
- 📧 **Integrated Email Viewer** - Two-pane layout showing account groups on the left and emails on the right
- 🌙 **Night Mode** - Dark theme with smooth transitions
- 🔄 **Collapsible Groups** - Save space by collapsing groups you're not using
- 💾 **Auto-Save** - All changes are automatically saved and persist across sessions
- 🎨 **Modern UI** - Clean, casual design with smooth animations

## 📸 Screenshots

> Add screenshots here showing light mode, dark mode, and the main interface

## 📦 Detailed Installation

### From Add-ons Store (Coming Soon)
The extension will be available on the Thunderbird Add-ons website.

### From Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/secur3-et/thunderbird-foldergroups.git
   cd thunderbird-foldergroups
   ```

2. **Load in Thunderbird**
   - Open Thunderbird
   - Go to **Tools** → **Add-ons and Themes** (Ctrl+Shift+A)
   - Click the gear icon ⚙️ → **Debug Add-ons**
   - Click **Load Temporary Add-on**
   - Navigate to the extension folder and select `manifest.json`

### Installation Steps

1. **Download the Extension**
   
   **Option A: Using Git**
   ```bash
   git clone https://github.com/secur3-et/thunderbird-foldergroups.git
   cd thunderbird-foldergroups
   ```
   
   **Option B: Download ZIP**
   - Go to https://github.com/secur3-et/thunderbird-foldergroups
   - Click the green **Code** button → **Download ZIP**
   - Extract the ZIP file to a folder

2. **Install in Thunderbird**
   - Open Thunderbird
   - Go to **Tools** → **Add-ons and Themes** (or press `Ctrl+Shift+A`)
   - Click the **gear icon ⚙️** → **Debug Add-ons**
   - Click **Load Temporary Add-on**
   - Navigate to the extension folder
   - Select the `manifest.json` file
   - Click **Open**

3. **Verify Installation**
   - You should see "Account Folder Manager" listed under Temporary Extensions
   - Look for the **Account Groups** button in your Thunderbird toolbar (usually top-right)

### Note
This is a temporary installation for development/testing. The extension will remain active until you restart Thunderbird. To make it permanent, you'll need to reinstall it each time, or wait for it to be published on the Thunderbird Add-ons store.

## 📖 Complete Usage Guide

### Getting Started

#### Step 1: Open the Extension

1. Click the **Account Groups** button in the Thunderbird toolbar
2. A new tab opens with two panels:
   - **Left Panel**: Your account groups and accounts
   - **Right Panel**: Email viewer (initially shows a welcome message)

#### Step 2: Create Account Groups

1. Click the **⚙️ Settings** icon in the extension header (top-left)
2. This opens the Group Manager with:
   - **Left side**: All your Thunderbird accounts
   - **Right side**: Your groups (initially empty)
3. Click **+ Add Group** button
4. Enter a name (e.g., "Work", "Personal", "Side Projects")
5. Click OK or press Enter

**Pro Tip**: Create groups based on how you organize your life:
- Work vs Personal
- By project or client
- By importance or frequency

#### Step 3: Organize Your Accounts

1. In the Group Manager (settings page):
   - Find an account on the left side
   - Click and hold on the account
   - Drag it to a group on the right side
   - Release to drop it into the group
2. Repeat for all accounts you want to organize
3. Accounts without a group stay in "Ungrouped"

**Example**:
- Drag "work@company.com" → "Work" group
- Drag "personal@gmail.com" → "Personal" group
- Drag "project@client.com" → "Projects" group

#### Step 4: View Your Organized Accounts

1. Close the settings page (or click the Account Groups tab)
2. You'll see your groups in the left panel:
   - 📁 Work (2 accounts)
   - 📁 Personal (1 account)
   - 📁 Projects (3 accounts)
3. Click any group name to collapse/expand it
4. Click any account to view its emails

#### Step 5: Browse Emails

1. Click on any account in the left panel
2. The account's Inbox emails appear in the right panel
3. You'll see:
   - Sender name
   - Subject
   - Date and time
   - Unread emails have a green bar on the left
4. Click any email to open it in a new tab

#### Step 6: Customize Your Experience

**Night Mode**:
- Click the **🌙** moon icon (top-left) to enable dark theme
- Click again (now a **☀️** sun icon) to go back to light mode
- Your preference is saved automatically

**Collapse Groups**:
- Click any group header to collapse it (hide accounts)
- Click again to expand
- Useful for focusing on specific groups

### Managing Groups

#### Rename a Group

1. Open Settings (⚙️ icon)
2. Find the group on the right side
3. Click the **✏️** pencil icon next to the group name
4. Enter the new name
5. Click OK

#### Delete a Group

1. Open Settings (⚙️ icon)
2. Find the group on the right side  
3. Click the **🗑️** trash icon
4. Confirm deletion
5. Accounts in that group move back to "Ungrouped"

#### Remove an Account from a Group

1. Open Settings (⚙️ icon)
2. Find the account inside a group (right side)
3. Hover over the account
4. Click the **×** button that appears
5. The account moves back to the left side (ungrouped)

#### Move an Account Between Groups

1. Open Settings (⚙️ icon)
2. Remove the account from its current group (click **×**)
3. Drag it from the left side to a different group
4. Or just drag it directly from one group to another

### Tips & Tricks

- **Keyboard Navigation**: Use Tab and Enter to navigate the interface
- **Multiple Tabs**: You can open multiple Account Groups tabs at once
- **Quick Access**: The toolbar button works from anywhere in Thunderbird
- **Persistent**: All your settings save automatically - no save button needed!
- **Safe to Experiment**: Deleting groups doesn't delete accounts or emails
- **Clean Layout**: Collapse groups you don't use often to reduce clutter

## 📋 Common Workflows

### Workflow 1: Daily Email Check
1. Open Account Groups tab
2. Check "Work" group accounts first
3. Check "Personal" group accounts next
4. Collapsed "Projects" group (check later)

### Workflow 2: Project-Based Organization
1. Create groups for each client/project
2. Add related email accounts to each
3. Focus on one project at a time

### Workflow 3: Importance-Based
1. Create groups: "High Priority", "Normal", "Low Priority"
2. Sort accounts by how often you check them
3. Keep high priority expanded, others collapsed

## ❓ FAQ

**Q: Will this delete my emails?**
A: No! This extension only organizes how you VIEW your accounts. It doesn't touch your actual emails or account settings.

**Q: Can I put one account in multiple groups?**
A: No, each account can only be in one group at a time. This keeps organization simple and clear.

**Q: What happens if I delete Thunderbird account?**
A: The extension automatically detects this and removes it from your groups. No action needed.

**Q: Can I see folders other than Inbox?**
A: Currently, the extension shows Inbox by default. Support for other folders is planned for future versions.

**Q: Is my data synced across devices?**
A: No, groups are stored locally in each Thunderbird installation. Each device has its own organization.

**Q: Does this work with all account types?**
A: Yes! Works with IMAP, POP3, NNTP, and other Thunderbird account types.

## 🚀 Getting Started Checklist

- [ ] Install the extension in Thunderbird
- [ ] Click the Account Groups toolbar button
- [ ] Create your first group
- [ ] Drag an account into the group
- [ ] Click the account to view its emails
- [ ] Try night mode (🌙 icon)
- [ ] Collapse/expand a group
- [ ] Restart Thunderbird to verify everything persists

## 📖 Usage Summary

> See the **Complete Usage Guide** section above for detailed step-by-step instructions.

### Quick Reference

## 🔒 Security & Privacy

- ✅ **No External Servers** - All data stays local on your computer
- ✅ **No Data Collection** - No tracking or data transmission of any kind
- ✅ **Minimal Permissions** - Only requests necessary Thunderbird API permissions
- ✅ **Open Source** - Full source code available for review
- ✅ **Input Sanitization** - All user input is properly escaped to prevent XSS
- ✅ **Secure Storage** - Uses Thunderbird's built-in storage API

### Permissions Explained

- `accountsRead` - Required to list and access your email accounts
- `accountsFolders` - Required to access folder information and display emails
- `messagesRead` - Required to list and display email messages
- `storage` - Required to save your group configurations

## 🛠️ Development

### Project Structure

```
thunderbird-foldergroups/
├── manifest.json          # Extension configuration
├── background.js          # Background script (toolbar button, cleanup)
├── tab-view/              # Main tab interface
│   ├── tab-view.html
│   ├── tab-view.js
│   └── tab-view.css
├── options/               # Options/settings page
│   ├── options.html
│   ├── options.js
│   └── options.css
├── shared/                # Shared utilities
│   ├── storage.js         # Storage operations
│   └── constants.js
└── icons/                 # Extension icons
```

### Technology Stack

- **Pure JavaScript** (ES6+) - No frameworks or dependencies
- **HTML5 & CSS3** - Modern web standards
- **Thunderbird MailExtensions API** - Built on WebExtensions
- **Local Storage API** - For persistent configuration

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Extension doesn't load
- Ensure you're running Thunderbird 91.0 or later
- Check the Browser Console (Ctrl+Shift+J) for error messages
- Try reloading the extension from the Debug Add-ons page

### Accounts not showing
- Verify you have email accounts configured in Thunderbird
- Check that the extension has the necessary permissions
- Try closing and reopening the extension tab

### Emails not loading
- Ensure your account has an Inbox folder
- Check your internet connection (for IMAP accounts)
- Look for errors in the Browser Console

### Groups not persisting
- Verify Thunderbird can write to its profile directory
- Check that you're not in Private Browsing mode
- Try restarting Thunderbird

## 📋 Roadmap

Potential future enhancements:

- [ ] Search/filter functionality for accounts and emails
- [ ] Keyboard shortcuts for quick navigation
- [ ] Group colors and custom icons
- [ ] Import/export group configurations
- [ ] Multiple folder views per account (not just Inbox)
- [ ] Unread count badges on accounts
- [ ] Context menu integration
- [ ] Email preview pane

## 🙏 Acknowledgments

- Built with ❤️ using Thunderbird's MailExtensions API
- Inspired by the need for better account organization in Thunderbird
- Icons generated using ImageMagick

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**secur3-et**

- GitHub: [@secur3-et](https://github.com/secur3-et)

## 🌟 Support

If you find this extension useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs or requesting features via GitHub Issues
- 🤝 Contributing code or documentation improvements
- 📢 Sharing with others who might find it useful

---

**Made with ☕, ✨ and 💻**
