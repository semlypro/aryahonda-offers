import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LeadForm } from '../../components/LeadForm'
import { ModelCard } from '../../components/ModelCard'
import { SiteFooter } from '../../components/SiteFooter'
import { SiteHeader } from '../../components/SiteHeader'
import { DEALER } from '../../content/dealer'
import { getModel, models } from '../../content/models'
import { absoluteUrl, asset } from '../../lib/paths'

export function generateStaticParams() {
  return models.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const model = getModel(slug)
  if (!model) return {}
  return {
    title: model.metaTitle,
    description: model.metaDescription,
    alternates: { canonical: absoluteUrl(`/${model.slug}/`) },
  }
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const model = getModel(slug)
  // A param with no content fails the build rather than emitting a broken page.
  if (!model) notFound()

  return (
    <>
      {/* A CSS background is discovered late; preload it so LCP is not delayed. */}
      <link rel="preload" as="image" href={asset(model.heroImage)} fetchPriority="high" />
      <SiteHeader />
      <main>
      {/*
        The Honda banner sits behind the whole hero — title, price, offer and
        form — rather than as a separate strip. A scrim keeps the overlaid
        content legible; the banner's own artwork reads as context behind it.
      */}
      <section
        className="relative isolate bg-ink bg-cover bg-[position:68%_center] bg-no-repeat text-white"
        style={{ backgroundImage: `url(${asset(model.heroImage)})` }}
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/97 via-ink/92 to-ink/60"
        />

        <div id="enquire" className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="text-4xl font-bold md:text-5xl">{model.name}</h1>
            <p className="mt-2 text-xl text-accent">{model.tagline}</p>

            <p className="mt-8 text-sm text-white/60">{model.priceLabel}</p>
            <p className="text-3xl font-bold">{model.price}*</p>
            <p className="mt-1 text-xs text-white/50">Ex-showroom price.</p>

            {model.offer && (
              <div
                data-testid="offer-block"
                className="mt-8 rounded-[var(--radius-card)] bg-accent-soft p-5 text-ink"
              >
                <p className="text-sm font-medium">Benefits upto</p>
                <p className="text-3xl font-bold text-brand">{model.offer.benefitsUpto}*</p>
                <ul className="mt-4 space-y-1">
                  {model.offer.terms.map((t) => (
                    <li key={t} className="text-[11px] leading-snug text-muted">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
              {model.stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs text-white/50">{s.label}</dt>
                  <dd className="mt-1 text-xl font-semibold">{s.value}</dd>
                  {s.note && <dd className="text-[10px] text-white/40">{s.note}</dd>}
                </div>
              ))}
            </dl>
          </div>

          <div className="h-fit">
            <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-lg sm:p-8">
              <LeadForm model={model} />
            </div>

            {/* Transparent studio render, so the car reads cleanly over the
                dark hero rather than as a white box. */}
            <img
              src={asset(model.renderImage)}
              alt={model.name}
              loading="lazy"
              decoding="async"
              className="mt-8 h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section className="bg-paper-warm py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-2xl font-bold">Highlights</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {model.features.map((f) => (
              <figure
                key={f.title}
                className="overflow-hidden rounded-[var(--radius-card)] bg-paper shadow-sm"
              >
                <img
                  src={asset(f.image)}
                  alt={f.title}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/9] w-full bg-white object-contain"
                />
                <figcaption className="p-4 text-sm font-medium">{f.title}</figcaption>
              </figure>
            ))}
          </div>

          <h2 className="mt-14 mb-5 text-2xl font-bold">Honda SENSING</h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {model.sensing.map((s) => (
              <li
                key={s}
                className="rounded-lg border border-paper-line bg-paper px-4 py-3 text-sm"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>


      <section className="border-t border-[#e8e8ec] bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-[26px] font-bold tracking-tight text-[#2c2e3f] sm:text-[30px]">
            Other Honda models at Arya Honda
          </h2>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3">
            {models
              .filter((m) => m.slug !== model.slug)
              .map((m) => (
                <div
                  key={m.slug}
                  className="border-[#838383]/50 sm:not-last:border-r"
                >
                  <ModelCard model={m} />
                </div>
              ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3 border-t border-[#e8e8ec] pt-10 sm:flex-row sm:justify-center">
            <p className="text-[15px] text-[#6b6b76]">
              Not sure which Honda suits you?
            </p>
            <div className="flex gap-3">
              <a
                href="#enquire"
                className="rounded-lg bg-[#e40521] px-6 py-3 text-[14px] font-bold text-white hover:bg-[#b8001a]"
              >
                Request a callback
              </a>
              <a
                href={`tel:${DEALER.phoneHref}`}
                className="rounded-lg border border-[#2c2e3f] px-6 py-3 text-[14px] font-bold text-[#2c2e3f] hover:bg-[#2c2e3f] hover:text-white"
              >
                {`Call ${DEALER.phone}`}
              </a>
            </div>
          </div>
        </div>
      </section>
      </main>
      <SiteFooter />
    </>
  )
}
