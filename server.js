const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const ourRoutes = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});
const PORT = 4000;

let ProductModel = require('./product.model');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use('/uploads',express.static('uploads'));

mongoose.connect('mongodb://localhost:27017/Products',{useNewUrlParser:true});
const connection = mongoose.connection;
connection.once('open', function(){
    console.log('MongoDB database connection establised successfully');
});

ourRoutes.route('/').get(function(req, res){
    ProductModel.find(function(err, data){
        if(err){
            console.log(err);
        }else{
            res.json(data);
        }
    });
});

ourRoutes.route('/:id').get(function(req, res){
    let id = req.params.id;
    ProductModel.findById(id, function(err, data){
        res.json(data);
    });
});

ourRoutes.route('/add').post(function(req, res){	
    let toSave = new ProductModel(req.body);
    toSave.save()
        .then(toSave=>{
            res.status(200).json({'msg':'Added successfull', 'addStatus':1});
        })
        .catch(err=>{
            res.status(400).send('Adding Failed');
        });
});

/*ourRoutes.route('/add').post(upload.single('product_image'), function(req, res){
    console.log(req);
    //let toSave = new ProductModel(req.body);
    const product = new ProductModel({
        _id: new mongoose.Types.ObjectId(),
        product_name: req.body.product_name,
        product_description: req.body.product_description,
        product_price: req.body.product_price,
        product_offer: req.body.product_offer,
        product_usage: req.body.product_usage,
        product_image: req.file.path 
    });
      product.save()
        .then(product=>{
            res.status(200).json({'msg':'Added successfull', 'addStatus':1});
        })
        .catch(err=>{
            res.status(400).send('Adding Failed');
        });
});*/

ourRoutes.route('/update/:id').post(function(req, res){
    ProductModel.findById(req.params.id, function(err, data){
        if(!data)
            res.status(400).send('data is not found');
        else
            data.product_name = req.body.product_name;
            data.product_description = req.body.product_description;
            data.product_price = req.body.product_price;
            data.product_offer = req.body.product_offer;
            data.product_usage = req.body.product_usage;
            data.product_image = req.body.product_image;

            data.save().then(data => {
                res.json({
					msg: 'Updated Successfully',
					updateStatus: 1
				});
            })
            .catch(err => {
                res.status(400).send('not updated');
            });
    });
});

/*ourRoutes.route('/update/:id').post(upload.single('product_image'), function(req, res){
    ProductModel.findById(req.params.id, function(err, data){
        if(!data)
            res.status(400).send('data is not found');
        else
            data.product_name = req.body.product_name;
            data.product_description = req.body.product_description;
            data.product_price = req.body.product_price;
            data.product_offer = req.body.product_offer;
            data.product_usage = req.body.product_usage;
            data.product_image = req.file.path;

            data.save().then(data => {
                res.json({
					msg: 'Updated Successfully',
					updateStatus: 1
				});
            })
            .catch(err => {
                res.status(400).send('not updated');
            });
    });
});*/

ourRoutes.route('/delete/:id').delete(function(req, res){
    ProductModel.findByIdAndDelete(req.params.id, function(err, data){
        if(err){
            res.status(400).send('Not deleted');
        } else {
            res.json({
				msg: 'Deleted Successfully',
				deleteStatus: 1
			});
        }
    });
});

app.use('/Products',ourRoutes);

app.listen(PORT, function(){
    console.log('Server is running on Port: ' + PORT);
});