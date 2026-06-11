import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AttendeePage } from './pages/AttendeePage';
import { ControlRoomPage } from './pages/ControlRoomPage';

const App = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<AttendeePage />} />
      <Route path="/control-room" element={<ControlRoomPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </HashRouter>
);

export default App;
