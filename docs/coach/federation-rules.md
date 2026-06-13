# Federation Rules — IPF/PI vs WRPF

Branching notes for coach review when athlete selects federation.

## Supported federations

| ID | Label | Phase 1 support |
|----|-------|-----------------|
| `ipf_pi` | IPF / Powerlifting India (PI) | Full |
| `wrpf` | WRPF India | Full |
| `other` | Other / Unaffiliated | Generic template — coach adapts |

## Key differences (review focus)

| Rule area | IPF/PI | WRPF |
|-----------|--------|------|
| Equipment | Strict raw (knee sleeves max) | Classic raw + wraps divisions |
| Squat depth | IPF standard | Federation-specific — confirm division |
| Bench | Pause command, feet flat | May vary by meet — confirm |
| Deadlift | Down command | Usually standard |
| Weight classes | IPF/PI classes | WRPF India classes |
| Drug testing | IPF protocol | WRPF protocol |

**Coach action:** If athlete selects WRPF, confirm wrap/classic division in coach notes.

## Template branching

Templates tagged with federation compatibility in program engine:

- Meet prep templates include federation-specific meet day notes
- WRPF templates may include higher bench frequency (wraps division)
- IPF/PI templates emphasize competition pause bench

If wrong template selected:
1. Note in review
2. Adjust exercises/loads manually
3. File bug if engine mis-routed

## Meet day notes (IPF/PI)

Standard coach notes should include:
- 3 attempt strategy suggestion based on training maxes
- Warm-up timing (45–60 min before flight)
- Commands reminder: start, press, rack
- Weigh-in timing (2h before for 24h weigh-in meets)

## Meet day notes (WRPF)

- Confirm division (classic vs equipped/wraps)
- Check specific meet promoter rules (India WRPF meets vary)
- Attempt selection may be more aggressive — coach judgment

## India-specific context

- PI vs legacy IPF recognition disputed since 2017 — use neutral "IPF/PI" wording publicly
- OpenPowerlifting data: verify athlete's actual federation history if provided
- Warehouse gym meets vs sanctioned — adjust peaking if mock meet vs official

## Exercise selection cautions

| Exercise | IPF/PI | WRPF |
|----------|--------|------|
| Monolift squat | OK in training | OK |
| Tempo bench | OK | OK |
| Block pulls | OK | OK |
| Excessive arch coaching | Legal but note rules | Similar |

## When federation = Other

- Ask athlete for specific meet rules in follow-up email if unclear
- Default to conservative IPF-style programming
- Document assumptions in coach notes

## Related

- [review-sop.md](review-sop.md)
- [template-guide.md](template-guide.md)
- [../product/personas.md](../product/personas.md)
