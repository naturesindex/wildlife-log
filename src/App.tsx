import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GuidePortal } from './components/GuidePortal';
import { GuestPortal } from './components/GuestPortal';
import { HomePage } from './components/HomePage';
import { PreviewPage } from './components/PreviewPage';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route 1: The Guide Portal (e.g., /corcovado/guide) */}
        <Route path="/:location/guide" element={<GuidePortal />} />

        {/* Route 1b: Location-less entry point from the homepage button.
            Shows the login screen, then GuidePortal redirects to the
            guide's real /:location/guide once Supabase confirms who they are. */}
        <Route path="/guide" element={<GuidePortal />} />
        

{/* Route 2: The Guest Portal (Direct Link from Guide) */}
        <Route path="/tour/:tourId" element={<GuestPortal />} />

        {/* The New Preview Page */}
        <Route path="/preview" element={<PreviewPage />} />

       {/* The Main Landing Page (Nature's Index Home) */}
        <Route path="/" element={<HomePage />} />
        
        {/* Fallback Redirect for unknown URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
