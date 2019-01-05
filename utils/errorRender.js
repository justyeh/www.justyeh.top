exports.errorRender = (res, error) => {
    res.render('error', {...error })
}