# Arya Honda — offers landing pages

Google Ads landing pages served from `offers.aryahonda.com/<model>/`, as a Next.js
server build deployed by Coolify.

Four models: `honda-city`, `honda-amaze`, `honda-elevate`, `honda-zrv`.

## Why a subdomain

These pages used to ship as a static export unzipped into `public_html/offers/`,
because the live site is CodeIgniter 4.0.3 on PHP 7.4 on cPanel shared hosting and
cannot run Node. They now run as a real Next.js server on their own host, which is
why `output: 'export'` and the `/offers` `basePath` are both gone.

The split costs one thing. `save_lead` still lives on `aryahonda.com`, so every URL
that leaves this origin and comes back has to name its host — see Lead flow.

## Lead flow

Forms post the five fields `name`, `mobile`, `email`, `model`, `url` to
`/home/save_lead`. `model` is a **Select Car Model dropdown**, matching the live
`/mumbai/<model>` form, preselected to whichever landing page the visitor is on but
free to change. Its options are the exact strings the live site stores
(`car_models` where `car_model_id = 0` and `availability_status = 'Existing'`), plus
`Honda ZR-V` which has a landing page but is not yet in the dealer database. They are
defined once in `src/components/LeadForm.tsx` as `LEAD_MODEL_OPTIONS`, and a test
asserts every model's `leadModelValue` is one of them — diverging would split the
sales team's reporting — the same endpoint the `/mumbai/<model>` pages use. Leads land in
the MySQL `car_contact_form` table and trigger the existing SendGrid notification, so
they appear in the normal admin panel with no changes to any PHP file.

The endpoint origin is **empty by default**, which leaves the path root-relative so a
local or e2e build reaches the replica and can never post into the live database.
Production supplies it as `NEXT_PUBLIC_LEADS_ORIGIN`, and `NEXT_PUBLIC_SITE_URL` does
the same for the canonicals and the hidden `url` field — that one must be absolute
because `save_lead` redirects to it from another host, where a relative value would
resolve against `aryahonda.com`. Do not hardcode either origin.

After saving, `save_lead()` redirects to whatever the hidden `url` field holds, which
is how the per-model thank-you page works — and it gives you a dedicated URL to fire a
Google Ads conversion on.

## Build and deploy

Pushing to `main` on <https://github.com/semlypro/aryahonda-offers> is the deploy:
Coolify builds the repo with Railpack and restarts the container.

Production environment variables. All four are needed **at build time**, because
`NEXT_PUBLIC_*` values are inlined into the bundle rather than read at runtime:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_LEADS_ORIGIN` | `https://aryahonda.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://offers.aryahonda.com` |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

Leaving either `NEXT_PUBLIC_*` unset does not fail the build — it silently produces
relative URLs, so the form posts into this subdomain and the lead is lost. Check a
page's `action` after any change to the environment.

Locally:

```bash
npm install
node scripts/fetch-images.mjs   # first run only, or when imagery changes
npm run dev
```

`scripts/package.mjs` and `offers-upload.zip` belong to the retired cPanel upload and
play no part in deploying.

## Testing

```bash
npm test            # 34 unit tests: content, imagery, form, built output
npm run test:e2e    # real browser submission against the local PHP site
```

The end-to-end test needs the local replica running (`./serve-local.sh` in the
aryahonda project) and the `aryahonda-mysql` container up. It submits three real leads,
asserts they reach MySQL with the right model and source, and you should delete them
afterwards:

```bash
docker exec aryahonda-mysql mysql -uroot -proot -e \
  "DELETE FROM a1651tt5_hondaary.car_contact_form WHERE name LIKE 'e2e-%';"
```

## Images

`scripts/fetch-images.mjs` downloads from hondacarindia.com and **resizes to 1600px at
quality 78**. Honda ships hero renders at 5833px and 6–8 MB each; unprocessed they
would destroy load time and Ads Quality Score. The pipeline takes ~25 MB down to
~1.7 MB. The script rejects any image under 400px wide, which is how a colour-swatch
chip was caught being used as a feature photo.

Images are **downloaded, never hotlinked** — a test asserts no `hondacarindia.com`
URL appears in built output.

## Monthly offer refresh

Offer figures expire. `src/content/models.ts` carries `validTillISO` per offer and
**the test suite fails once that date passes**. This is deliberate: a stale discount
cannot be built and shipped by accident.

To refresh: check <https://www.hondacarindia.com/shop/shop-offers>, update
`benefitsUpto`, `validTill` and `validTillISO`, then rebuild, repackage, re-upload.

Current state (October 2026): City `₹1,70,900` and Amaze `₹66,800` have published
offers. **ZR-V and Elevate have none** — their pages lead on price and a test-drive
CTA, and the offer block is simply absent. Give a model an `offer` object and it
appears automatically.

## Accuracy rules baked into the tests

- Mileage and torque figures **must** carry a variant qualifier (`note`). Honda quotes
  City's 27.26 km/L and 253 Nm for the e:HEV strong hybrid; printing those numbers
  unqualified would be misleading advertising. A test enforces this.
- Honda's terms are reproduced verbatim wherever an offer is shown.

## Known limitations

- **No campaign attribution.** `save_lead()` writes only five fields and hardcodes
  `source = 'Adwords'`, discarding anything else. UTM data cannot be stored without a
  PHP change (~3 lines, writing into the unused `inquiry` column).
- **No Google Ads conversion tag yet** — add it to the thank-you page once you have the
  conversion ID.
- Point ad destination URLs at `https://offers.aryahonda.com/<model>/`. Coolify
  terminates TLS and redirects `http://` and `www.` to that form, and each page
  carries a matching `rel="canonical"`.
- The retired `aryahonda.com/offers/` directory still serves the old static copy. Until
  it is removed or redirected, the same content sits on two URLs.
