# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in Account Folder Manager, please report it responsibly.

**Please DO NOT open a public issue for security vulnerabilities.**

Instead, please email the details to: secur3_et@secur3-et.co.uk

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

I will respond as quickly as possible and work to address the issue.

## Security Measures

This extension implements several security measures:

### Input Sanitization

All user input is properly escaped before being displayed in the UI to prevent Cross-Site Scripting (XSS) attacks.

```javascript
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

### Secure Storage

- Uses Thunderbird's official `storage.local` API
- No use of `eval()` or similar dangerous functions
- No inline scripts or styles
- No external resources loaded

### Minimal Permissions

The extension only requests permissions that are absolutely necessary:

- `accountsRead` - Read account information
- `accountsFolders` - Access folder structure
- `messagesRead` - Display email messages
- `storage` - Save group configurations

### No External Communication

- No data is sent to external servers
- No analytics or tracking
- All processing happens locally
- No third-party dependencies

### Code Review

All code is:
- Open source and publicly auditable
- Written in vanilla JavaScript (no minification/obfuscation)
- Reviewed for security issues
- Tested for common vulnerabilities

## Best Practices for Users

- Download only from official sources
- Keep Thunderbird updated to the latest version
- Review permissions when installing
- Report suspicious behavior

## Scope

This security policy applies to:
- Latest version of the extension
- Supported Thunderbird versions (91.0+)

## Contact

For security-related questions or concerns, please contact: secur3_et@secur3-et.co.uk
---

Last updated: November 2025

