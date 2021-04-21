const express = require('express'),
personSchema = require('../model/person'),
bcrypt = require('bcryptjs')

router = new express.Router()

router.post('/register',async (req,res)=>{
    const newPerson = new personSchema(req.body.person)
    newPerson.save().then(()=>{
        res.send(newPerson)
    }).catch((error)=>{
        console.log(error)
        res.send(error)
    })
})
router.post('/login',async(req,res)=>{
    try{
        const person = req.body.person
        const email = person.email
        const password = person.password
        const foundPerson = await personSchema.findOne({email})
        if(!foundPerson){
            throw new Error({error: 'Invalid login details'})
        }
        const isValidPassword = await bcrypt.compare(password,foundPerson.password)
        if(!isValidPassword){
            throw new Error({error: 'Invalid login details'})   
        }
        const token = await foundPerson.generateAuthToken()
        res.send({foundPerson, token})
    }catch(error){
        console.log(error)
        res.status(400).send(error)
    }
})

router.get('/persons/:id',async(req,res)=>{
    try{
        const selectedPerson = await personSchema.findById(req.params.id)
        res.send(selectedPerson)
    }catch(error){
        console.log(error)
        res.status(500).send(error)
    }
})

router.put('/persons/:id',async(req,res)=>{
    const _id = person.id
    try{
        const selectedPerson = await personSchema.findByIdAndUpdate(_id,person,{new: true})
        if (!selectedPerson){
            return res.status(404).send()
        }else{
            res.send(selectedPerson)
        }
    }catch(error){
        console.log(error)
        res.status(400).send(error)
    }
})

router.delete('/persons/:id',async(req,res)=>{
    const _id = req.params.id
    try{
        const deletedPerson = await personSchema.findByIdAndDelete(_id)
        return res.status(200)
    }catch(error){
        console.log(error)
        res.status(400).send(error)
    }
})


module.exports = router