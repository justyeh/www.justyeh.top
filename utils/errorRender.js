exports.errorRender = (res, error) => {
    console.log(error)
    res.render('error', {...error })
}