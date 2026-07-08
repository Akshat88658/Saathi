import { ShoppingBag, Dog, UserCheck, Pill, Baby, Car, ArrowRight } from 'lucide-react';

const services = [
  { id: 1, title: 'Grocery Shopping', icon: ShoppingBag, desc: 'Fresh groceries picked and delivered to your doorstep by a trusted local.' },
  { id: 2, title: 'Dog Walking', icon: Dog, desc: 'Professional and caring walks for your furry friends, rain or shine.' },
  { id: 3, title: 'Elderly Care', icon: UserCheck, desc: 'Compassionate companionship and daily assistance for your loved ones.' },
  { id: 4, title: 'Medicine Pickup', icon: Pill, desc: 'Timely prescription pickups from your nearest pharmacy, delivered safely.' },
  { id: 5, title: 'Babysitter', icon: Baby, desc: 'Experienced and caring babysitters for your children.' },
  { id: 6, title: 'Pick up and dropping facility', icon: Car, desc: 'Safe, punctual, and comfortable transportation services across the city.' },
];

const Services = () => {
  return (
    <section id="services" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label">Our Services</div>
          <h2 style={{ marginBottom: '1rem' }}>Everything You Need,<br />One Platform</h2>
          <div className="gold-divider" />
          <p className="section-desc">
            Whatever the task, we have a verified Saathi ready to help you — quickly, reliably, and affordably.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}>
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="card animate-fade-in-up"
                style={{
                  animationDelay: `${(index % 3) * 120}ms`,
                  display: 'flex', flexDirection: 'column',
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 'var(--radius-md)',
                  background: 'var(--gold-muted)', border: '1px solid var(--border-gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--gold)', marginBottom: '1.5rem',
                }}>
                  <Icon size={26} />
                </div>
                <h3 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>{service.title}</h3>
                <p style={{ color: 'var(--text-grey)', fontSize: '0.95rem', lineHeight: 1.6, flex: 1 }}>
                  {service.desc}
                </p>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  color: 'var(--gold)', fontWeight: 600, fontSize: '0.9rem',
                  marginTop: '1.5rem', transition: 'gap 0.3s',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.gap = '0.75rem')}
                onMouseLeave={e => (e.currentTarget.style.gap = '0.5rem')}
                >
                  Book Now <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
