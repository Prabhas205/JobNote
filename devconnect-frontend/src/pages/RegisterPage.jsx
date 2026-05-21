// src/pages/RegisterPage.jsx — use Redux form
import { Link } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm.jsx';

function RegisterPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '40px',
                width: '100%',
                maxWidth: '460px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
                            🚀 DevConnect
                        </h1>
                    </Link>
                    <p style={{ color: '#6b7280', marginTop: '8px' }}>
                        Create your account today
                    </p>
                </div>

                <RegisterForm />

                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6b7280' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#2563eb', fontWeight: 'bold' }}>
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;