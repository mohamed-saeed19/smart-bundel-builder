import { BUDGET_LIMIT } from '../constants/build'
import type { Part } from '../types'
import { formatCurrency } from '../utils/build'

type PrintableInvoiceProps = {
  selectedParts: Part[]
  totalCost: number
}

export function PrintableInvoice({ selectedParts, totalCost }: PrintableInvoiceProps) {
  const generatedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <section className="print-invoice" aria-label="Printable build invoice">
      <header className="invoice-header">
        <div>
          <p className="invoice-kicker">Smart Bundle Builder</p>
          <h1>Build Invoice</h1>
          <p>Generated {generatedAt}</p>
        </div>
        <div className="invoice-total-box">
          <span>Total</span>
          <strong>{formatCurrency(totalCost)}</strong>
          <small>Budget {formatCurrency(BUDGET_LIMIT)}</small>
        </div>
      </header>

      <div className="invoice-grid">
        {selectedParts.map((part) => (
          <article className="invoice-item" key={part.id}>
            <img src={part.image} alt={part.name} />
            <div>
              <span>{part.category}</span>
              <h2>{part.name}</h2>
              <p>{part.description}</p>
            </div>
            <strong>{formatCurrency(part.price)}</strong>
          </article>
        ))}
      </div>

      <footer className="invoice-footer">
        <span>{selectedParts.length} selected components</span>
        <strong>{formatCurrency(Math.max(0, BUDGET_LIMIT - totalCost))} remaining</strong>
      </footer>
    </section>
  )
}
