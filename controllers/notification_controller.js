const connection = require('../config/database');

exports.getNotifications = (req, res) => {
    const query = 'SELECT * FROM notification ORDER BY updated_at DESC';

    connection.query(query, (err, notifications) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        res.render('notifications', {
            success: true,
            notifications: notifications || []
        });
    });
};
