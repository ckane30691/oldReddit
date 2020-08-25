const express = require('express');
const router = express.router();

router.get('/test', (req, res) => res.json({ msg: 'This is the users route' }));

module.exports = router;
