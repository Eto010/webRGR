import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import VideoPlayerPage from './pages/VideoPlayerPage';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/video/:id" element={<VideoPlayerPage />} />
        <Route path="/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;