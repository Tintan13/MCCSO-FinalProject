// routes/Routes.js

const express = require('express');
const router = express.Router();
const Controllers = require('../controllers/Controllers');
const departmentController = require('../controllers/department_controller');
const personnelController = require('../controllers/personnel_controller');
const dashboardController = require('../controllers/dashboard_controller');
const categoryController = require('../controllers/category_controller');
const inventoryController = require('../controllers/inventoryController');
const itemController = require('../controllers/item_controller');


// Public routes (no authentication needed)
router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/item', (req, res) => {
    res.render('item', { title: 'Item Details' });
});

router.get('/login', (req, res) => {
    // Redirect to index if already logged in
    if (req.session.isLoggedIn) {
        return res.redirect('/index');
    }
    res.render('login', {});
});

router.get('/register', (req, res) => {
    // Redirect to index if already logged in
    if (req.session.isLoggedIn) {
        return res.redirect('/index');
    }
    res.render('register', {});
});

router.post('/login', Controllers.login);
router.post('/register', Controllers.register);
router.get('/logout', Controllers.logout);

// Protected routes (authentication required)
router.use(Controllers.isAuthenticated); // Apply middleware to all routes below

// Dashboard route
router.get('/index', dashboardController.getCounts);

// Department routes
router.get('/department', departmentController.getDepartments);
router.post('/department/add', departmentController.addDepartment);
router.put('/department/update/:department_id', departmentController.updateDepartment);
router.delete('/department/delete/:department_id', departmentController.deleteDepartment);

// Personnel routes
router.get('/personnel', personnelController.getPersonnel);
router.post('/personnel/add', personnelController.addPersonnel);
router.put('/personnel/update/:id', personnelController.updatePersonnel);
router.delete('/personnel/delete/:id', personnelController.deletePersonnel);

// Category routes
router.get('/category/list', categoryController.getCategories);
router.post('/category/add', categoryController.addCategory);

// Inventory routes
router.get('/inventory', inventoryController.getInventory);
router.get('/inventory/:id', inventoryController.getInventoryById);
router.post('/inventory/add', inventoryController.addInventoryItem);
router.post('/inventory/update/:id', inventoryController.updateInventory);
router.delete('/inventory/delete/:id', inventoryController.deleteInventory);

// Search Items
// router.get('/item/search', itemController.searchItems); // Search items*/

router.get('/items', itemController.getItems);
router.get('/items/api/search', itemController.searchItems);
router.get('/items/get/:id', itemController.getItemById);
router.post('/items/add', itemController.addItem);
router.put('/items/update/:id', itemController.updateItem);
router.delete('/items/delete/:id', itemController.deleteItem);


module.exports = router;