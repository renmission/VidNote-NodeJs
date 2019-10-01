if (process.env.NODE_ENV === 'production') {
    module.exports = { mongoURI: 'mongodb+srv://vidnote-prod:vidnote-prod@cluster0-frmtk.mongodb.net/test?retryWrites=true&w=majority' }
} else {
    module.exports = { mongoURI: 'mongodb://localhost/vidnote-dev' }
}