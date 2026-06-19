export function HomePage() {
  return (
    <div className="min-h-screen bg-[#0b170f] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold text-[#C86A27] mb-4">Nature's Index</h1>
      <p className="text-white/70 max-w-md mb-8">
        Welcome to Nature's Index. We provide wildlife logging and digital passports for ecotourism destinations.
      </p>
      
      <a 
        href="/corcovado/guide" 
        className="bg-[#C86A27] text-white font-bold py-3 px-8 rounded-full hover:bg-[#b05a1f] transition-all"
      >
        Go to Guide Portal
      </a>
    </div>
  );
}
