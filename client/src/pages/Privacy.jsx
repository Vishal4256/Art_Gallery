import React from 'react';
import AnimatedPage from '../components/AnimatedPage';

const Privacy = () => {
  return (
    <AnimatedPage>
      <div className="bg-[var(--bg-main)] min-h-screen pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-[var(--text-main)] transition-colors duration-500">
        <h1 className="text-6xl md:text-8xl font-serif mb-16 uppercase tracking-tighter leading-none">Privacy Policy</h1>
        <div className="space-y-12 font-light leading-relaxed text-[var(--text-muted)]">
          <p className="text-xl italic">At Lumina Gallery, we are committed to protecting your personal information and your right to privacy.</p>
          
          <section>
            <h2 className="text-2xl font-serif text-[var(--text-main)] mb-6 uppercase tracking-widest border-b border-[var(--border-main)] pb-4">1. Information We Collect</h2>
            <p className="text-lg">We collect personal information that you provide to us such as name, address, contact information, and payment details when you inquire about or purchase an artwork.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[var(--text-main)] mb-6 uppercase tracking-widest border-b border-[var(--border-main)] pb-4">2. How We Use Your Information</h2>
            <p className="text-lg">We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[var(--text-main)] mb-6 uppercase tracking-widest border-b border-[var(--border-main)] pb-4">3. Sharing Your Information</h2>
            <p className="text-lg">We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
          </section>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Privacy;
