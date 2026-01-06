"use client";

import styles from './page.module.css';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchUserProducts();
        }
    }, [status, router]);

    const fetchUserProducts = async () => {
        try {
            const res = await fetch('/api/products/user');
            const data = await res.json();
            if (res.ok) {
                setProducts(data);
            }
        } catch (err) {
            console.error('Failed to fetch user products');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) return null;

    return (
        <div className={`container ${styles.page}`}>
            <header className={styles.header}>
                <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                        {session?.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h1 className={styles.name}>{session?.user?.name}</h1>
                        <p className={styles.email}>{session?.user?.email}</p>
                    </div>
                </div>
                <button onClick={() => signOut()} className={styles.logoutBtn}>
                    Sign Out
                </button>
            </header>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>My Listings</h2>
                    <Link href="/sell" className="btn btn-primary btn-sm">List New Item</Link>
                </div>

                <div className={styles.listingsGrid}>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product._id} className={styles.listingRow}>
                                <div className={styles.listingImage}>
                                    <Image
                                        src={product.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200'}
                                        alt={product.title}
                                        fill
                                        className={styles.image}
                                    />
                                </div>
                                <div className={styles.listingInfo}>
                                    <h3 className={styles.listingTitle}>{product.title}</h3>
                                    <p className={styles.listingMeta}>{product.category} • ₦{product.price.toLocaleString()}</p>
                                </div>
                                <div className={styles.listingActions}>
                                    <Link href={`/shop/${product._id}`} className={styles.viewBtn}>View</Link>
                                    <button className={styles.deleteBtn}>Delete</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.empty}>
                            <p>You haven't listed any items yet.</p>
                            <Link href="/sell" className={styles.link}>Start selling today</Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
