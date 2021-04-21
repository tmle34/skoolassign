const mongoose = require('mongoose'),
    validator = require('validator'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken')

const personSchema = mongoose.Schema({
    firstName:{
        type:String,
        require:true,
       rim:true
    }, 
    lastName:{
        type:String,
        require:true,
        trim:true
    },
    gender:{
        type:String,
        require:true,
        trim:true
    },
    lastLogin:{
        type:Number,
        require:false,
    },
    email:{
        type:String,
        require:true,
        trim:true,
        unique: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    password:{
        type:String,
        require:true,
        trim:true,
        minlength: 8,
        validate(value){
            if(!value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    role:{
        type:String,
        require:true,
        trim:true,
        validate(value){
            if(!value.toLowerCase()in ['passenger','crew','administrator']){
                throw new Error('Unacceptable role')
            }
        }
    },
    tokens:[
    {
        token:{
            type: String,
            required: true,
        }
    }
    ]
})
personSchema.pre("save",async function(next){
    const person = this
    if(person.isModified("password")){
        person.password = await bcrypt.hash(person.password, 8)
    }
    next()
})

personSchema.methods.generateAuthToken = async function(){
    const person = this
    const token = jwt.sign({_id: person._id, name: person.lastName, email:person.email}, 'sess')
    person.tokens = person.tokens.concat({token})
    await person.save()
    return token
}

const Person = mongoose.model('Person',personSchema)
module.exports = Person
