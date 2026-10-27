# Project rules
- Keep birth-town lookup bundled and lazy-loaded with GeoNames attribution, so the birth chart works offline without exposing personal birth details to a search API.
- Resolve birth-local time with IANA historical time-zone rules before astronomical math; reject ambiguous DST times rather than silently guessing.
- Compute Rising from UTC sidereal time and geographic coordinates; preserve a clearly labelled approximate fallback only for legacy callers without a location.
- Use bundled Cormorant Garamond and Cinzel fonts rather than remote font imports to preserve offline reading typography.