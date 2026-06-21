import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const UploadPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);  // ← ДОБАВИТЬ ЭТУ СТРОКУ
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert('Выберите видеофайл');
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video_file', videoFile);
    if (thumbnail) formData.append('thumbnail', thumbnail);  // ← теперь thumbnail существует

    setUploading(true);
    try {
      await api.post('/videos/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки видео');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '40px' }}>
      <h1>Загрузить видео</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Название видео"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <textarea
            placeholder="Описание"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Видеофайл (MP4, AVI и др.)</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Превью (необязательно)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}  // ← теперь работает
            style={{ width: '100%' }}
          />
        </div>
        {uploading && (
          <div style={{ marginBottom: '15px' }}>
            <progress value={progress} max="100" style={{ width: '100%' }} />
            <span> {progress}%</span>
          </div>
        )}
        <button type="submit" className="btn" disabled={uploading}>
          {uploading ? 'Загрузка...' : 'Загрузить'}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
