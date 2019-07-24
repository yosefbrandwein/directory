const express = require('express');
const router = express.Router();
const postgres = require('../postgres')
const bcryptjs = require('bcryptjs');
const Joi = require('@hapi/joi');


router.get('/register', (req, res)=> {
    res.render('users',{type: 'register'});
});

router.get('/login', (req, res)=> {
    if (req.app.locals.name)
        res.redirect('/');
    else 
        res.render('users',{type: 'login'});   
});

router.get('/logout', (req, res)=> {
    if (!req.app.locals.name)
        res.redirect('./login');
    else {
        req.session.destroy();
        res.redirect('../../'); 
    }
});

//Schema for registration
const registerSchema= Joi.object().keys({
    Name: Joi.string().min(3).max(30).required(),
    Email: Joi.string().email({minDomainSegments: 2}).required(),
    Password_1: Joi.string().min(4).max(15).required(),
    Password_2: Joi.string().min(4).max(15).valid(Joi.ref('Password_1')).required().error(errors => {
        return {
          message: "The passwords do not match"
        }
    })
});


router.post('/register',async (req, res)=> {
    try{  
        let {Name,Email,Password_1}=req.body;
        
        await Joi.validate(req.body,registerSchema,async (err,value)=> {
            if (err) {
                req.flash('error',err.details[0].message);
                req.flash('_name', Name);
                req.flash('email', Email);
                res.redirect('./register');
            } else {
                const user =  await postgres.getUser(Email);
                if (user.rows.length>0) {
                    req.flash('messages', 'Sorry Email is aredy used')
                    res.redirect('./register');
                    return;
                }
                
                await bcryptjs.hash(Password_1, 8, async (err, hash) => {
                    if(err) {
                        console.log("There was a error hashing",err)
                        return;
                    } else {
                        try {
                            const result=await postgres.registerUser(Name,Email,hash);
                            req.flash('messages', `${result.rows[0].name}  Your successfully registered!!`);
                            res.redirect('/');                          
                        } catch (error) {
                             console.log('Error returning result from registerUser',error); 
                        }
                        
                    }
                });
            }  
        });
    } catch (e) {
        console.log('users error',e);
    }
     
});

router.post('/login',async (req, res)=> {
    const {email, password} = req.body;
    const user =  await postgres.getUser(email);
    if (user.rows.length>0) {
        const match = await bcryptjs.compare(password,user.rows[0].password);
        
        if (match) {
            req.session.name=user.rows[0].name;
            console.log('your loged in');
            req.flash('info', 'Your loged in');
            res.redirect('/')
        } else {
            req.flash('error', 'Wrong password')
            res.redirect('./login')
        }
    } 
    else {
        req.flash('error', `Sorry no user with email: ${email}`);
        res.redirect('./login');
    }
    
});
module.exports=router;
