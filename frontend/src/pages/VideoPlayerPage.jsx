import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const VideoPlayerPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/videos/${id}/`)
      .then(res => setVideo(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container">Загрузка...</div>;
  if (!video) return <div className="container">Видео не найдено</div>;

  const streamUrl = `http://localhost:8000/api/videos/stream/${id}/`;

  return (
    <div className="container" style={{ maxWidth: 1000, margin: '40px auto' }}>
      <video src={streamUrl} controls autoPlay style={{ width: '100%', borderRadius: 12 }} />
      <h2 style={{ marginTop: 20 }}>{video.title}</h2>
      <p>{video.description}</p>
      <p>Просмотров: {video.views}</p>
    </div>
  );
};

export default VideoPlayerPage;