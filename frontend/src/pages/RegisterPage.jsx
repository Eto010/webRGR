import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register/', {
  username,
  email,
  first_name: firstName,
  last_name: lastName,
  password,
  password2: password,
});
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка регистрации');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 500, marginTop: 50 }}>
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="text" placeholder="Имя пользователя" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="text" placeholder="Имя" value={firstName} onChange={e => setFirstName(e.target.value)} required />
        <input type="text" placeholder="Фамилия" value={lastName} onChange={e => setLastName(e.target.value)} required />
        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className="btn">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default RegisterPage;