import { useParams } from 'react-router-dom';

export function GuestPortal() {
  // This automatically grabs the location and tour ID from the URL!
  const { location, tourId } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#162b1d] text-white p-6 text-center">
      <h1 className="text-3xl font-black mb-4 font-serif">Guest Portal Sandbox</h1>
      <p className="text-xl mb-2">Location: <span className="text-[#C86A27]">{location}</span></p>
      <p className="text-xl">Tour ID: <span className="text-[#C86A27]">{tourId}</span></p>
      
      <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-2xl max-w-sm">
        <p className="text-white/50 text-sm">
          (This is where the Social Story download and the blurred Premium Passport checkout will go in Phase 3!)
        </p>
      </div>
    </div>
  );
}
