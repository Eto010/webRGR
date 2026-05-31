import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [status, setStatus] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/health/')
      .then(res => setStatus(res.data.status))
      .catch(err => console.error(err));
  }, []);

  return <div>Backend status: {status}</div>;
}

export default App;