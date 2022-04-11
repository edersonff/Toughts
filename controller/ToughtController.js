const Tought = require('../models/Tought')
const User = require('../models/User');
const { use } = require('../routes/toughtRouter');

const {Op} = require('sequelize')


    // Change filter to order
    const filterOrder = (filter)=>{
        if(filter == "up")
            return 'asc'
        return 'desc'
    }

module.exports = class ToughtController{
    static async showToughts(req, res){
        let {search_query, filter, filterReset} = req.query,
        order = filterOrder(filter),
        isUp = filter === "up";

        if(filterReset){
            filter = "";
        }

        if(!search_query){
            search_query='';
        }
        const option={search_query,filter,isUp};

        const toughts = await Tought.findAll({include: User,raw: true, order: [['id', order]], where:{title:{[Op.like]:[`%${search_query}%`]}}});
        console.log(option)
        res.render('toughts/home', {toughts, option});

    }
    static async dashboard(req, res){
        const userId = req.session.userid;

        const user = await User.findOne({include: Tought, plain:true, where:{id:userId}})

        //check if user already existis
        if(!user){
            res.redirect('/login')
            return;
        }
        
        const tought = user.Toughts.map((result)=>{
            return result.dataValues
        })
        res.render('toughts/dashboard', {tought})
    }
    static createTought(req, res){
        res.render('toughts/create')
    }
    static async createToughtPost(req,res){
        const tought = {
            title : req.body.title,
            UserId: req.session.userid,
        }

        try{  
            await Tought.create(tought);

            // Callback
            req.flash('messageBlue', "Pensamento criado com sucesso!");
            
            req.session.save(()=>{
                res.redirect('/tought/dashboard')
            })
        } catch(err){
            console.log(`Aconteceu um erro: ${err}`);
        }
        
    }
    static async deleteTought(req,res){
        const id = req.body.id, 
        userId = req.session.userid,
        tought = await Tought.findOne({where: {id}, raw: true, include: User});

        // Verify if tought exists
        if(!tought){
            req.flash('messageRed', 'Postagem não achada')
            req.session.save(()=>{
                res.redirect('/tought/dashboard')
            })
            return
        }

        Tought.destroy({where: {id}})

        // Callback
        req.flash('messageBlue', 'Publicação excluida!')
        req.session.save(()=>{
            res.redirect('/tought/dashboard')
        })        
    }
    static async editTought(req, res){
        const id = req.params.id;
        const tought = await Tought.findOne({raw: true, where:{id}});
        res.render('toughts/edit', {tought})
    }
    static async editToughtSave(req, res){
        const {id, title} = req.body;
        const though = await Tought.update({title},{where: {id}})
        
        // Callback
        req.flash('messageBlue', 'Publicação atualizada!')
        req.session.save(()=>{
            res.redirect('/tought/dashboard')
        })        
    }
}