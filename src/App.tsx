import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GuidePortal } from './components/GuidePortal';
import { GuestPortal } from './components/GuestPortal';
import { HomePage } from './components/HomePage';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route 1: The Guide Portal (e.g., /corcovado/guide) */}
        <Route path="/:location/guide" element={<GuidePortal />} />

        {/* Route 2: The Guest Portal (e.g., /corcovado/tour/12345) */}
        <Route path="/:location/tour/:tourId" element={<GuestPortal />} />

       {/* The Main Landing Page (Nature's Index Home) */}
        <Route path="/" element={<HomePage />} />
        
        {/* Fallback Redirect for unknown URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
