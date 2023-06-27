const dbuser = require('../../schema/dbSchma')
const bcrypt = require('bcrypt')


module.exports = {

    //to List Product
    homePage: () => {
        return new Promise(async (resolve, reject) => {
            await dbuser.product.find().then((response) => {
                resolve(response)

            })
        })


    },

    //post Sign up Function
    doSignUp: (userData) => {
        return new Promise(async (resolve, reject) => {
            try {
                const email = userData.email
                const phone = userData.phone
                const existingEmail = await dbuser.user.findOne({ email: email })
                const existingPhone = await dbuser.user.findOne({ phonenumber: phone })
                console.log(existingEmail, 'emailexist', existingPhone, 'existing phone');

                if (existingEmail) {
                    reject({ reason: 'Email Already Exist' })
                } else if (existingPhone) {
                    reject({ reason: 'Phone Number Already Exist' })



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
                        reject({ reason: 'User Blocked!!!!!' })
                    }
                } else {

                    reject({ reason: 'no user found' })
                }
            } catch (err) {
                throw err
            }
        })

    },
    //otp login function
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




