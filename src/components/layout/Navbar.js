"use client";

import styles from './Navbar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';

const Navbar = () => {
    const pathname = usePathname();
    const { cartCount } = useCart();
    const { status } = useSession();

    const navLinks = [
        { name: 'Shop', path: '/shop' },
        { name: 'Sell', path: '/sell' },
        { name: status === 'authenticated' ? 'Messages' : '', path: status === 'authenticated' ? '/messages' : '' },
        { name: status === 'authenticated' ? 'Profile' : 'Sign In', path: status === 'authenticated' ? '/profile' : '/login' },
    ].filter(link => link.name !== '');

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navInner}`}>
                <Link href="/" className={styles.bridge}>
                    <span className={styles.logoText}>Nile Mart</span>
                </Link>

                <div className={styles.links}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            className={`${styles.navLink} ${pathname === link.path ? styles.active : ''}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/cart" className={styles.cartIcon}>
                        <i className="ri-shopping-bag-line"></i>
                        {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
