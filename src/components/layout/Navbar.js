"use client";

import styles from './Navbar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { useWallet } from '@/context/WalletContext';

const Navbar = () => {
    const pathname = usePathname();
    const { cartCount } = useCart();
    const { data: session, status } = useSession();
    const { balance } = useWallet();

    const navLinks = [
        { name: 'Shop', path: '/shop' },
        { name: 'Sell', path: '/sell' },
        { name: status === 'authenticated' ? 'Messages' : '', path: status === 'authenticated' ? '/messages' : '' },
        { name: status === 'unauthenticated' ? 'Sign In' : '', path: status === 'unauthenticated' ? '/login' : '' },
    ].filter(link => link.name !== '');

    const userInitial = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U';

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
                    {status === 'authenticated' && (
                        <Link href="/profile" className={`${styles.navLink} ${styles.avatarLink} ${pathname === '/profile' ? styles.active : ''}`}>
                            <div className={styles.avatarCircle}>
                                {userInitial}
                            </div>
                        </Link>
                    )}
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
