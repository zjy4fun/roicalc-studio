import { describe, expect, it } from 'vitest'
import { buildScenario, createEmbedHtml, formatCurrency } from './calculator'

describe('ROI scenario engine', () => {
  it('calculates yearly savings, net ROI, payback months, and conversion lift', () => {
    const scenario = buildScenario({
      monthlyVisitors: 12000,
      conversionRate: 3,
      averageContractValue: 1800,
      grossMargin: 72,
      churnReduction: 12,
      toolCost: 299,
      implementationHours: 12,
      hourlyRate: 90,
    })

    expect(scenario.annualNewRevenue).toBe(279_936)
    expect(scenario.annualGrossProfit).toBe(201_554)
    expect(scenario.firstYearCost).toBe(4_668)
    expect(scenario.netFirstYearGain).toBe(196_886)
    expect(scenario.roiPercent).toBe(4218)
    expect(scenario.paybackMonths).toBe(0.3)
    expect(scenario.recommendedHeadline).toContain('$196.9K')
  })

  it('formats currency compactly for calculator cards', () => {
    expect(formatCurrency(196886)).toBe('$196.9K')
    expect(formatCurrency(4300000)).toBe('$4.3M')
    expect(formatCurrency(880)).toBe('$880')
  })
})

describe('embed generator', () => {
  it('creates self-contained HTML with user brand and CTA', () => {
    const html = createEmbedHtml({
      companyName: 'Acme AI',
      brandColor: '#7c3aed',
      ctaUrl: 'https://example.com/demo',
      ctaLabel: 'Book demo',
    })

    expect(html).toContain('Acme AI')
    expect(html).toContain('#7c3aed')
    expect(html).toContain('https://example.com/demo')
    expect(html).toContain('Book demo')
    expect(html).toContain('data-roicalc-widget')
  })
})
