import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import styles from "../admin.module.css";

export const dynamic = 'force-dynamic';

async function getUsers() {
    await dbConnect();
    const users = await User.find({}).lean();

    // Enrich users with listing counts
    const usersWithStats = await Promise.all(users.map(async (user) => {
        const listingCount = await Product.countDocuments({ sellerId: user._id.toString() });
        const totalReports = await Product.aggregate([
            { $match: { sellerId: user._id.toString() } },
            { $group: { _id: null, total: { $sum: "$reportsCount" } } }
        ]);

        return {
            ...user,
            listingCount,
            reportsAgainst: totalReports[0]?.total || 0,
            _id: user._id.toString()
        };
    }));

    return usersWithStats;
}

export default async function UserManagement() {
    const users = await getUsers();

    return (
        <div>
            <div className={styles.header}>
                <h1>User Management</h1>
                <p>Manage community members and enforce rules</p>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Username</th>
                            <th className={styles.th}>Email</th>
                            <th className={styles.th}>Role</th>
                            <th className={styles.th}>Listings</th>
                            <th className={styles.th}>Total Reports</th>
                            <th className={styles.th}>Strikes</th>
                            <th className={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className={styles.td}>{user.name}</td>
                                <td className={styles.td}>{user.email}</td>
                                <td className={styles.td}>
                                    <span className={styles.badge} style={{ background: user.role === 'admin' ? '#e0e7ff' : '#f1f5f9', color: user.role === 'admin' ? '#4338ca' : '#475569' }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className={styles.td}>{user.listingCount}</td>
                                <td className={styles.td}>{user.reportsAgainst}</td>
                                <td className={styles.td}>{user.strikeCount || 0}</td>
                                <td className={styles.td}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className={styles.actionBtn}>Warn</button>
                                        <button className={styles.actionBtn}>{user.canPost === false ? 'Unblock' : 'Block'}</button>
                                        <button className={styles.actionBtn}>Reset</button>
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
