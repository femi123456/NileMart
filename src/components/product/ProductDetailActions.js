"use client";

import styles from '@/app/shop/[id]/page.module.css';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function ProductDetailActions({ product }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className={styles.actions}>
            <Button
                className={styles.addToCart}
                variant="primary"
                onClick={handleAdd}
            >
                {added ? "Added to Bag" : "Add to Cart"}
            </Button>
            <Button variant="secondary">Contact Seller</Button>
        </div>
    );
}
