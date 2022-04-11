const Tought = require('../models/Tought');
const User = require('../models/User');
module.exports.checkOwner = async function(req,res,next){

    const idBody = req.body.id,
    idParams = req.params.id,
    userId = req.session.userid;

    let tought
    // Get tought
    if(idBody){
        tought = await Tought.findOne({where:{id:idBody}, raw:true, include:User});
    }
    if(idParams){
        tought = await Tought.findOne({where:{id:idParams}, raw:true, include:User});
    }
    
    // Verify if the user is the owner
    if(tought){
        if(tought['User.id'] != userId){
            req.flash('messageRed', 'Você não é o dono dessa publicação')
            req.session.save(()=>{
                res.redirect('/tought/dashboard')
            })
            return;
        }
    }


    next()
}