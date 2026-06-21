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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
	try {
    	console.log('Отправка данных:', {  // ← добавить для отладки
      	username,
      	email,
      	first_name: firstName,
      	last_name: lastName,
      	password,
      	password2: password,
    	});
    
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
    	console.error('Ошибка:', err.response?.data);
    	setError('');
    	setLoading(true);
}
    // Валидация на клиенте
    if (!username || !email || !password || !firstName || !lastName) {
      setError('Все поля обязательны для заполнения');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/register/', {
        username,
        email,
        first_name: firstName,
        last_name: lastName,
        password,
        password2: password,
      });

      console.log('Регистрация успешна:', response.data);
      navigate('/login');
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      
      // Обработка ошибок от бэкенда
      if (err.response) {
        // Бэкенд ответил с ошибкой
        const data = err.response.data;
        if (typeof data === 'object') {
          // Собираем все сообщения об ошибках
          const messages = Object.values(data).flat();
          setError(messages.join(' '));
        } else if (typeof data === 'string') {
          setError(data);
        } else {
          setError('Ошибка регистрации. Проверьте введённые данные.');
        }
      } else if (err.request) {
        // Запрос был отправлен, но ответа нет
        setError('Сервер не отвечает. Проверьте подключение.');
      } else {
        setError('Произошла ошибка при отправке запроса.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 500, marginTop: 50 }}>
      <h1>Регистрация</h1>
      {error && (
        <div style={{ 
          background: '#ffdddd', 
          color: '#d32f2f', 
          padding: '10px', 
          borderRadius: '8px', 
          marginBottom: '15px' 
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Имя"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Фамилия"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength="6"
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
        </div>
        <button 
          type="submit" 
          className="btn" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: '#1E22AA', 
            color: 'white', 
            border: 'none', 
            borderRadius: '10px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
      <p style={{ marginTop: 20, textAlign: 'center' }}>
        Уже есть аккаунт? <a href="/login">Войти</a>
      </p>
    </div>
  );
};

export default RegisterPage;
