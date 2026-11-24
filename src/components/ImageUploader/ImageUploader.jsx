import { useId, useRef, useState } from 'react';
import './ImageUploader.css';

const MAX_DIMENSION = 1400;
const MAX_DATA_URL_LENGTH = 400000;

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function prepareImage(file) {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const longestSide = Math.max(image.width, image.height);
  const scale = Math.min(1, MAX_DIMENSION / longestSide);

  if (scale >= 1 && dataUrl.length <= MAX_DATA_URL_LENGTH) {
    return dataUrl;
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext('2d');
  if (!context) return dataUrl;

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL('image/jpeg', 0.85);
}

function ImageUploader({ images = [], onChange }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const addFiles = async (fileList) => {
    const files = Array.from(fileList ?? []).filter((file) =>
      file.type.startsWith('image/')
    );

    if (files.length === 0) {
      setError('Please choose image files.');
      return;
    }

    const results = await Promise.allSettled(files.map(prepareImage));
    const dataUrls = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);
    const failedCount = results.length - dataUrls.length;

    if (dataUrls.length === 0) {
      setError('The selected images could not be loaded.');
      return;
    }

    setError(
      failedCount > 0
        ? `${failedCount} image${failedCount === 1 ? '' : 's'} could not be loaded.`
        : ''
    );
    onChange([...images, ...dataUrls]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const handleRemove = (index) => {
    onChange(images.filter((_, imageIndex) => imageIndex !== index));
  };

  return (
    <div className="imageUploader">
      <div
        className={`imageDropzone${dragging ? ' is-dragging' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Add recipe images by dragging and dropping, or choose files"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <span className="imageDropzoneText">
          Drag &amp; drop images here, or click to choose files
        </span>
      </div>

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = '';
        }}
      />

      {error && <p className="imageUploaderError">{error}</p>}

      {images.length > 0 && (
        <ul className="imagePreviewList">
          {images.map((src, index) => (
            <li
              className="imagePreview"
              key={`${index}-${String(src).slice(0, 24)}`}
            >
              <img src={src} alt={`Recipe image ${index + 1}`} />
              <button
                type="button"
                className="imagePreviewRemove"
                onClick={() => handleRemove(index)}
                aria-label={`Remove image ${index + 1}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ImageUploader;
