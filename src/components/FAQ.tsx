import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'How do you vet your Saathis?',
    answer: 'Every Saathi undergoes a rigorous multi-step verification including Aadhaar/ID verification, background checks, skill assessments, and an in-person interview to ensure your safety and trust.',
  },
  {
    question: 'How is the pricing determined?',
    answer: 'Pricing is transparent and based on the type of task, estimated duration, and local market rates. You\'ll always see the final price before booking — no hidden fees.',
  },
  {
    question: 'What if I\'m not satisfied with the service?',
    answer: 'We offer a 100% satisfaction guarantee. If the task wasn\'t completed to your expectations, our support team will resolve the issue or provide a full refund.',
  },
  {
    question: 'Can I request the same Saathi again?',
    answer: 'Absolutely! If you have a great experience with a particular helper, you can favorite them and request them for all your future tasks.',
  },
  {
    question: 'Is my payment secure?',
    answer: 'Yes. All payments are processed through our secure platform. Your payment is held in escrow and released to the helper only after you confirm satisfaction.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label">FAQ</div>
          <h2 style={{ marginBottom: '1rem' }}>Questions? Answered.</h2>
          <div className="gold-divider" />
          <p className="section-desc">
            Everything you need to know about using Saathi.
          </p>
        </div>

        {/* Accordion */}
        <div style={{ maxWidth: 750, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                style={{
                  border: `1px solid ${isOpen ? 'var(--border-gold)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  background: isOpen ? 'var(--bg-card)' : 'transparent',
                  boxShadow: isOpen ? 'var(--shadow-gold)' : 'none',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '1.25rem 1.5rem',
                    textAlign: 'left', fontSize: '1rem', fontWeight: 600,
                    color: isOpen ? 'var(--gold)' : 'var(--text-light)',
                    cursor: 'pointer', background: 'none', border: 'none',
                    transition: 'color 0.3s',
                  }}
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp size={18} style={{ color: 'var(--gold)', flexShrink: 0, marginLeft: '1rem' }} />
                  ) : (
                    <ChevronDown size={18} style={{ color: 'var(--text-muted)', flexShrink: 0, marginLeft: '1rem' }} />
                  )}
                </button>

                <div style={{
                  maxHeight: isOpen ? 200 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.4s ease',
                }}>
                  <div style={{
                    padding: '0 1.5rem 1.25rem',
                    color: 'var(--text-grey)',
                    fontSize: '0.95rem', lineHeight: 1.7,
                  }}>
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
