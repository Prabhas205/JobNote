// src/components/ProfilePictureUpload.jsx
import { useState, useRef } from 'react';
import { useAppDispatch } from '../store/hooks.js';
import { uploadService } from '../services/uploadService.js';

function ProfilePictureUpload({ currentImage, userName, onUploadSuccess }) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState(currentImage);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // ─── Client-side validation ───
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        // ─── Show preview immediately ───
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);
        // ↑ show local preview before upload completes

        // ─── Upload to Cloudinary ───
        try {
            setUploading(true);
            setError(null);
            setProgress(0);

            const data = await uploadService.uploadProfilePicture(
                file,
                (percent) => setProgress(percent)
                // ↑ progress callback
            );

            setPreview(data.profilePicture);
            onUploadSuccess?.(data.profilePicture);
            // ↑ notify parent component

        } catch (err) {
            setError(err.message);
            setPreview(currentImage);
            // revert preview on error
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>

            {/* Avatar */}
            <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    position: 'relative',
                    border: '3px solid #e5e7eb',
                    background: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt="Profile"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <span style={{
                        fontSize: '48px',
                        fontWeight: 'bold',
                        color: 'white',
                        background: '#2563eb',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {userName?.charAt(0).toUpperCase()}
                    </span>
                )}

                {/* Hover overlay */}
                {!uploading && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        borderRadius: '50%',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: 'bold',
                    }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0}
                    >
                        📷 Change
                    </div>
                )}

                {/* Upload Progress Overlay */}
                {uploading && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        color: 'white',
                    }}>
                        <span style={{ fontSize: '20px', marginBottom: '4px' }}>
                            {progress}%
                        </span>
                        <div style={{
                            width: '60px',
                            height: '4px',
                            background: 'rgba(255,255,255,0.3)',
                            borderRadius: '2px',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                width: `${progress}%`,
                                height: '100%',
                                background: 'white',
                                transition: 'width 0.2s',
                                borderRadius: '2px',
                            }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Click to upload text */}
            <p style={{ fontSize: '12px', color: '#6b7280' }}>
                Click avatar to change • Max 5MB • JPG, PNG
            </p>

            {/* Error */}
            {error && (
                <p style={{ color: '#dc2626', fontSize: '13px', textAlign: 'center' }}>
                    ⚠️ {error}
                </p>
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
        </div>
    );
}

export default ProfilePictureUpload;