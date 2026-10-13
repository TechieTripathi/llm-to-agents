# Research sources for the browser demonstration (slide 58)

**Question:** What should a workplace password policy require today: minimum length, complexity rules and scheduled expiry?

These are real, public sources. Each URL was opened and the quotes below were checked against the live page on **13 October 2026**. Re-check them on the day: pages move, and status changes (one of these sources was withdrawn in 2025 and another is marked archived).

## Primary source (use this as the authority)

### NIST SP 800-63B-4, Digital Identity Guidelines: Authentication and Authenticator Management
- Publisher: National Institute of Standards and Technology (US). Type: standard.
- Status: **final**, July 2025 (document history: "07/31/25: SP 800-63B-4 (Final)").
- Readable HTML: https://pages.nist.gov/800-63-4/sp800-63b.html (section 3.1.1.2, Password Verifiers)
- DOI: https://doi.org/10.6028/NIST.SP.800-63b-4 · Publication page: https://csrc.nist.gov/pubs/sp/800/63/b/4/final
- Verbatim, §3.1.1.2:
  - "Verifiers and CSPs SHALL require passwords that are used as a single-factor authentication mechanism to be a minimum of 15 characters in length."
  - "Verifiers and CSPs MAY allow passwords that are only used as part of multi-factor authentication processes to be shorter but SHALL require them to be a minimum of eight characters in length."
  - "Verifiers and CSPs SHOULD permit a maximum password length of at least 64 characters."
  - "Verifiers and CSPs SHALL NOT impose other composition rules (e.g., requiring mixtures of different character types) for passwords."
  - "Verifiers and CSPs SHALL NOT require subscribers to change passwords periodically. However, verifiers SHALL force a change if there is evidence that the authenticator has been compromised."
  - "verifiers SHALL compare the prospective secret against a blocklist that contains known commonly used, expected, or compromised passwords."
  - "Verifiers SHALL allow the use of password managers and autofill functionality."

## The stale source (what older answers are built on)

### NIST SP 800-63B (June 2017, includes updates as of 2 March 2020)
- Status: **withdrawn 1 August 2025**, superseded by SP 800-63B-4.
- https://csrc.nist.gov/pubs/sp/800/63/b/upd2/final · HTML: https://pages.nist.gov/800-63-3/sp800-63b.html
- Verbatim, §5.1.1.1: "Memorized secrets SHALL be at least 8 characters in length if chosen by the subscriber."
- Note: the 2017 text said composition rules and periodic changes "SHOULD NOT" be required; the 2025 text says "SHALL NOT". An answer that says "minimum 8 characters" is quoting the withdrawn version.

## Corroborating government guidance

### NCSC (UK), Password policy: updating your approach
- Part of "Password administration for system owners". Version 1.0, reviewed 19 November 2018.
- https://www.ncsc.gov.uk/collection/passwords/updating-your-approach
- Verbatim:
  - "Regular password changing harms rather than improves security."
  - "the NCSC do not recommend the use of complexity requirements when implementing user generated passwords."
  - "you should specify a minimum password length, to prevent very short passwords from being used." (no number is given)
  - "employ a password deny list that prevents the most common (and therefore easily guessed) passwords being used."
  - "The NCSC recommend the use of password managers for secure storage wherever appropriate."
  - "Users must change their passwords when you know (or suspect) it has been compromised."

### CISA (US), Use Strong Passwords (Secure Our World)
- https://www.cisa.gov/secure-our-world/use-strong-passwords
- Status: the page carries an **"Archived Content"** notice ("…the archive contains outdated information that may not reflect current policy or programs."). Undated.
- Audience: advice to individuals, not rules for systems.
- Verbatim: "At least 16 characters—longer is stronger!"; passphrase "a memorable phrase of 4 – 7 unrelated words"; "Rather than write them down, use a password manager!"
- Not addressed on the page: scheduled expiry, blocklists.

## How the sources compare

| Topic | NIST 2025 | NCSC | CISA |
|---|---|---|---|
| Minimum length | 15; 8 if part of MFA | Set a minimum; no number | At least 16 |
| Composition rules | Must not be imposed | Not recommended | Suggests a random mix or a 4–7 word passphrase |
| Scheduled expiry | Must not be required | Harms security | Not addressed |
| Blocklist | Required | Use a deny list | Not addressed |
| Password managers | Must be allowed | Recommended | Use one |

15 (NIST) and 16 (CISA) are not a contradiction: NIST sets the minimum a system must enforce; CISA advises individuals what to choose.

## Verified brief (what the demo ends with)

- Minimum 15 characters for passwords used alone; 8 when part of multi-factor sign-in. [NIST SP 800-63B-4 §3.1.1.2]
- No composition rules and no scheduled expiry; force a change on evidence of compromise. [NIST SP 800-63B-4 §3.1.1.2]
- Check new passwords against a blocklist, and allow password managers. [NIST SP 800-63B-4 §3.1.1.2; NCSC]
