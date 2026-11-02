import type { Metadata } from 'next'
import { SiteFooter } from '../../components/SiteFooter'
import { SiteHeader } from '../../components/SiteHeader'
import { DEALER } from '../../content/dealer'
import { url } from '../../lib/paths'

export const metadata: Metadata = {
  title: 'Thank you | Arya Honda',
  robots: { index: false, follow: false },
}

export default function ThankYou() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#e40521] text-3xl text-white">
          ✓
        </div>
        <h1 className="text-[30px] font-bold tracking-tight text-[#2c2e3f]">Thank you</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[#6b6b76]">
          We have your enquiry. An Arya Honda advisor will call you shortly with pricing
          and a test drive slot.
        </p>
        <p className="mt-6 text-[14px] text-[#8c8c8c]">
          Prefer to talk now?{' '}
          <a href={`tel:${DEALER.phoneHref}`} className="font-semibold text-[#2c2e3f] hover:underline">
            Call {DEALER.phone}
          </a>
        </p>
        <a
          href={url('/')}
          className="mt-10 inline-block rounded-lg bg-[#e40521] px-6 py-3 font-bold text-white hover:bg-[#b8001a]"
        >
          Back to offers
        </a>
      </main>
      <SiteFooter />
    </>
  )
}
