// src/pages/ProfilePage.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import { selectUser, selectToken } from '../store/slices/authSlice.js';
import ProfilePictureUpload from '../components/ProfilePictureUpload.jsx';
import ResumeUpload from '../components/ResumeUpload.jsx';

// ─── Zod Schema ───
const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    bio: z.string().max(500, 'Bio too long').optional(),
    location: z.string().optional(),
    skills: z.string().optional(),
    github: z.string().url('Invalid URL').optional().or(z.literal('')),
    linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
    portfolio: z.string().url('Invalid URL').optional().or(z.literal('')),
});

function ProfilePage() {
    const user = useAppSelector(selectUser);
    const token = useAppSelector(selectToken);

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    const [avatar, setAvatar] = useState(user?.profilePicture ?? '');
    const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl ?? '');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name ?? '',
            bio: user?.bio ?? '',
            location: user?.location ?? '',
            skills: user?.skills?.join(', ') ?? '',
            github: user?.github ?? '',
            linkedin: user?.linkedin ?? '',
            portfolio: user?.portfolio ?? '',
        },
    });

    const onSubmit = async (data) => {
        try {
            setSaving(true);
            setError(null);

            const skillsArray = data.skills
                ? data.skills.split(',').map(s => s.trim()).filter(Boolean)
                : [];

            const res = await fetch('http://localhost:3000/api/auth/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...data, skills: skillsArray }),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);

        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const inputStyle = (hasError) => ({
        width: '100%',
        padding: '10px 12px',
        border: `1px solid ${hasError ? '#fca5a5' : '#e5e7eb'}`,
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        marginBottom: hasError ? '4px' : '16px',
    });

    const labelStyle = {
        display: 'block',
        marginBottom: '6px',
        fontWeight: '600',
        fontSize: '14px',
        color: '#374151',
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 16px' }}>

                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                    👤 My Profile
                </h1>
                <p style={{ color: '#6b7280', marginBottom: '32px' }}>
                    Update your profile information and upload documents
                </p>

                {/* ─── Profile Picture Card ─── */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '28px',
                    marginBottom: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>
                        Profile Picture
                    </h2>
                    <ProfilePictureUpload
                        currentImage={avatar}
                        userName={user?.name}
                        onUploadSuccess={(url) => setAvatar(url)}
                    />
                </div>

                {/* ─── Resume Card ─── */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '28px',
                    marginBottom: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>
                        Resume / CV
                    </h2>
                    <ResumeUpload
                        currentResumeUrl={resumeUrl}
                        onUploadSuccess={(url) => setResumeUrl(url)}
                    />
                </div>

                {/* ─── Profile Info Form ─── */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '28px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>
                        Profile Information
                    </h2>

                    {/* Success */}
                    {saved && (
                        <div style={{
                            background: '#dcfce7', border: '1px solid #bbf7d0',
                            borderRadius: '8px', padding: '12px', marginBottom: '16px',
                            color: '#15803d', fontWeight: '600', fontSize: '14px',
                        }}>
                            ✅ Profile updated successfully!
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div style={{
                            background: '#fee2e2', border: '1px solid #fca5a5',
                            borderRadius: '8px', padding: '12px', marginBottom: '16px',
                            color: '#dc2626', fontSize: '14px',
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>

                        {/* Name */}
                        <label style={labelStyle}>Full Name *</label>
                        <input
                            {...register('name')}
                            style={inputStyle(!!errors.name)}
                            placeholder="Alice Johnson"
                        />
                        {errors.name && (
                            <p style={{ color: '#dc2626', fontSize: '12px', marginBottom: '12px' }}>
                                ⚠️ {errors.name.message}
                            </p>
                        )}

                        {/* Bio */}
                        <label style={labelStyle}>Bio</label>
                        <textarea
                            {...register('bio')}
                            placeholder="Tell employers about yourself..."
                            rows={4}
                            style={{
                                ...inputStyle(!!errors.bio),
                                resize: 'vertical',
                            }}
                        />
                        {errors.bio && (
                            <p style={{ color: '#dc2626', fontSize: '12px', marginBottom: '12px' }}>
                                ⚠️ {errors.bio.message}
                            </p>
                        )}

                        {/* Location */}
                        <label style={labelStyle}>Location</label>
                        <input
                            {...register('location')}
                            style={inputStyle(false)}
                            placeholder="Hyderabad, Telangana"
                        />

                        {/* Skills */}
                        <label style={labelStyle}>Skills</label>
                        <input
                            {...register('skills')}
                            style={inputStyle(false)}
                            placeholder="React, Node.js, MongoDB (comma separated)"
                        />

                        {/* Social Links */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>GitHub URL</label>
                                <input
                                    {...register('github')}
                                    style={inputStyle(!!errors.github)}
                                    placeholder="https://github.com/username"
                                />
                                {errors.github && (
                                    <p style={{ color: '#dc2626', fontSize: '12px', marginBottom: '12px' }}>
                                        ⚠️ {errors.github.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label style={labelStyle}>LinkedIn URL</label>
                                <input
                                    {...register('linkedin')}
                                    style={inputStyle(!!errors.linkedin)}
                                    placeholder="https://linkedin.com/in/username"
                                />
                                {errors.linkedin && (
                                    <p style={{ color: '#dc2626', fontSize: '12px', marginBottom: '12px' }}>
                                        ⚠️ {errors.linkedin.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Portfolio */}
                        <label style={labelStyle}>Portfolio URL</label>
                        <input
                            {...register('portfolio')}
                            style={inputStyle(!!errors.portfolio)}
                            placeholder="https://yourportfolio.com"
                        />
                        {errors.portfolio && (
                            <p style={{ color: '#dc2626', fontSize: '12px', marginBottom: '12px' }}>
                                ⚠️ {errors.portfolio.message}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: saving ? '#93c5fd' : '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                marginTop: '8px',
                            }}
                        >
                            {saving ? '⏳ Saving...' : '💾 Save Profile'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;