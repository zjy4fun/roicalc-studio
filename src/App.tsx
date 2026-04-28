import { useMemo, useState } from 'react'
import './App.css'
import { buildScenario, createEmbedHtml, formatCurrency, type CalculatorInputs } from './calculator'

const initialInputs: CalculatorInputs = {
  monthlyVisitors: 12000,
  conversionRate: 3,
  averageContractValue: 1800,
  grossMargin: 72,
  churnReduction: 12,
  toolCost: 299,
  implementationHours: 12,
  hourlyRate: 90,
}

const inputMeta: Array<{ key: keyof CalculatorInputs; label: string; suffix?: string; prefix?: string; min: number; step: number }> = [
  { key: 'monthlyVisitors', label: 'Monthly landing-page visitors', min: 100, step: 100 },
  { key: 'conversionRate', label: 'Current conversion rate', suffix: '%', min: 0.1, step: 0.1 },
  { key: 'averageContractValue', label: 'Average contract value', prefix: '$', min: 1, step: 50 },
  { key: 'grossMargin', label: 'Gross margin', suffix: '%', min: 1, step: 1 },
  { key: 'churnReduction', label: 'Expected intent capture lift', suffix: '%', min: 1, step: 1 },
  { key: 'toolCost', label: 'Monthly tool / service fee', prefix: '$', min: 0, step: 10 },
  { key: 'implementationHours', label: 'Implementation hours', min: 0, step: 1 },
  { key: 'hourlyRate', label: 'Internal hourly rate', prefix: '$', min: 0, step: 5 },
]

function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs)
  const [copyState, setCopyState] = useState('Copy HTML')
  const [brand, setBrand] = useState({
    companyName: 'Acme AI',
    brandColor: '#7c3aed',
    ctaUrl: 'https://example.com/demo',
    ctaLabel: 'Book a revenue audit',
  })

  const scenario = useMemo(() => buildScenario(inputs), [inputs])
  const embedHtml = useMemo(() => createEmbedHtml(brand), [brand])

  const copyEmbedHtml = async () => {
    await navigator.clipboard?.writeText(embedHtml)
    setCopyState('Copied')
    window.setTimeout(() => setCopyState('Copy HTML'), 1400)
  }

  const updateInput = (key: keyof CalculatorInputs, value: number) => {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <main>
      <nav className="nav">
        <span className="logoMark">ROI</span>
        <span>ROICalc Studio</span>
        <a href="mailto:hello@example.com?subject=Custom%20ROI%20calculator" className="navCta">Sell a custom build</a>
      </nav>

      <section className="heroGrid">
        <div className="heroCopy">
          <p className="eyebrow">Micro-SaaS MVP · built to monetize with services first</p>
          <h1>Launch a branded ROI calculator that turns visitors into sales calls.</h1>
          <p className="lede">
            ROICalc Studio helps SaaS founders, agencies, and B2B consultants publish persuasive ROI calculators,
            export embeddable widgets, and sell custom calculator builds starting at $299.
          </p>
          <div className="heroActions">
            <a href="#studio" className="primaryButton">Build my calculator</a>
            <a href="#pricing" className="secondaryButton">See monetization path</a>
          </div>
          <div className="proofRow" aria-label="Business model proof points">
            <span>⚡ Static-first</span>
            <span>📎 Embed export</span>
            <span>💸 Service revenue ready</span>
          </div>
        </div>

        <aside className="resultCard" aria-label="ROI results preview">
          <span className="cardLabel">First-year upside</span>
          <strong>{formatCurrency(scenario.netFirstYearGain)}</strong>
          <p>{scenario.roiPercent.toLocaleString('en-US')}% ROI · {scenario.paybackMonths} month payback</p>
          <div className="metricGrid">
            <div><small>New revenue</small><b>{formatCurrency(scenario.annualNewRevenue)}</b></div>
            <div><small>Gross profit</small><b>{formatCurrency(scenario.annualGrossProfit)}</b></div>
            <div><small>Year-one cost</small><b>{formatCurrency(scenario.firstYearCost)}</b></div>
            <div><small>New deals/mo</small><b>{scenario.monthlyNewDeals}</b></div>
          </div>
        </aside>
      </section>

      <section id="studio" className="studioGrid">
        <div className="panel">
          <div className="sectionHeader">
            <p className="eyebrow">Calculator studio</p>
            <h2>Model the buyer's business case</h2>
          </div>
          <div className="formGrid">
            {inputMeta.map((item) => (
              <label key={item.key} className="field">
                <span>{item.label}</span>
                <div className="inputWrap">
                  {item.prefix && <em>{item.prefix}</em>}
                  <input
                    type="number"
                    min={item.min}
                    step={item.step}
                    value={inputs[item.key]}
                    onChange={(event) => updateInput(item.key, Number(event.target.value))}
                  />
                  {item.suffix && <em>{item.suffix}</em>}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="panel darkPanel">
          <div className="sectionHeader">
            <p className="eyebrow">Sales-ready output</p>
            <h2>{scenario.recommendedHeadline}</h2>
          </div>
          <p>
            Use this headline on a landing page, proposal, or outbound email. The model converts traffic,
            conversion rate, contract size, and delivery cost into a clear payback story.
          </p>
          <ul className="checkList">
            <li>Export self-contained HTML widget</li>
            <li>Change brand, CTA, and offer</li>
            <li>Sell setup as a fixed-price service</li>
          </ul>
        </div>
      </section>

      <section className="embedPanel">
        <div className="embedHeader">
          <div className="sectionHeader">
            <p className="eyebrow">Embed generator</p>
            <h2>Customize the widget and copy the HTML.</h2>
          </div>
          <button type="button" className="copyButton" onClick={copyEmbedHtml}>{copyState}</button>
        </div>
        <div className="brandGrid">
          {Object.entries(brand).map(([key, value]) => (
            <label key={key} className="field">
              <span>{key.replace(/([A-Z])/g, ' $1')}</span>
              <input
                value={value}
                onChange={(event) => setBrand((current) => ({ ...current, [key]: event.target.value }))}
              />
            </label>
          ))}
        </div>
        <textarea value={embedHtml} readOnly aria-label="Generated embed HTML" />
      </section>

      <section id="pricing" className="pricingGrid">
        <div>
          <p className="eyebrow">How this can make money</p>
          <h2>Start with service revenue, then productize.</h2>
          <p>
            The fastest path is selling custom ROI calculators to B2B SaaS teams, agencies, and consultants.
            Later, add paid hosting, lead capture, analytics, and white-label workspaces.
          </p>
        </div>
        <div className="priceCard">
          <span>Starter service</span>
          <strong>$299</strong>
          <p>One branded calculator + embed + copywriting angle</p>
          <a href="mailto:hello@example.com?subject=Starter%20ROI%20calculator" className="priceCta">Start for $299</a>
        </div>
        <div className="priceCard highlighted">
          <span>Growth package</span>
          <strong>$999</strong>
          <p>Calculator, landing page, CRM lead form, and A/B offer variants</p>
          <a href="mailto:hello@example.com?subject=Growth%20ROI%20package" className="priceCta">Choose Growth Package</a>
        </div>
      </section>
    </main>
  )
}

export default App
