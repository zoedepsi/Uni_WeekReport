async function get(ctx,next) {
    ctx.state.data=ctx.query
}

module.exports={
    get
}