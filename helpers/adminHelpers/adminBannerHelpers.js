const user=require('../../schema/dbSchma')


module.exports={
    addBanner:(bannerData,Image)=>{
        
        return new Promise(async(resolve,reject)=>{
            
            let newBanner=user.banner({
                title:bannerData.title,
                description:bannerData.description,
                image:Image
            })
            await newBanner.save().then((response)=>{
                resolve(response)
            })
        })
    },
    getBanner:()=>{
        return new Promise(async(resolve,reject)=>{
            await user.banner.find().then((response)=>{
                resolve(response)
            })
        })
    },
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
    editBanner:(id)=>{
        return new Promise(async (resolve, reject) => {
            await user.banner.find({ _id: id }).then((response) => {
                resolve(response[0])
            })
        })
    },
    postEditBanner:(id,bannerData,image)=>{
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