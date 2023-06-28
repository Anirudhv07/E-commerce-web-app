const mongoose = require('mongoose')

const connectDB = async (url) => {
    try {
        await mongoose
            .connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(()=> console.log('Data base connected')).catch((err) => console.log(`error detected: ${err}`))
        
    } catch (err) {
        return `error detected: ${err}`
    }
}

module.exports = connectDB