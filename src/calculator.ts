export type CalculatorInputs = {
  monthlyVisitors: number
  conversionRate: number
  averageContractValue: number
  grossMargin: number
  churnReduction: number
  toolCost: number
  implementationHours: number
  hourlyRate: number
}

export type Scenario = CalculatorInputs & {
  monthlyNewDeals: number
  annualNewRevenue: number
  annualGrossProfit: number
  firstYearCost: number
  netFirstYearGain: number
  roiPercent: number
  paybackMonths: number
  recommendedHeadline: string
}

export type EmbedOptions = {
  companyName: string
  brandColor: string
  ctaUrl: string
  ctaLabel: string
}

const CAPTURE_RATE = 0.3

const roundCurrency = (value: number) => Math.round(value)

export function buildScenario(inputs: CalculatorInputs): Scenario {
  const monthlyBaseConversions = inputs.monthlyVisitors * (inputs.conversionRate / 100)
  const monthlyNewDeals = monthlyBaseConversions * (inputs.churnReduction / 100) * CAPTURE_RATE
  const annualNewRevenue = roundCurrency(monthlyNewDeals * inputs.averageContractValue * 12)
  const annualGrossProfit = roundCurrency(annualNewRevenue * (inputs.grossMargin / 100))
  const firstYearCost = roundCurrency(inputs.toolCost * 12 + inputs.implementationHours * inputs.hourlyRate)
  const netFirstYearGain = annualGrossProfit - firstYearCost
  const roiPercent = Math.round((netFirstYearGain / Math.max(firstYearCost, 1)) * 100)
  const paybackMonths = Number((firstYearCost / Math.max(annualGrossProfit / 12, 1)).toFixed(1))

  return {
    ...inputs,
    monthlyNewDeals: Number(monthlyNewDeals.toFixed(1)),
    annualNewRevenue,
    annualGrossProfit,
    firstYearCost,
    netFirstYearGain,
    roiPercent,
    paybackMonths,
    recommendedHeadline: `${formatCurrency(netFirstYearGain)} in estimated first-year upside`,
  }
}

export function formatCurrency(value: number): string {
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''

  if (abs >= 1_000_000) {
    return `${sign}$${trimTrailingZero(abs / 1_000_000)}M`
  }

  if (abs >= 10_000) {
    return `${sign}$${trimTrailingZero(abs / 1_000)}K`
  }

  return `${sign}$${Math.round(abs).toLocaleString('en-US')}`
}

function trimTrailingZero(value: number): string {
  return value.toFixed(1).replace(/\.0$/, '')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function createEmbedHtml(options: EmbedOptions): string {
  const brandColor = escapeHtml(options.brandColor || '#7c3aed')
  const companyName = escapeHtml(options.companyName || 'Your company')
  const ctaUrl = escapeHtml(options.ctaUrl || '#')
  const ctaLabel = escapeHtml(options.ctaLabel || 'Book demo')

  return `<div data-roicalc-widget style="font-family:Inter,system-ui,sans-serif;max-width:760px;border:1px solid #e5e7eb;border-radius:24px;padding:24px;background:#fff;color:#111827;box-shadow:0 24px 70px rgba(15,23,42,.12)">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px"><span style="width:12px;height:12px;border-radius:999px;background:${brandColor};display:inline-block"></span><strong>${companyName} ROI Calculator</strong></div>
  <h3 style="font-size:28px;line-height:1.1;margin:0 0 8px">How much revenue is hiding in your funnel?</h3>
  <p style="margin:0 0 18px;color:#6b7280">Use this calculator to model incremental pipeline, margin, and payback from conversion improvements.</p>
  <a href="${ctaUrl}" style="display:inline-flex;background:${brandColor};color:#fff;text-decoration:none;border-radius:999px;padding:12px 18px;font-weight:700">${ctaLabel}</a>
</div>`
}
