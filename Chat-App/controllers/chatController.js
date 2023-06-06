const express = require('express');
const router = express.Router();

// 채팅 화면 렌더링
router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;