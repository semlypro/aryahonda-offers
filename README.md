# Arya Honda — `/offers/` landing pages

Static Google Ads landing pages served from `aryahonda.com/offers/<model>/`.
Built with Next.js static export, so **no Node runtime is needed on the server**.

Four models: `honda-city`, `honda-amaze`, `honda-elevate`, `honda-zrv`.

## Why static

The live site is CodeIgniter 4.0.3 on PHP 7.4 on cPanel shared hosting, which cannot
run a Node server. The live `.htaccess` sends a request to CodeIgniter only when it
matches neither a file nor a directory:

```apache
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php/$1 [L]
```

So a real `offers/` directory is served straight by Apache and the framework never
sees it. A separate rule strips trailing slashes only for non-directories, so
`/offers/honda-city/` keeps its slash and resolves to `index.html` — which is why
`trailingSlash: true` is set in `next.config.ts`.

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

The endpoint is **root-relative on purpose**. The identical build works locally and in
production, and a local test can never post into the live database. Do not change it
to an absolute URL.

After saving, `save_lead()` redirects to whatever the hidden `url` field holds, which
is how the per-model thank-you page works — and it gives you a dedicated URL to fire a
Google Ads conversion on.

## Build and deploy

```bash
npm install
node scripts/fetch-images.mjs   # first run only, or when imagery changes
npm run build
npm run package                 # creates offers-upload.zip
```

In cPanel File Manager: upload `offers-upload.zip` into `public_html/offers/` and
extract it **there**. The archive root contains `honda-city/`, `honda-amaze/`, `_next/`
and so on — not a wrapping `out/` folder. Extracting in the wrong place produces
`public_html/offers/out/...` and every URL 404s.

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
- **No version control.** There is no history or rollback for this project.
- **No Google Ads conversion tag yet** — add it to the thank-you page once you have the
  conversion ID.
- The live site does not redirect `http://` to `https://`, and `www` and non-`www` both
  serve. Point ad destination URLs at `https://aryahonda.com/offers/<model>/`
  explicitly. Each page carries a `rel="canonical"` to that form.
