import { useEffect } from 'react';
import { EVENTS, trackOnce } from './analytics/analytics.js';
import { isAnalyticsPanelEnabled } from './analytics/config.js';
import { useCostCalculator } from './hooks/useCostCalculator.js';
import PrototypeBanner from './components/PrototypeBanner.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Benefits from './components/Benefits.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import CostCalculator from './components/CostCalculator.jsx';
import RoiScenario from './components/RoiScenario.jsx';
import InquiryForm from './components/InquiryForm.jsx';
import Faq from './components/Faq.jsx';
import Footer from './components/Footer.jsx';
import AnalyticsPanel from './components/AnalyticsPanel.jsx';

const showAnalyticsPanel = isAnalyticsPanelEnabled();

export default function App() {
  // Calculator state is lifted here so the ROI scenario can read the same total.
  const calculator = useCostCalculator();

  useEffect(() => {
    // trackOnce guards against React StrictMode's double-invoked effects in dev.
    trackOnce(EVENTS.LANDING_PAGE_VIEW);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to main content
      </a>
      <PrototypeBanner />
      <Navbar />
      <main id="main">
        <Hero />
        <Benefits />
        <HowItWorks />
        <CostCalculator calculator={calculator} />
        <RoiScenario totalCost={calculator.results ? calculator.results.totalCost : null} />
        <InquiryForm />
        <Faq />
      </main>
      <Footer />
      {showAnalyticsPanel && <AnalyticsPanel />}
    </>
  );
}
