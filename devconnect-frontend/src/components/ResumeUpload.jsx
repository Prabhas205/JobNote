// src/components/ResumeUpload.jsx
import { useState, useRef } from 'react';
import { uploadService } from '../services/uploadService.js';

function ResumeUpload({ currentResumeUrl, onUploadSuccess }) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resumeUrl, setResumeUrl] = useState(currentResumeUrl);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate
        if (file.type !== 'application/pdf') {
            setError('Only PDF files are allowed');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError('Resume must be less than 10MB');
            return;
        }

        try {
            setUploading(true);
            setError(null);
            setSuccess(false);
            setProgress(0);

            const data = await uploadService.uploadResume(
                file,
                (percent) => setProgress(percent)
            );

            setResumeUrl(data.resumeUrl);
            setSuccess(true);
            onUploadSuccess?.(data.resumeUrl);

            // Hide success after 3 seconds
            setTimeout(() => setSuccess(false), 3000);

        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <div style={{
            border: '2px dashed #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            background: '#f9fafb',
        }}>
            <p style={{ fontSize: '32px', marginBottom: '8px' }}>📄</p>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                Resume / CV
            </h3>

            {/* Current Resume */}
            {resumeUrl && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    padding: '8px 12px',
                    background: 'white',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                }}>
                    <span>📎</span>
                    <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#2563eb', fontSize: '13px', fontWeight: '600' }}
                    >
                        View Current Resume
                    </a>
                </div>
            )}

            {/* Progress Bar */}
            {uploading && (
                <div style={{ marginBottom: '12px' }}>
                    <div style={{
                        width: '100%',
                        height: '8px',
                        background: '#e5e7eb',
                        borderRadius: '4px',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: '#2563eb',
                            transition: 'width 0.3s ease',
                            borderRadius: '4px',
                        }} />
                    </div>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        Uploading... {progress}%
                    </p>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    marginBottom: '12px',
                    fontWeight: '600',
                }}>
                    ✅ Resume uploaded successfully!
                </div>
            )}

            {/* Error */}
            {error && (
                <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>
                    ⚠️ {error}
                </p>
            )}

{/* Upload Button */ }
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        style={{
          padding:      '10px 20px',
          background:   uploading ? '#93c5fd' : '#2563eb',
          color:        'white',
          border:       'none',
          borderRadius: '8px',
          cursor:       uploading ? 'not-allowed' : 'pointer',
          fontWeight:   'bold',
          fontSize:     '14px',
        }}
      >
        {uploading
          ? `⏳ Uploading ${progress}%`
          : resumeUrl
            ? '🔄 Replace Resume'
            : '📤 Upload Resume PDF'
        }
      </button>

      <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>
        PDF only • Max 10MB
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div >
  );
}

export default ResumeUpload;