import type { Model } from '../content/types'
import { asset, url } from '../lib/paths'

/**
 * The lineup cell Honda uses on its homepage: render on white, name, price
 * label, price. Shared by the offers index and the "other models" band on
 * each model page so the two can never drift apart.
 */
export function ModelCard({ model, eager = false }: { model: Model; eager?: boolean }) {
  return (
    <a
      href={url(`/${model.slug}/`)}
      className="group block px-6 py-10 text-center transition-colors hover:bg-[#fafafa]"
    >
      <img
        src={asset(model.lineupImage)}
        alt={model.name}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="mx-auto h-auto w-full max-w-[340px]"
      />
      <h3 className="mt-5 text-[19px] font-bold tracking-tight text-[#2c2e3f]">
        {model.displayName}
      </h3>
      <p className="mt-3 text-[11px] font-medium text-[#8c8c8c]">{model.priceLabel}</p>
      <p className="text-[19px] font-bold text-[#2c2e3f]">{model.price}*</p>

      {model.offer && (
        <p className="mt-3 inline-block rounded-full bg-[#fff3dd] px-3 py-1 text-[12px] font-semibold text-[#b8001a]">
          Benefits upto {model.offer.benefitsUpto}*
        </p>
      )}

      <span className="mt-4 block text-[13px] font-semibold text-[#2c2e3f] underline-offset-4 group-hover:underline">
        Explore
      </span>
    </a>
  )
}
