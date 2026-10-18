# Employer Apprenticeships: campaign landing page (interview prototype)

An employer-facing landing page for a degree-connected apprenticeship program, with a working cost calculator, an optional ROI scenario tool, a demo-mode inquiry form, and a simulated analytics layer.

> **Independent interview prototype.** Illustrative content only; not an official Northeastern University website. No logos, endorsements, statistics, or testimonials are used. The form sends nothing, and no analytics service is connected.

## Run it

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # http://localhost:5173  (analytics panel visible in dev)
npm test           # unit tests for calculator math, validation, and analytics
npm run build      # production build to dist/
npm run preview    # serve the production build locally
```

## Deploy

The build is a static site (`base: './'` in `vite.config.js`), so `dist/` can go on any static host.

- **Netlify:** drag `dist/` into the Netlify dashboard, or connect the repo with build command `npm run build` and publish directory `dist`.
- **Vercel:** import the repo; the Vite preset is detected automatically.
- **GitHub Pages:** push `dist/` to a `gh-pages` branch (for example with the `gh-pages` package).

On a deployed build the analytics panel is hidden from visitors. Add `?analytics` to the URL to show it during a demo.

## How it's organized

```
src/
  main.jsx                     Mounts the app, registers the console analytics provider
  App.jsx                      Page composition; lifts calculator state for the ROI tool
  index.css                    Tailwind layers, focus styles, sticky-nav scroll offset
  data/content.js              All page copy (benefits, steps, FAQ) in one place
  hooks/useCostCalculator.js   Calculator state, validation, debounced analytics
  utils/
    calculator.js              Pure cost and ROI formulas, field config, validation
    inquiryValidation.js       Form rules and the soft "personal email" hint
    format.js                  Currency, number, and percent formatting
    calculator.test.js         Node test runner, no extra dependencies
  analytics/
    analytics.js               Event allow-list, property sanitizer, in-memory log, providers
    providers.js               Console provider (and where a real one would plug in)
    hooks.js                   useAnalyticsEvents (useSyncExternalStore), useTrackOnView
    config.js                  When the dev panel is allowed to render
    analytics.test.js
  components/
    Navbar, Hero, HeroSchedule, Benefits, HowItWorks,
    CostCalculator, NumberField, CostBreakdown, RoiScenario,
    InquiryForm, Faq, Footer, PrototypeBanner, AnalyticsPanel,
    Button, SectionHeader
```

## Calculator logic

```
wage cost        = apprentices × hourly wage × hours per week × program weeks
training cost    = apprentices × training cost per apprentice
supervisor cost  = apprentices × supervisor hours per week × supervisor hourly cost × program weeks
total            = wage + training + supervisor
cost/apprentice  = total ÷ apprentices
```

Inputs are stored as strings so a field can be cleared mid-edit. Each field has a min, max, and (where relevant) whole-number rule. If any field is invalid, results pause with a message instead of showing a misleading number. Values are rounded to cents internally and displayed to the dollar.

With the demo defaults (5 apprentices, $22/hr, 20 hrs, 24 weeks, $1,500 training, 2 supervisor hrs at $55/hr) the total is $73,500: $52,800 wages, $7,500 training, $13,200 supervision, or $14,700 per apprentice.

**ROI scenario.** The page never supplies a benefit figure. ROI is calculated only from a number the employer enters:

```
net benefit = employer's estimated benefits − estimated program cost
ROI %       = net benefit ÷ estimated program cost × 100     (shown as "Not defined" when cost is $0)
```

## Analytics

| Event | Fires when |
| --- | --- |
| `landing_page_view` | Page first renders (once) |
| `employer_benefits_view` | Benefits section is 40% visible (once) |
| `calculator_started` | First edit to any calculator field |
| `calculator_updated` | 800 ms after the last edit (debounced) |
| `calculator_completed` | Employer copies the estimate summary |
| `employer_cta_clicked` | Any tracked CTA; records `cta_id` and `location` |
| `inquiry_form_started` | First focus inside the form |
| `inquiry_form_submitted_demo` | Successful demo submission; records the area of interest only |

Privacy rules are enforced in `analytics.js`, not left to each caller: unknown event names are rejected, and only `cta_id`, `location`, `field`, and `area_of_interest` properties survive the sanitizer. Names, emails, messages, and calculator values never enter the log.

To connect a real tool later, write a provider with a `send(event)` method and call `registerProvider()` in `main.jsx`. No component changes are needed.

## Accessibility and UX notes

- Semantic landmarks, a skip link, labelled inputs, `aria-invalid` and `aria-describedby` on errors, and focus moved to the first invalid field on submit.
- One visible focus style everywhere, with a lighter variant on navy backgrounds.
- Smooth scrolling and the hero animation are disabled under `prefers-reduced-motion`.
- Anchored sections use `scroll-margin-top` so the sticky nav never covers headings.
- On small screens a compact running total stays visible while editing calculator inputs.
- The FAQ uses native `<details>`, which is keyboard and screen-reader friendly by default.
