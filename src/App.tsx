import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GuidePortal } from './components/GuidePortal';
import { GuestPortal } from './components/GuestPortal';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route 1: The Guide Portal (e.g., /corcovado/guide) */}
        <Route path="/:location/guide" element={<GuidePortal />} />

        {/* Route 2: The Guest Portal (e.g., /corcovado/tour/12345) */}
        <Route path="/:location/tour/:tourId" element={<GuestPortal />} />

        {/* Temporary Redirect: If someone just goes to natures-index.com, send them to Corcovado for now */}
        <Route path="*" element={<Navigate to="/corcovado/guide" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
