const { environment } = require('@Rails/webpacker')
environment.loaders.prepend('html', {
    test: /\.html$/,
    exclude: /node_modules/,
    loaders: ['html-loader'] 
})

const typescript =  require('./loaders/typescript')
environment.loaders.prepend('typescript', typescript)
module.exports = environment
