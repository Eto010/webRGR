import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/videos/')
      .then(res => setVideos(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container">Загрузка...</div>;

  return (
    <div className="container">
      <h1 style={{ marginBottom: '30px' }}>Видеоплатформа</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {videos.map(video => (
          <Link to={`/video/${video.id}`} key={video.id} style={{ textDecoration: 'none', color: 'white' }}>
            <div style={{
              background: '#222222',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}>
              {video.thumbnail ? (
                <img
                  src={`http://localhost:8000${video.thumbnail}`}
                  alt={video.title}
                  style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '160px',
                  background: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999'
                }}>
                  Нет превью
                </div>
              )}
              <div style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{video.title}</h3>
                <p style={{ fontSize: '14px', color: '#999' }}>{video.views} просмотров</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;