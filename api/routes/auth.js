const router = require('express').Router();
const User = require('../models/user');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
//Register
router.post('/register', async (req, res) => {
    const newUser = new User(
        {
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(
                JSON.stringify(req.body.password),
                process.env.pass_sec)
                .toString(),
        }
    );
    try {
        const saveUser = await newUser.save();
        res.status(201).json(saveUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        !user && res.status(401).json('Not valid user!');
        var bytes = CryptoJS.AES.decrypt(user.password, process.env.pass_sec);
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        decryptedData !== req.body.password && res.status(401).json('password not correct!');

        const accessToken = jwt.sign({
                id: user.id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_KEY,
            {expiresIn: "3d"}
        );
        const {password, ...others} = user._doc;

        res.status(200).json({...others, accessToken});
    } catch (error) {
        res.status(500).json(error);
    }

});


module.exports = router;