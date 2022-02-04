module.exports = ctx => ({
    map: ctx.options.map,
    parser: ctx.options.parser,
    plugins: {
        'postcss-import': true,
        autoprefixer: true,
        'postcss-custom-media': true,
        'postcss-custom-properties': true,
        'postcss-calc': true,
        cssnano: ctx.env === 'production' ? {
            reduceIdents: false,
            safe: true
        } : false
    }
});
