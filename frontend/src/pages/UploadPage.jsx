import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const UploadPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video_file', file);
    formData.append('thumbnail', thumbnail);

    setUploading(true);
    try {
      await api.post('/videos/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          setProgress(Math.round((event.loaded * 100) / event.total));
        }
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 600, marginTop: 50 }}>
      <h1>Загрузить видео</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Название" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea placeholder="Описание" rows="4" value={description} onChange={e => setDescription(e.target.value)} />
        <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} required />
        {uploading && <progress value={progress} max="100" style={{ width: '100%' }} />}
        <button type="submit" className="btn" disabled={uploading}>Загрузить</button>
      </form>
    </div>
  );
};

export default UploadPage;