"use client";

import styles from './page.module.css';
import { useCart } from '@/context/CartContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const { data: session } = useSession();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (cart.length === 0 && !isSuccess) {
            router.push('/cart');
        }
    }, [cart, isSuccess, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const formData = new FormData(e.target);
        const orderData = {
            items: cart.map(item => ({
                productId: item.id,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            total: cartTotal,
            buyerId: session?.user?.email || 'guest_user',
            shippingAddress: {
                fullName: formData.get('fullName'),
                address: formData.get('address'),
                city: formData.get('city'),
                zipCode: formData.get('zipCode'),
            }
        };

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (!res.ok) throw new Error('Order failed');

            setIsSuccess(true);
            clearCart();
        } catch (error) {
            alert('Something went wrong. Please try again.');
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
                <div style={{ marginBottom: '24px' }}>
                    <i className="ri-checkbox-circle-line" style={{ fontSize: '72px', color: 'var(--success)' }}></i>
                </div>
                <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>Order Confirmed!</h1>
                <p style={{ color: 'var(--gray-500)', maxWidth: '480px', margin: '0 auto 32px' }}>
                    Your order details have been finalized. A confirmation email has been sent to your university account.
                </p>
                <Link href="/shop">
                    <Button variant="primary">Return to Shop</Button>
                </Link>
            </div>
        );
    }

    if (cart.length === 0) return null;

    return (
        <div className="container">
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)' }}>Checkout</h1>
            </header>

            <form id="checkoutForm" onSubmit={handleSubmit}>
                <div className={styles.layout}>
                    <div className={styles.mainCol}>
                        <Card title="Shipping Address" subtitle="Where should we send your items?">
                            <div className={styles.formGrid}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <Input label="Full Recipient Name" name="fullName" placeholder="John Doe" required />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <Input label="Shipping Address" name="address" placeholder="123 Campus Road" required />
                                </div>
                                <Input label="City Cluster" name="city" placeholder="University City" required />
                                <Input label="Zip/Postal Code" name="zipCode" placeholder="10001" required />
                            </div>
                        </Card>

                        <Card title="Payment Method" subtitle="Secure transaction gateway">
                            <div className={styles.formGrid}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <Input label="Card Identifier" placeholder="0000 0000 0000 0000" disabled value="**** **** **** 4242 (Mock)" />
                                </div>
                                <Input label="Expiration Sequence" placeholder="MM/YY" disabled value="12/28" />
                                <Input label="Security Token (CVC)" placeholder="123" disabled value="***" />
                            </div>
                        </Card>
                    </div>

                    <div className={styles.sideCol}>
                        <Card title="Order Summary">
                            <div className={styles.itemsList}>
                                {cart.map(item => (
                                    <div key={item.id} className={styles.itemRow}>
                                        <div className={styles.itemInfo}>
                                            <span className={styles.itemName}>{item.title}</span>
                                            <span className={styles.itemMeta}>QTY: {item.quantity}</span>
                                        </div>
                                        <span className={styles.itemPrice}>₦{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>₦{cartTotal.toLocaleString()}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Delivery</span>
                                <span style={{ color: 'var(--green-600)' }}>Free</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span>Total Est.</span>
                                <span>₦{cartTotal.toLocaleString()}</span>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                style={{ width: '100%', marginTop: '24px' }}
                                disabled={isProcessing}
                                loading={isProcessing}
                            >
                                Confirm Order
                            </Button>
                        </Card>

                        <div className={styles.securitySeal}>
                            <i className="ri-shield-check-line"></i>
                            <div>
                                <strong>Secured via Student-Net</strong>
                                <p>Encrypted peer-to-peer transaction protocol.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
