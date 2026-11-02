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

## Results improvements (November 2026)

The Results page can export transparent, machine-readable **CSV and JSON**
reports with the selected level of every lever, total normalised policy score,
illustrative residual, model disclaimer, and an optional saved comparison.
The new "Biggest remaining score opportunities" section ranks the top three
levers by extra **index points** they would earn at level 4. It does not
estimate feasibility, cost, or real-world abatement.

Regression tests live in `app/tests/calculations.test.cjs`. Run
`npm test`, `npm run lint`, and `npm run build` from `app/`.
The model tests exercise endpoint scores, URL validation, sector accounting,
scenario exports, opportunities and the historical projection anchor. They
do not substitute for a browser/production smoke test.

Security note: dependency issues reported by `npm audit` should be triaged
against the lockfile with patched versions that do not disrupt the build;
`npm audit fix --force` has not been run.

## Immersive landscape and redesigned controls (November 2026)

The main page now uses a **full-viewport** responsive animated landscape, with
a dark-glass policy dock overlay. The dock can be hidden to explore the scene
without obstruction, then reopened using the bottom button. The scene keeps
existing live connections between the 15 policy levers and animated assets
(traffic, freight, turbines, solar, forestry, CCS and more).

Mobile layouts make the scenery horizontally pannable so its details remain
visible rather than scaling the world to a tiny strip. The floating dock is
horizontally scrollable by lever group, with **native range inputs** and a
separate button to open details for each policy lever.

The SVG includes weathered atmospheric gradients, depth shadows, distant
hills, mist, and subtle lighting. Motion respects prefers-reduced-motion.

The score meter represents **only** the illustrative policy index. Neither
the visual effects nor score should be interpreted as a scientifically validated
UK emissions forecast. Existing Results, presets and comparison workflows remain.

Manual acceptance checklist: desktop full viewport with dock visible/collapsed;
mobile horizontal scenery pan and lever scroll; all 15 slider selections;
open a lever detail modal; apply presets; save/clear comparison; Results;
theme, sound, and reduced motion. No full live-browser acceptance run is
recorded in the connector environment.

## Foreground visibility with the controls expanded

The policy dock is measured using `ResizeObserver` whenever it is open.
The animated scene's available lower boundary automatically reserves the
actual dock height plus a 32px visual gap rather than relying on fixed
breakpoints. Its SVG uses bottom-aligned `xMidYMax slice` framing with the
dock open to keep the road and railway in view; after collapsing the dock,
the full-viewport centred framing returns. A full-page scenic gradient
continues behind the dock and prevents hard blank strips.

Verify visually at desktop, laptop, mobile portrait, landscape and browser
zoom with the dock open and closed. No CSS transform is applied directly to
the animated SVG objects, so Framer Motion animations retain their intended
coordinate space.

## Adaptive panoramic camera correction

The previous bottom-aligned `slice` view cropped the sky and turbine blades
when the lever dock opened. The canvas now measures its rendered aspect ratio
using `ResizeObserver` and widens the SVG viewBox while keeping the full
700 world-coordinate height. This retains the complete vertical composition
at wide aspect ratios without shrinking it into a narrow centre column.

Sky, distant hills and ground layers extend beyond the original 1200-unit
artwork width for seamless panoramic framing. Decorative distant vegetation
fills the additional side regions. With the dock open, a gentle 40px
mask blends the bottom of the animation into the full-viewport background.
The control dock still reserves its measured height, and closing the dock
restores the unobstructed scene. No policy calculation or animation behaviour
was changed by this layout update.

## Scene realism pass — 2 November 2026

The lightweight SVG animation now includes tapered wind turbine blades, slower
rotation, volumetric gradient clouds without moving blur filters, depth-shaded
asphalt, more realistic river colours and banks, steel rails and sleepers,
factory shading, slower industrial plumes and shaded conifers.

All 15 policy inputs remain wired to the original animated scene; the
existing full-screen/dock framing and reduced-motion support remain.
Visual realism is artistic, **not** an energy-generation or emissions model.
A full production build and visual/browser acceptance are still required.

## Visible, upgraded railway foreground (November 2026)

The railway is now an isolated `RailwayScene` component. The original
tiny/fading train SVG blocks were replaced with two independent always-visible
services on distinct rear/passenger and foreground/freight tracks. The rolling
stock is larger and more detailed (windows, bodywork, underframe, headlights,
bogies, wheelsets, pantographs where appropriate), with gentle shunting-style
motion instead of repeatedly fading out.

Two rail lines have clearer steel railheads, closely spaced timber sleepers,
textured ballast, signals and a crossing barrier. The Heavy Vehicles lever
retains diesel/electric/hydrogen visual logic; freight load selection still
follows the existing cross-sector cargo policy. The SVG remains lightweight,
runs inside the original reduced-motion MotionConfig and does not alter the
educational calculation formula.

Acceptance checks: the trains remain visible on initial display and as the
animation loops, the dock-open camera shows the full railway, Heavy Vehicles
levels 1-4 change rolling stock, other cargo levers update the freight,
all 15 levers continue to respond, and reduced-motion mode shows still trains.
Live browser acceptance is not yet independently verified.

## Train visibility and perceptible motion fix

Both trains are now 1.43× and 1.49× their earlier sizes, with brighter
orange/blue/green liveries, lighter ballast, brighter railheads and fewer
sleepers. Opposing trains shuttle over 235–390 scene units on 15–19 second
loops instead of the barely perceptible 44–51 second motion. Travel ranges
account for the longer train at Heavy Vehicles 3–4. The reduced-motion
preference, rail signals, level crossing and policy-specific freight loads
are preserved. Motion is illustrative, not a railway timetable.
