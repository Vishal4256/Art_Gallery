const exhibitions = [
  {
    title: 'Lumina Collective V.1',
    description: 'A curated selection of modern works exploring the synthesis of classical techniques and digital avant-garde. Featuring Elena Rostova and Marcus Vance.',
    startDate: new Date(Date.now() - 10 * 86400000), // Started 10 days ago
    endDate: new Date(Date.now() + 20 * 86400000),   // Ends in 20 days
    image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Urban Solitude',
    description: 'A solo photography exhibition by Sophia Lin, capturing the raw, brutal essence of concrete jungles through a melancholic lens.',
    startDate: new Date(Date.now() + 30 * 86400000), // Starts in 30 days
    endDate: new Date(Date.now() + 60 * 86400000),
    image: 'https://images.unsplash.com/photo-1518998053401-878c730e01e2?q=80&w=1200&auto=format&fit=crop'
  }
];

export default exhibitions;
