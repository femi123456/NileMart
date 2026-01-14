"use client";

import styles from './ProductCard.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { _id, id, title, price, category, image, seller } = product;
    const productId = _id || id;

    return (
        <div className={styles.card}>
            <Link href={`/shop/${productId}`} className={styles.imageLink}>
                <div className={styles.imageContainer}>
                    <Image
                        src={image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500'}
                        alt={title}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized={image?.startsWith('data:') || image?.includes('gstatic.com') || image?.includes('tbn:')}
                    />
                    <div className={styles.categoryBadge}>{category}</div>
                </div>
            </Link>

            <div className={styles.content}>
                <div className={styles.header}>
                    <Link href={`/shop/${productId}`} className={styles.titleLink}>
                        <h3 className={styles.title}>{title}</h3>
                    </Link>
                    <p className={styles.price}>₦{price.toLocaleString()}</p>
                </div>

                <p className={styles.seller}>By {seller || 'Verified Student'}</p>

                <button
                    className={`btn btn-primary ${styles.addButton}`}
                    onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                    }}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
