import type { Metadata } from 'next'
import { LeadForm } from '../components/LeadForm'
import { ModelCard } from '../components/ModelCard'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { DEALER } from '../content/dealer'
import { models } from '../content/models'
import { url } from '../lib/paths'

export const metadata: Metadata = {
  title: 'Honda Car Offers in Mumbai | Arya Honda',
  description:
    'Current offers on the Honda City, Amaze, Elevate and ZR-V at Arya Honda, an authorised Honda dealership in Mumbai since 2005.',
  alternates: { canonical: 'https://aryahonda.com/offers/' },
}

export default function OffersIndex() {
  return (
    <>
      <SiteHeader />

      <main className="bg-white">
        <section className="mx-auto max-w-6xl px-4 pt-14 pb-8 text-center">
          <h1 className="text-[32px] leading-tight font-bold tracking-tight text-[#2c2e3f] sm:text-[40px]">
            Honda cars at Arya Honda
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[#8c8c8c]">
            Choose your model to see this month’s price and benefits, booked and
            delivered through our Prabhadevi and Bhandup showrooms.
          </p>
        </section>

        {/* Honda's own lineup grid: renders on white, hairline rules, no cards. */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {models.map((m, i) => (
              <div
                key={m.slug}
                className="border-[#838383]/50 sm:[&:nth-child(-n+2)]:border-b sm:[&:nth-child(odd)]:border-r"
              >
                <ModelCard model={m} eager={i < 2} />
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-[#e8e8ec] bg-[#faf8f5]">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1fr_1.1fr] md:items-start">
            <div>
              <h2 className="text-[26px] leading-tight font-bold tracking-tight text-[#2c2e3f]">
                Talk to {DEALER.name}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#6b6b76]">
                Tell us which Honda you have in mind and an Arya Honda advisor will call
                you with the on-road price, the benefits applying to your variant, and a
                test drive slot at Prabhadevi or Bhandup.
              </p>
              <p className="mt-5 text-[13px] text-[#8c8c8c]">
                Selling and servicing Honda in Mumbai since {DEALER.since}.
              </p>
            </div>

            <div className="rounded-[var(--radius-card)] border border-[#e8e4dd] bg-white p-6 shadow-sm sm:p-8">
              <LeadForm heading="Request a callback" />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
