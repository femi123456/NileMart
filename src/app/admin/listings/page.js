import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import styles from "../admin.module.css";
import Image from "next/image";

export const dynamic = 'force-dynamic';

async function getListings(statusFilter) {
    await dbConnect();
    const filter = {};
    if (statusFilter && statusFilter !== 'all') {
        if (statusFilter === 'reported') {
            filter.reportsCount = { $gt: 0 };
        } else {
            filter.status = statusFilter;
        }
    }
    return await Product.find(filter).sort({ reportsCount: -1, createdAt: -1 }).lean();
}

export default async function ListingsManager({ searchParams }) {
    const { status = 'all' } = await searchParams;
    const listings = await getListings(status);

    return (
        <div>
            <div className={styles.header}>
                <h1>Listings Manager</h1>
                <p>Approve, review, or delete product listings</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <a href="/admin/listings?status=all" className={`${styles.actionBtn} ${status === 'all' ? styles.activeNavLink : ''}`}>All</a>
                <a href="/admin/listings?status=pending_review" className={`${styles.actionBtn} ${status === 'pending_review' ? styles.activeNavLink : ''}`}>Pending Review</a>
                <a href="/admin/listings?status=reported" className={`${styles.actionBtn} ${status === 'reported' ? styles.activeNavLink : ''}`}>Reported</a>
                <a href="/admin/listings?status=deleted" className={`${styles.actionBtn} ${status === 'deleted' ? styles.activeNavLink : ''}`}>Deleted</a>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Image</th>
                            <th className={styles.th}>Title</th>
                            <th className={styles.th}>Seller</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Reports</th>
                            <th className={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listings.map((item) => (
                            <tr key={item._id.toString()}>
                                <td className={styles.td}>
                                    <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                                        <Image
                                            src={item.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
                                            alt=""
                                            fill
                                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                                            unoptimized={item.image?.startsWith('data:')}
                                        />
                                    </div>
                                </td>
                                <td className={styles.td}>{item.title}</td>
                                <td className={styles.td}>{item.seller}</td>
                                <td className={styles.td}>
                                    <span className={`${styles.badge} ${styles['badge-' + item.status]}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className={styles.td}>{item.reportsCount || 0}</td>
                                <td className={styles.td}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className={styles.actionBtn}>View</button>
                                        {item.status !== 'approved' && (
                                            <button className={styles.actionBtn} style={{ color: '#166534' }}>Approve</button>
                                        )}
                                        {item.status !== 'deleted' && (
                                            <button className={styles.actionBtn} style={{ color: '#991b1b' }}>Delete</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
