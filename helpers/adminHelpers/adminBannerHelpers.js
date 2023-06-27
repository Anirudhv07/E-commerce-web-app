const user = require('../../schema/dbSchma')


module.exports = {
    //post AddBanner Function
    addBanner: (bannerData, Image) => {

        return new Promise(async (resolve, reject) => {

            let newBanner = user.banner({
                title: bannerData.title,
                description: bannerData.description,
                image: Image
            })
            await newBanner.save().then((response) => {
                resolve(response)
            })
        })
    },
    //get Banner List
    getBanner: () => {
        return new Promise(async (resolve, reject) => {
            await user.banner.find().then((response) => {
                resolve(response)
            })
        })
    },
    //unlist Banner Function
    unlistBanner: (bannerId, condition) => {
        return new Promise(async (resolve, reject) => {
            await user.banner.updateOne({ _id: bannerId }, { $set: { unlist: condition } })
                .then((response) => {
                    resolve(response)
                }).catch((err) => {
                    reject(err)

                })
        })
    },
    //Edit Banner Function  
    editBanner: (id) => {
        return new Promise(async (resolve, reject) => {
            await user.banner.find({ _id: id }).then((response) => {
                resolve(response[0])
            })
        })
    },

    //Post Edit Banner Function
    postEditBanner: (id, bannerData, image) => {
        return new Promise(async (resolve, reject) => {

            let response = await user.banner.updateOne({ _id: id },
                {
                    $set: {

                        title: bannerData.title,
                        description: bannerData.description,
                        image: image
                    }

                })
            resolve(response)
        })



    },

}