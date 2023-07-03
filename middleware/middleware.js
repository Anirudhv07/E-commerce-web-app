const dbuser=require('../schema/dbSchma')



module.exports={
    auth:((req,res,next)=>{
        if(req.session.admin){
            next()
        }else{
            res.render('admin/login',{layout:'adminEmptyLayout'})
        }
    }),
    userauth:(function(req,res,next){
      if(req.session.loggedIn){
        next()
      }else{
        res.render('user/login',{layout:'emptylayout'})
      }
    }),
    userBlockBug:(async(req,res,next)=>{
        
        const userId=req.session.user.userId
        const user=await dbuser.user.findOne({_id:userId})

        if(!user.blocked){
            next()
        }else{
            res.redirect('/logout')
        }
    })
}