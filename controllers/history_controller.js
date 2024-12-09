const connection = require('../config/database');

exports.getHistories = (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const pageSize = 10; // Number of items per page
    const offset = (page - 1) * pageSize;

    // Query to count the total number of records
    const countQuery = 'SELECT COUNT(*) AS total FROM history';

    connection.query(countQuery, (err, countResult) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / pageSize);

        // Query to fetch the current page's records
        const query = 'SELECT * FROM history ORDER BY updated_at DESC LIMIT ? OFFSET ?';

        connection.query(query, [pageSize, offset], (err, history) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.render('history', {
                success: true,
                history: history || [],
                currentPage: page,
                totalPages: totalPages,
            });
        });
    });
};
