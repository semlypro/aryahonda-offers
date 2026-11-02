import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteFooter } from '../../../components/SiteFooter'
import { SiteHeader } from '../../../components/SiteHeader'
import { getModel, models } from '../../../content/models'
import { url } from '../../../lib/paths'

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
  return {
    title: `Thank you — ${model?.name ?? 'Arya Honda'}`,
    robots: { index: false, follow: false },
  }
}

export default async function ThankYou({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const model = getModel(slug)
  if (!model) notFound()

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand text-3xl text-white">
        ✓
      </div>
      <h1 className="text-3xl font-bold">Thank you</h1>
      <p className="mt-4 text-muted">
        We have received your enquiry for the {model.name}. An Arya Honda advisor will
        call you shortly.
      </p>
      <a
        href={url(`/${model.slug}/`)}
        className="mt-10 inline-block rounded-lg bg-brand px-6 py-3 font-bold text-white hover:bg-brand-dark"
      >
        Back to {model.name}
      </a>
      </main>
      <SiteFooter />
    </>
  )
}
