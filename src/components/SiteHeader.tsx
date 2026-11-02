import { DEALER } from '../content/dealer'
import { asset, url } from '../lib/paths'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e8ec] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <a href={url('/')} aria-label={`${DEALER.name} home`}>
          <img
            src={asset(DEALER.logo)}
            alt={DEALER.name}
            width={372}
            height={26}
            className="h-6 w-auto sm:h-7"
          />
        </a>

        <a
          href={`tel:${DEALER.phoneHref}`}
          className="shrink-0 rounded-lg bg-[#e40521] px-4 py-2.5 text-[14px] font-bold text-white hover:bg-[#b8001a]"
        >
          {`Call ${DEALER.phone}`}
        </a>
      </div>
    </header>
  )
}
