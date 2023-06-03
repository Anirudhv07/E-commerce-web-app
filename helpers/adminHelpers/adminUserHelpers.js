const user = require('../../schema/dbSchma')

module.exports = {
    getUser: () => {
        return new Promise(async (resolve, reject) => {
            await user.user.find().then((response) => {
                resolve(response)
            })
        })
    },
    blockedUser: (id, condition) => {
        return new Promise(async (resolve, reject) => {
            await user.user.updateOne({ _id: id }, { $set: { blocked: condition } })
                .then((response) => {
                    resolve(response)
                }).catch((err) => {
                    reject(err)
                })
        })
    }
}