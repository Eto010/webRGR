import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/token/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/');
    } catch (err) {
      setError('Неверное имя пользователя или пароль');
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#141414'
    }}>
      <div style={{
        background: 'rgba(20,20,20,0.9)',
        padding: '40px',
        borderRadius: '20px',
        width: '400px'
      }}>
        <h1 style={{ marginBottom: '20px' }}>Вход</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              borderRadius: '10px',
              border: 'none',
              background: '#F4F6FB',
              fontSize: '16px'
            }}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              borderRadius: '10px',
              border: 'none',
              background: '#F4F6FB',
              fontSize: '16px'
            }}
          />
          {error && <p style={{ color: '#E93D5C', marginBottom: '15px' }}>{error}</p>}
          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            background: '#1E22AA',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>Войти</button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Нет аккаунта? <a href="/register" style={{ color: '#1E22AA' }}>Зарегистрироваться</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
