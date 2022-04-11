const express = require('express');
const router = express.Router();
const ToughtController = require('../controller/ToughtController')

//helpers
const {checkAuth} = require('../helpers/auth')
const {checkOwner} = require('../helpers/owner')

router.get('/add', checkAuth,ToughtController.createTought)
router.post('/add', checkAuth,ToughtController.createToughtPost)
router.get('/dashboard', checkAuth,ToughtController.dashboard)
router.post('/remove', checkAuth, checkOwner, ToughtController.deleteTought)
router.get('/edit/:id', checkAuth, checkOwner,ToughtController.editTought)
router.post('/edit/', checkAuth, checkOwner,ToughtController.editToughtSave)
router.get('/', ToughtController.showToughts)

module.exports = router;