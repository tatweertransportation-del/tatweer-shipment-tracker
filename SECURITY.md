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

## Copy Protection

The server supports a runtime host/license lock to make copied deployments fail outside approved hosts.

Set these environment variables in production:

- `APP_COPY_PROTECTION=required`
- `APP_ALLOWED_HOSTS=example.com,www.example.com`
- `APP_LICENSE_SECRET=<private random secret>`
- `APP_LICENSE_KEY=<generated key>`
- `APP_ALLOW_LOCALHOST=false`

Generate the license key with:

```sh
npm run license:key -- "<private random secret>" example.com www.example.com
```

The generated key is tied to the sorted `APP_ALLOWED_HOSTS` list. If the host list changes, generate a new key.

This protects runtime use, not physical file access. Anyone with full access to source files and production secrets can still copy or modify the application, so production secrets should stay outside the repository and server access should be limited.
