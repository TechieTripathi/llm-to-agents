import type { Ref } from './types'

// Section 7 (practical demonstrations). Every URL opened and checked on 2026-10-13.
export const refs: Ref[] = [
  {
    key: 's7nist2025sp80063b4',
    authors: 'Temoshok, D., Fenton, J., Choong, Y.-Y., Lefkovitz, N., Regenscheid, A., Galluzzo, R., Richer, J. (NIST)',
    year: 2025,
    title: 'Digital Identity Guidelines: Authentication and Authenticator Management, NIST SP 800-63B-4',
    venue: 'National Institute of Standards and Technology (final, July 2025)',
    url: 'https://doi.org/10.6028/NIST.SP.800-63b-4',
    accessed: '2026-10-13',
    supports: '§3.1.1.2: passwords ≥15 characters when single-factor (≥8 with MFA); no composition rules; no periodic change; blocklist; password managers allowed',
  },
  {
    key: 's7nist2017sp80063b',
    authors: 'Grassi, P. A., Newton, E. M., Fenton, J. L., Perlner, R. A., Regenscheid, A. R., Burr, W. E., Richer, J. P. et al. (NIST)',
    year: 2017,
    title: 'Digital Identity Guidelines: Authentication and Lifecycle Management, NIST SP 800-63B (includes updates as of 2 March 2020)',
    venue: 'National Institute of Standards and Technology; withdrawn 1 August 2025, superseded by SP 800-63B-4',
    url: 'https://csrc.nist.gov/pubs/sp/800/63/b/upd2/final',
    accessed: '2026-10-13',
    supports: 'Earlier rule of an 8-character minimum for subscriber-chosen secrets; withdrawn status',
  },
  {
    key: 's7ncsc2018passwords',
    authors: 'National Cyber Security Centre (UK)',
    year: 2018,
    title: 'Password policy: updating your approach (Password administration for system owners)',
    venue: 'NCSC guidance, version 1.0, reviewed 19 November 2018',
    url: 'https://www.ncsc.gov.uk/collection/passwords/updating-your-approach',
    accessed: '2026-10-13',
    supports: 'No complexity requirements; regular password changing harms security; deny lists; password managers',
  },
  {
    key: 's7cisapasswords',
    authors: 'Cybersecurity and Infrastructure Security Agency (US)',
    year: 'n.d.',
    title: 'Use Strong Passwords (Secure Our World)',
    venue: 'CISA; page marked “Archived Content” when checked',
    url: 'https://www.cisa.gov/secure-our-world/use-strong-passwords',
    accessed: '2026-10-13',
    supports: 'Advice to individuals: at least 16 characters; passphrases; password managers',
  },
]
