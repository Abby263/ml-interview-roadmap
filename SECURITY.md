# Security Policy

## Supported Version

Security fixes target the `main` branch.

## Reporting a Vulnerability

Do not open a public issue for secrets, authentication bypasses, data exposure,
or AI Tutor memory/session vulnerabilities.

Report security concerns privately through GitHub Security Advisories when
available, or contact the maintainers through the repository with a minimal
non-public reproduction.

Please include:

- affected route, component, or workflow;
- impact;
- reproduction steps;
- relevant logs or screenshots with secrets removed;
- suggested fix, if known.

## Scope

In scope:

- authentication and authorization issues;
- Supabase row or service-role data exposure;
- leaked environment variables;
- unsafe AI Tutor transcript or memory handling;
- dependency vulnerabilities with practical exploitability.

Out of scope:

- generic prompt injection examples without data exposure or privilege impact;
- denial-of-service reports without a concrete exploit path;
- issues that require already-compromised credentials.
