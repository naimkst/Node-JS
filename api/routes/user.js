const router = require('express').Router();
const { verifyToken, verifyTokenAuth } = require('../middleware');
const User = require('../models/user');
const CryptoJS = require('crypto-js');

router.get('/usertest', (req, res) => {
    res.send('this is data send!');
});

router.put('/:id', verifyTokenAuth, async (req, res ) => {
    if( req.body.password ){
        req.body.password = CryptoJS.AES.encrypt(
            JSON.stringify(req.body.password),
            process.env.pass_sec
        ).toString();
    }
    try {
        const updateUser = await User.findByIdAndUpdate(
            req.params.id, {
            $set: req.body
        },{new:true});
        res.status(200).json('Update user!');
    }catch (err) {
        req.status(500).json(err);
    }
});

module.exports = router;