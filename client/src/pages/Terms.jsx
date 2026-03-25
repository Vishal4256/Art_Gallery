import React from 'react';
import AnimatedPage from '../components/AnimatedPage';

const Terms = () => {
  return (
    <AnimatedPage>
      <div className="bg-[var(--bg-main)] min-h-screen pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-[var(--text-main)] transition-colors duration-500">
        <h1 className="text-6xl md:text-8xl font-serif mb-16 uppercase tracking-tighter leading-none">Terms of Service</h1>
        <div className="space-y-12 font-light leading-relaxed text-[var(--text-muted)]">
          <p className="text-xl italic">Welcome to Lumina Gallery. These terms and conditions outline the rules and regulations for the use of Lumina's Website.</p>
          
          <section>
            <h2 className="text-2xl font-serif text-[var(--text-main)] mb-6 uppercase tracking-widest border-b border-[var(--border-main)] pb-4">1. Intellectual Property</h2>
            <p className="text-lg">Other than the content you own, under these Terms, Lumina and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[var(--text-main)] mb-6 uppercase tracking-widest border-b border-[var(--border-main)] pb-4">2. Restrictions</h2>
            <p className="text-lg">You are specifically restricted from all of the following: publishing any Website material in any other media; selling, sublicensing and/or otherwise commercializing any Website material; publicly performing and/or showing any Website material.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[var(--text-main)] mb-6 uppercase tracking-widest border-b border-[var(--border-main)] pb-4">3. Reservation of Artwork</h2>
            <p className="text-lg">Reserving an artwork through this website does not constitute a final sale. Our gallery directors will contact you to finalize the acquisition process.</p>
          </section> 
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Terms;
