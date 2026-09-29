import React, { useState } from "react";
import { Upload, Trash2, Plus, Image as ImageIcon, AlertCircle } from "lucide-react";
import Button from "../ui/Button";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;

const ImagesUploading = ({ field }) => {
  const [imageInput, setImageInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [uploadingIdx, setUploadingIdx] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUrlError("Only JPEG, PNG, WEBP, or GIF images are accepted");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setUrlError(`File size must be under ${MAX_SIZE_MB}MB`);
      return;
    }

    setUrlError("");
    const newIdx = field.state.value.length;
    setUploadingIdx(newIdx);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const newImage = {
        public_id: `file_${Date.now()}`,
        url: ev.target.result,
      };
      field.handleChange([...field.state.value, newImage]);
      setUploadingIdx(null);
    };
    reader.readAsDataURL(file);
    // Reset so same file can be re-selected
    e.target.value = "";
  };

  const handleAddUrl = () => {
    const trimmed = imageInput.trim();
    if (!trimmed) return;
    setUrlError("");
    const newImage = {
      public_id: `url_${Date.now()}`,
      url: trimmed,
    };
    field.handleChange([...field.state.value, newImage]);
    setImageInput("");
  };

  const handleDeleteImage = (index) => {
    const updated = [...field.state.value];
    updated.splice(index, 1);
    field.handleChange(updated);
  };

  const images = Array.isArray(field.state.value) ? field.state.value : [];

  return (
    <div className="accf-photos-section">
      {/* Drop zone / file input */}
      <label className="accf-dropzone" htmlFor="photo_file_upload">
        <Upload size={28} className="accf-dropzone-icon" />
        <span className="accf-dropzone-text">Click to upload a photo</span>
        <span className="accf-dropzone-hint">JPEG · PNG · WEBP · GIF — max {MAX_SIZE_MB}MB per file</span>
        <input
          id="photo_file_upload"
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="accf-hidden-file"
          onChange={handleFileChange}
        />
      </label>

      {/* URL entry row */}
      <div className="accf-url-row">
        <input
          className="accf-input"
          type="text"
          placeholder="Or paste a public image URL (.jpg, .png, .webp)"
          value={imageInput}
          onChange={(e) => {
            setImageInput(e.target.value);
            setUrlError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddUrl();
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleAddUrl}
          isDisabled={!imageInput.trim()}
          style={{ flexShrink: 0 }}
        >
          <Plus size={16} /> Add URL
        </Button>
      </div>

      {/* Error message */}
      {urlError && (
        <div className="accf-upload-error">
          <AlertCircle size={14} />
          <span>{urlError}</span>
        </div>
      )}

      {/* Thumbnail grid */}
      {images.length > 0 && (
        <div className="accf-thumb-grid">
          {images.map((img, idx) => (
            <div key={img.public_id || idx} className="accf-thumb-item">
              {uploadingIdx === idx ? (
                <div className="accf-thumb-uploading">
                  <Upload size={20} className="spinning-sparkle" />
                </div>
              ) : (
                <img
                  src={img.url}
                  alt={`Property photo ${idx + 1}`}
                  className="accf-thumb-img"
                />
              )}
              <button
                type="button"
                className="accf-thumb-delete"
                onClick={() => handleDeleteImage(idx)}
                aria-label={`Remove photo ${idx + 1}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {/* Add more button at end of grid */}
          <label className="accf-thumb-add" htmlFor="photo_file_upload_more">
            <ImageIcon size={20} />
            <span>Add more</span>
            <input
              id="photo_file_upload_more"
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              className="accf-hidden-file"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}

      <p className="accf-photos-count">
        {images.length} {images.length === 1 ? "photo" : "photos"} added
        {images.length < 3 && " — at least 3 recommended"}
      </p>
    </div>
  );
};

export default ImagesUploading;
