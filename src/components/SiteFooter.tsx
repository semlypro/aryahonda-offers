import { DEALER, SHOWROOMS, SHOWROOMS_HEADING } from '../content/dealer'
import { asset } from '../lib/paths'

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-[18px] w-[18px] shrink-0 fill-[#e40521]">
      <path d="M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11h.5A1.5 1.5 0 0121 12.5V17a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H6v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-4.5A1.5 1.5 0 014.5 11H5zm2.2-1h9.6l-1-3a.5.5 0 00-.5-.4H8.7a.5.5 0 00-.5.4l-1 3zM7 14a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-[16px] w-[16px] shrink-0 fill-[#e40521]">
      <path d="M3 6a1 1 0 011-1h16a1 1 0 011 1v.3l-9 5.2-9-5.2V6zm0 2.6V18a1 1 0 001 1h16a1 1 0 001-1V8.6l-8.5 4.9a1 1 0 01-1 0L3 8.6z" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-[16px] w-[16px] shrink-0 fill-[#e40521]">
      <path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-[16px] w-[16px] shrink-0 fill-[#e40521]">
      <path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25c1.1.37 2.3.57 3.6.57a1 1 0 011 1V20a1 1 0 01-1 1C10.7 21 3 13.3 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.3.2 2.5.57 3.6a1 1 0 01-.25 1l-2.2 2.2z" />
    </svg>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[#e8e8ec] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-[28px] leading-tight font-bold tracking-tight text-[#e40521] sm:text-[34px]">
          {SHOWROOMS_HEADING}
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {SHOWROOMS.map((s) => (
            <div
              key={s.name}
              className="rounded-[18px] bg-white p-7 shadow-[0_4px_24px_rgba(11,11,15,0.08)]"
            >
              <p className="flex items-center gap-3 text-[17px] font-bold text-[#2c2e3f]">
                <CarIcon />
                {s.name}
              </p>

              <p className="mt-4 flex items-start gap-3 text-[15px] text-[#2c2e3f]">
                <MailIcon />
                <a href={`mailto:${s.email}`} className="hover:underline">{s.email}</a>
              </p>

              <p className="mt-4 flex items-start gap-3 text-[15px] leading-relaxed text-[#2c2e3f]">
                <PinIcon />
                <span>{s.address}</span>
              </p>

              <p className="mt-4 flex items-center gap-3 text-[15px] text-[#2c2e3f]">
                <PhoneIcon />
                <a href={`tel:${s.phoneHref}`} className="hover:underline">{s.phone}</a>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[#e8e8ec] pt-8">
          <img
            src={asset(DEALER.logo)}
            alt={DEALER.name}
            width={372}
            height={26}
            loading="lazy"
            decoding="async"
            className="h-6 w-auto"
          />
          <div className="mt-4 text-[11px] leading-relaxed text-[#8c8c8c]">
            <p>* All prices are ex-showroom and indicative.</p>
            <p className="mt-1">
              Total benefits are available for a limited period on select models,
              editions and cities. Stock without benefits is also available. Figures
              quoted for a specific variant are marked as such. Speak to Arya Honda for
              figures applying to the variant you choose.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
