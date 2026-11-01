# Security policy

Security fixes target the latest version on the default branch. Older releases
and archived season data do not receive separate support.

Please do not report exploitable vulnerabilities in public issues. Use GitHub's
private vulnerability reporting if enabled:
https://github.com/MagiqueDeveloper/fortnite-sprites-checklist/security/advisories/new

If unavailable, use a private contact route listed on the maintainer's GitHub
profile. Include affected versions, reproduction steps, impact, and a proposed
fix if known. Do not include credentials, personal progress backups, or data
belonging to other people. There is no guaranteed response time or bounty.

The site is static and has no login or collection backend. Browser storage and
imported JSON are untrusted inputs. Do not embed credentials in source or the
built website. Dependency and roster updates should pass CI before merge.
