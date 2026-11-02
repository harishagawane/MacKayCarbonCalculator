# Model limitations and scoring

This is an **independent educational calculator** and does not implement the
scientific energy-system model behind the official UK MacKay Calculator:
https://www.gov.uk/guidance/carbon-calculator

The 15 fixed lever weights sum to 113 at all level 4. The illustrative score is
now `100 * (sum of selected weights / 113)`. The previous simple cap at 100
caused saturation and unreconciled sector charts. All category shares use the
same normalisation and reconcile to the headline index.

Displayed residual emissions `800 * (1 - score/100)` MtCO₂e are illustrative
only, not an emissions forecast, a carbon-budget assessment, or evidence of
achieving net zero. Energy figures also use simplified, unverified coefficients.

The historical series consists of rounded points. 2024 final ~373 MtCO₂e and
2025 provisional ~367 MtCO₂e exclude international aviation/shipping; official
statistical revisions may change the values. Projections now interpolate from
the 2025 published estimate to the illustrative 2050 model endpoint.
References:
- https://www.gov.uk/government/collections/uk-territorial-greenhouse-gas-emissions-statistics
- https://www.gov.uk/government/statistics/provisional-uk-greenhouse-gas-emissions-statistics-2025

Scenario URL input must be exactly 15 digits (1-4); corrupt localStorage
is ignored, and updates preserve other query parameters and the URL fragment.
Vite preview limits allowed hostnames; customise with VITE_ALLOWED_HOSTS.

Run `npm ci && npm run build && npm run lint` in app/ to validate with
the full dependency tree. A local npm build was not run in the connector
execution environment.
