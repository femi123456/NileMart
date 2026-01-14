"use client";

import React from 'react';
import { signOut } from 'next-auth/react';
import styles from './page.module.css';

export default function SettingsView({ session }) {
    return (
        <div className={styles.settingsContainer}>
            <h2 className={styles.sectionTitle}>Settings</h2>

            <div className={styles.settingsSection}>
                <h3><i className="ri-user-settings-line"></i> Profile Information</h3>
                <div className={styles.formGroup}>
                    <label>Display Name</label>
                    <input
                        type="text"
                        className={styles.formInput}
                        defaultValue={session?.user?.name}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <input
                        type="email"
                        className={styles.formInput}
                        defaultValue={session?.user?.email}
                        disabled
                    />
                    <p style={{ fontSize: '12px', color: '#8e8e93', marginTop: '4px' }}>
                        Email cannot be changed for security reasons.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => alert('Profile updated!')}>
                    Save Changes
                </button>
            </div>

            <div className={styles.settingsSection}>
                <h3><i className="ri-building-4-line"></i> Campus Details</h3>
                <div className={styles.formGroup}>
                    <label>Main Campus</label>
                    <input
                        type="text"
                        className={styles.formInput}
                        placeholder="e.g. University of Lagos"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Hostel / Apartment</label>
                    <input
                        type="text"
                        className={styles.formInput}
                        placeholder="e.g. Jaja Hall"
                    />
                </div>
                <div className={styles.settingsRow}>
                    <div className={styles.settingsRowText}>
                        <strong>Verification Status</strong>
                        <p>Verify your student ID for higher trust scores.</p>
                    </div>
                    <span className={styles.badge_verified}>Verified Student</span>
                </div>
            </div>

            <div className={styles.settingsSection}>
                <h3><i className="ri-notification-3-line"></i> Notifications</h3>
                <div className={styles.settingsRow}>
                    <div className={styles.settingsRowText}>
                        <strong>Order Updates</strong>
                        <p>Receive alerts when your order status changes.</p>
                    </div>
                    <input type="checkbox" defaultChecked />
                </div>
                <div className={styles.settingsRow}>
                    <div className={styles.settingsRowText}>
                        <strong>Chat Messages</strong>
                        <p>Get notified when a buyer or seller messages you.</p>
                    </div>
                    <input type="checkbox" defaultChecked />
                </div>
            </div>

            <div className={styles.settingsSection} style={{ borderColor: '#ffa39e', background: '#fff5f5' }}>
                <h3 style={{ color: '#ff4d4f' }}><i className="ri-error-warning-line"></i> Danger Zone</h3>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>Once you delete your account, there is no going back. Please be certain.</p>
                <button className="btn btn-danger" onClick={() => alert('Coming soon!')} style={{ background: '#ff4d4f' }}>
                    Delete Account
                </button>
            </div>
        </div>
    );
}
