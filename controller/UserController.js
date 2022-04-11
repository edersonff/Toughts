const User = require('../models/User');
const Tought = require('../models/Tought');

const bcrypt = require('bcryptjs');
const session = require('express-session');

module.exports = class UserController{
    static login(req, res){
        res.render('user/login');
    }
    static register(req, res){
        res.render('user/register');
    }

    static async registerPost(req, res){
        const {name, email, password, confirmpassword} = req.body;

        // Password match
        if(password != confirmpassword){
            // Message
            req.flash('messageRed', "As senhas não conferem, tente novamente")            
            res.render('user/register', {name, email})

            return
        }

        // Check if user already exists
        const checkIfUserExist = await User.findOne({raw:true,where: {email}})
        if(checkIfUserExist){
            req.flash('messageRed', "O Email já está em uso!")           
            res.render('user/register', {name, email})
            return
        }

        // Create password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = {
            name,email, password: hashedPassword
        }

        try{
            const createdUser = await User.create(user);
            req.flash('messageBlue', "Cadastro concluido com sucesso");

            // initialize session
            req.session.userid = createdUser.id

            req.session.save(()=>{
                res.redirect('/tought/dashboard');
            })

        }catch(e){
            console.log(err);
        }

    }

    static async loginPost(req, res){
        const {email, password} = req.body;
        
        //find user
        const user = await User.findOne({raw:true, where: {email}});

        if(!user){
            req.flash('messageRed', 'Usuario não cadastrado!')
            res.render('user/login', {email, password});
            return
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);

        if(!passwordMatch){
            req.flash('messageRed', 'Senha incorreta!')
            res.render('user/login', {email, password});
            return
        }

        req.session.userid = user.id;
        req.flash('messageBlue', 'Autenticação realizada com sucesso!')
        req.session.save(()=>{
            res.redirect('/');
        })
    }

    static logout(req,res){
        req.session.destroy();
        res.redirect('/login');
    }
}