import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('ROICalc Studio landing page', () => {
  it('renders the revenue-focused hero, copy button, and package CTAs', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /launch a branded ROI calculator/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copy html/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /start for \$299/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /choose growth package/i })).toBeInTheDocument()
  })
})
