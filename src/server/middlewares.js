export const showCookies = (req, res, next) => {
    console.log(req.signedCookies);
    next()
}
export const setCookies = (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=0')
    next()
}