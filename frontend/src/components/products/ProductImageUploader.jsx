import { useState } from 'react';
import Icon from '../ui/Icon';
import { uploadProductImage } from '../../services/api';

export default function ProductImageUploader({
  imagePath,
  onChange,
  onError,
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    onError('');
    try {
      const res = await uploadProductImage(file);
      onChange(res.url);
    } catch (err) {
      onError(err.message || 'Failed to upload product image.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="form-group">
      <label>Product Image</label>
      <div className="prod-image-uploader">
        {imagePath ? (
          <div className="prod-image-preview-wrap">
            <img src={imagePath} alt="Preview" className="prod-image-preview" />
            <div className="prod-image-actions">
              <span className="prod-image-filename">Uploaded</span>
              <button
                type="button"
                className="btn-text-danger"
                onClick={() => onChange('')}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="prod-image-dropzone">
            <input
              type="file"
              id="prod-image-input"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFile}
              disabled={uploading}
            />
            <label htmlFor="prod-image-input" className="prod-image-drop-label">
              <Icon name="plus" size={16} />
              <span>
                {uploading
                  ? 'Uploading image...'
                  : 'Click to upload image (PNG, JPG, WebP)'}
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
