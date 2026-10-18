import Button from './Button.jsx';
import HeroSchedule from './HeroSchedule.jsx';

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="on-navy relative overflow-hidden bg-navy-900 text-white">
      {/* Fine grid texture: a nod to schedules and planning, kept very faint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 85%)',
        }}
      />
      <div className="container-page relative grid items-center gap-12 pb-20 pt-14 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:pb-28">
        <div className="lg:col-span-6">
          <p className="mb-6 inline-flex items-center gap-2.5 text-sm font-medium text-accent-light">
            <span aria-hidden="true" className="h-px w-8 bg-accent-light" />
            Employer Partnership Program
          </p>
          <h1
            id="hero-title"
            className="text-[2.6rem] font-bold leading-[1.04] tracking-[-0.025em] sm:text-6xl lg:text-[3.6rem]"
            style={{ textWrap: 'balance' }}
          >
            Build Your Future Workforce. Starting With Student Talent.
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-white/75 sm:text-xl">
            Explore a degree-connected apprenticeship model that helps employers engage emerging talent while students
            gain meaningful, practical experience.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="#benefits" variant="light" ctaId="explore_benefits" ctaLocation="hero">
              Explore Employer Benefits
            </Button>
            <Button href="#calculator" variant="outlineLight" ctaId="estimate_costs" ctaLocation="hero">
              Estimate Your Costs
            </Button>
          </div>
        </div>
        <div className="lg:col-span-6 lg:pl-6">
          <HeroSchedule />
        </div>
      </div>
    </section>
  );
}
