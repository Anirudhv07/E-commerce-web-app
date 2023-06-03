const dbuser = require('../../schema/dbSchma')
const bcrypt = require('bcrypt')


module.exports = {

    //SignUp
    homePage: () => {
        return new Promise(async (resolve, reject) => {
            await dbuser.product.find().then((response) => {
                resolve(response)

            })
        })


    },
    doSignUp: (userData) => {
        return new Promise(async (resolve, reject) => {
            try {
                const email = userData.email
                const existingUser = await dbuser.user.findOne({ email })
                if (existingUser) {
                    resolve({ status: false })
                } else {
                    const hashedPassword = await bcrypt.hash(userData.password, 10)
                    const data = new dbuser.user({
                        username: userData.username,
                        password: hashedPassword,
                        email: userData.email,
                        phonenumber: userData.phone
                    })

                    await data.save().then((data) => {
                        resolve({ status: true })
                    })
                }
            } catch (err) {
                throw err
            }

        })
    },

    //login
    doLogIn: (userData) => {
        return new Promise(async (resolve, reject) => {
            try {

                const response = {}
                const user = await dbuser.user.findOne({ email: userData.email })
                if (user) {

                    if (user.blocked == false) {
                        await bcrypt.compare(userData.password, user.password)
                            .then((status) => {
                                if (status) {
                                    response.username = user.username
                                    response.userId = user._id
                                    response.loggedinstatus = true
                                    resolve(response)
                                } else {
                                    reject({ reason: 'password not match' })
                                }
                            })
                    } else {
                        resolve({ blockedStatus: true })
                    }
                } else {

                    reject({ reason: 'no user found' })
                }
            } catch (err) {
                throw err
            }
        })

    },
    doOtpLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            try {

                const response = {}
                const user = await dbuser.user.findOne({ phonenumber: userData })

                if (user) {


                    if (user.blocked == false) {

                        response.username = user.username
                        response.userId = user._id
                        response.loggedinstatus = true
                        resolve(response)



                    } else {
                        resolve({ blockedStatus: true })
                    }
                } else {

                    reject({ reason: 'no user found' })
                }
            } catch (err) {
                throw err
            }
        })
    }


}




