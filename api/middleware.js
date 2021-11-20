const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_KEY, (err, user ) => {
            if (err) res.status(403).json('Token not expire!');
            req.user = user;
            next();
        });
    }else {
        return res.status(401).json('Not authorize!');
    }
};

const verifyTokenAuth = ( req, res, next) =>{
    verifyToken( req, res, () =>{
        if( req.user.id === req.params.id || req.user.isAdmin ){
            next();
        }else {
            res.status(403).json('Not allow to process!');
        }
    });
};

module.exports = { verifyToken, verifyTokenAuth };