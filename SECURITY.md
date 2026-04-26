# Security Policy

## Supported Versions

Security updates are currently provided only for the latest active version of this project.

| Version | Supported |
| ------- | --------- |
| 1.0.x   | Yes       |
| < 1.0   | No        |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please do not report it publicly through GitHub Issues, pull requests, comments, or social media.

Please report security concerns privately to the project owner or the authorized Tatweer Logistics Services contact.

When reporting a vulnerability, include as much detail as possible:

- A clear description of the issue
- The affected page, feature, or endpoint
- Steps to reproduce the issue
- Any proof of concept, screenshots, or request details
- The possible impact if the issue is exploited

## Response Expectations

Security reports will be reviewed privately and handled as quickly as possible.

If the report is accepted as a valid security issue:

- The issue will be investigated
- A fix will be prepared and tested
- The vulnerability may be disclosed only after the fix is ready, if disclosure is appropriate

If the report is determined not to be a security issue, or if there is not enough information to reproduce it, additional clarification may be requested.

## Confidentiality

Please keep vulnerability details confidential until the issue has been reviewed and resolved.

Public disclosure before a fix is available may put users, shipment data, or operational systems at risk.

## Admin Password Hash

Production should use `ADMIN_PASSWORD_HASH` instead of storing `ADMIN_PASSWORD` as plain text.

Generate a hash with:

```sh
npm run admin:hash -- "your-strong-admin-password"
```

Set the output as `ADMIN_PASSWORD_HASH`, then leave `ADMIN_PASSWORD` empty.
