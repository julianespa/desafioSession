const express = require('express')  // Importo express
const ProductManager = require('../Manager/products')  // Importo el manager de productos
const uploader = require('../services/upload') // Importo el uploader
const options = require('../options/mysqlconfig.js')
const faker = require('faker')
let multer = require('multer');
const session = require('express-session')


let upload = multer();

const router = express.Router()  // Instancio las rutas

const porductService = new ProductManager(options,'products') // Instancio los metodos de productos

const {name, datatype, image, commerce} = faker



// Metodo GET

router.get('/',(req,res)=>{
    // porductService.get()
    // .then(r=>res.render('products',{products:r.payload}))
    if(!req.session.user) return res.redirect('/login')
    res.redirect('/home')
})

// Metodo GET by ID
// router.get('/:id',(req,res)=>{
//     let id = req.params.id
//     porductService.getById(id)
//     .then(r=>res.send(r))
// })

// Metodo POST con middleware (uploader de multer)
router.post('/', uploader.single('file'), (req,res)=>{
    let product = req.body
    let file = req.file
    if(!file) return res.status(500).send({error:"Couldn't upload file"})
    product.thumbnail = req.protocol+"://"+req.hostname+":8080/home/img/"+file.filename
    porductService.add(product)
    .then(r=>res.send(r))
    
})

// Metodo PUT
router.put('/:id',(req,res)=>{
    let id = parseInt(req.params.id)
    let updatedProduct = req.body
    porductService.updateById(id, updatedProduct)
    .then(r=>res.send(r))
})

// Metodo DELETE by ID
router.delete('/:id',(req,res)=>{
    let id = req.params.id
    porductService.deleteById(id)
    .then(r=>res.send(r))
})

// GET MOCKS
router.get('/api/productos-test',(req,res)=>{
    let obj = []
    for (let i = 0; i < 5; i++) {
        obj.push({
            name: commerce.product(),
            image: image.cats(200,100,true),
            price: datatype.number(1000)
        })
    }
    res.render('products',{products:obj})
})

router.get('/login',(req,res)=>{
    if(!req.session.user) return res.render('login')
    res.redirect('/')
})

router.post('/login',upload.fields([]),(req,res)=>{
    let data = req.body
    req.session.user = data.username
    res.send(console.log('ok'))
})

router.get(('/user'),(req,res)=>{
    let user = req.session
    res.send(user)
})

router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.render('logout')
})

module.exports = router