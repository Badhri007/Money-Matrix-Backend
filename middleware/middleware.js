const verify = (req, res, next) => {
    console.log("MIDDLEWARE ");
    next();
}

module.exports = { verify }