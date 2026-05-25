// src/components/NotificationBell.jsx
import { useState } from 'react';
import { useSocket } from '../context/SocketContext.jsx';
import { Link } from 'react-router-dom';

function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotification,
    } = useSocket();

    return (
        <div style={{ position: 'relative' }}>

            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'relative',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                🔔

                {/* Unread badge */}
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        background: '#dc2626',
                        color: 'white',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => setIsOpen(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 99,
                        }}
                    />

                    {/* Notification Panel */}
                    <div style={{
                        position: 'absolute',
                        top: '48px',
                        right: 0,
                        width: '360px',
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        border: '1px solid #e5e7eb',
                        zIndex: 100,
                        overflow: 'hidden',
                        maxHeight: '480px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>

                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            borderBottom: '1px solid #f3f4f6',
                            background: '#f9fafb',
                        }}>
                            <h3 style={{ fontSize: '15px', fontWeight: 'bold' }}>
                                🔔 Notifications
                                {unreadCount > 0 && (
                                    <span style={{
                                        marginLeft: '8px',
                                        background: '#dc2626',
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '10px',
                                        fontSize: '12px',
                                    }}>
                                        {unreadCount} new
                                    </span>
                                )}
                            </h3>

                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#2563eb',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                    }}
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div style={{ overflowY: 'auto', flex: 1 }}>
                            {notifications.length === 0 ? (
                                <div style={{
                                    padding: '40px 24px',
                                    textAlign: 'center',
                                    color: '#9ca3af',
                                }}>
                                    <p style={{ fontSize: '32px', marginBottom: '8px' }}>📭</p>
                                    <p style={{ fontSize: '14px' }}>No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map(notif => (
                                    <div
                                        key={notif.id}
                                        style={{
                                            display: 'flex',
                                            gap: '12px',
                                            padding: '14px 16px',
                                            borderBottom: '1px solid #f9fafb',
                                            background: notif.read ? 'white' : '#eff6ff',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s',
                                        }}
                                        onClick={() => markAsRead(notif.id)}
                                    >
                                        {/* Icon */}
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: notif.type === 'NEW_APPLICATION'
                                                ? '#dcfce7' : '#dbeafe',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '16px',
                                            flexShrink: 0,
                                        }}>
                                            {notif.type === 'NEW_APPLICATION' ? '📋' : '💼'}
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{
                                                fontSize: '13px',
                                                fontWeight: notif.read ? 'normal' : 'bold',
                                                marginBottom: '4px',
                                                color: '#111827',
                                            }}>
                                                {notif.message}
                                            </p>
                                            <p style={{ fontSize: '11px', color: '#9ca3af' }}>
                                                {new Date(notif.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>

                                        {/* Delete button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                clearNotification(notif.id);
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#9ca3af',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                padding: '0',
                                                alignSelf: 'flex-start',
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div style={{
                                padding: '12px 16px',
                                borderTop: '1px solid #f3f4f6',
                                textAlign: 'center',
                            }}>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        color: '#2563eb',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                    }}
                                >
                                    View Dashboard →
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default NotificationBell;