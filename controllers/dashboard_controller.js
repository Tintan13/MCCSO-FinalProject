const connection = require('../config/database');

// Function to get counts
const getCounts = (req, res) => {
    const counts = {};

    const personnelQuery = 'SELECT COUNT(*) AS personnelCount FROM personnel';
    const departmentQuery = 'SELECT COUNT(*) AS departmentCount FROM department';
    const inventoryQuery = 'SELECT COUNT(*) AS inventoryCount FROM inventory';
    const itemsQuery = 'SELECT COUNT(*) AS itemsCount FROM items';

    // Execute all queries concurrently using Promise.all
    Promise.all([
        new Promise((resolve, reject) => {
            connection.query(personnelQuery, (err, results) => {
                if (err) return reject(err);
                counts.personnelCount = results[0].personnelCount;
                resolve();
            });
        }),
        new Promise((resolve, reject) => {
            connection.query(departmentQuery, (err, results) => {
                if (err) return reject(err);
                counts.departmentCount = results[0].departmentCount;
                resolve();
            });
        }),
        new Promise((resolve, reject) => {
            connection.query(inventoryQuery, (err, results) => {
                if (err) return reject(err);
                counts.inventoryCount = results[0].inventoryCount;
                resolve();
            });
        }),
        new Promise((resolve, reject) => {
            connection.query(itemsQuery, (err, results) => {
                if (err) return reject(err);
                counts.itemsCount = results[0].itemsCount;
                resolve();
            });
        })
    ])
    .then(() => {
        // Send counts to EJS template
        res.render('index', { counts });
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Database query error');
    });
};

module.exports = {
    getCounts,
};
