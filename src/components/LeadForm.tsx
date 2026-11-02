import { models } from '../content/models'
import type { Model } from '../content/types'
import { absoluteUrl } from '../lib/paths'

/**
 * Absolute because these pages now serve from offers.aryahonda.com while
 * save_lead still lives on aryahonda.com. A relative path would post into
 * this subdomain, where no such route exists, and the lead would vanish.
 */
export const LEAD_ENDPOINT = 'https://aryahonda.com/home/save_lead'

/**
 * The dropdown lists exactly the models that have an offers page, using the
 * same names those pages show. Derived from the lineup rather than written
 * out, so adding a model updates the form automatically.
 *
 * These strings are stored verbatim in car_contact_form.model.
 */
export const LEAD_MODEL_OPTIONS = models.map((m) => m.leadModelValue)

const field =
  'w-full rounded-lg border border-[#d8d8dd] bg-white px-4 py-3 text-[15px] text-[#2c2e3f] placeholder:text-[#8c8c8c] focus:border-[#2c2e3f] focus:outline-none'

/**
 * `model` omitted — as on the lineup index — leaves the dropdown unselected
 * and sends the visitor to the shared thank-you page.
 */
export function LeadForm({ model, heading }: { model?: Model; heading?: string }) {
  const thankYou = model
    ? absoluteUrl(`/${model.slug}/thank-you/`)
    : absoluteUrl('/thank-you/')

  return (
    <form method="post" action={LEAD_ENDPOINT} className="w-full">
      <h2 className="text-[22px] font-bold tracking-tight text-[#2c2e3f]">
        {heading ?? `Get the best price on the ${model?.name}`}
      </h2>
      <p className="mt-1 mb-6 text-[13px] text-[#8c8c8c]">
        An Arya Honda advisor will call you back.
      </p>

      <input type="hidden" name="url" value={thankYou} />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="sr-only" htmlFor="lead-name">Full name</label>
        <input
          id="lead-name" name="name" required autoComplete="name"
          placeholder="Enter Full Name" className={field}
        />

        <label className="sr-only" htmlFor="lead-mobile">Mobile number</label>
        <input
          id="lead-mobile" name="mobile" required type="tel" inputMode="numeric"
          pattern="[0-9]{10,11}" minLength={10} maxLength={11} autoComplete="tel"
          placeholder="Enter Mobile Number" className={field}
        />

        <label className="sr-only" htmlFor="lead-email">Email address</label>
        <input
          id="lead-email" name="email" type="email" required autoComplete="email"
          placeholder="Enter Email Address" className={field}
        />

        <label className="sr-only" htmlFor="lead-model">Car model</label>
        <select
          id="lead-model" name="model" required
          defaultValue={model ? model.leadModelValue : ''} className={field}
        >
          <option value="">Select Car Model</option>
          {LEAD_MODEL_OPTIONS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="mt-5 w-full rounded-lg bg-[#e40521] px-6 py-3.5 text-[15px] font-bold tracking-wide text-white transition-colors hover:bg-[#b8001a] sm:w-auto sm:px-12"
      >
        Get Best Offer
      </button>

      <p className="mt-3 text-[11px] text-[#8c8c8c]">
        By submitting you agree to be contacted by Arya Honda.
      </p>
    </form>
  )
}
