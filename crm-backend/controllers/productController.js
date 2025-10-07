const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

async function getAllProducts(req, res) {
  try {
    console.log('Getting products for user ID:', req.user?.id);
    // For storefront, return all products; for admin, return user-specific products
    const products = req.headers['x-storefront'] === 'true' 
      ? await Product.find({}) 
      : await Product.find({ user: req.user.id });
    console.log('Found products:', products);
    res.json(products);
  } catch (err) {
    console.error('Error getting products:', err);
    res.status(500).json({ error: err.message });
  }
}



async function createProduct(req, res) {
  try {
    console.log('Creating product with data:', req.body);
    console.log('File uploaded:', req.file);
    console.log('User ID:', req.user.id);
    
    let imagePath = req.body.image; // Default to URL
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      console.log('Image path set to:', imagePath);
    }
    
    const productData = {
      ...req.body,
      image: imagePath,
      user: req.user.id
    };
    
    console.log('Final product data:', productData);
    
    const newProduct = await Product.create(productData);
    console.log('Product created successfully:', newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: err.message });
  }
}

async function updateProduct(req, res) {
  try {
    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const deleted = await Product.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProductById(req, res) {
  try {
    console.log('Getting product by ID:', req.params.id);
    console.log('User ID:', req.user?.id);
    console.log('Headers:', req.headers);
    
    // For storefront, return any product; for admin, return user-specific products
    const query = req.headers['x-storefront'] === 'true' 
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user.id };
    
    const product = await Product.findOne(query);
    
    if (!product) {
      console.log('Product not found');
      return res.status(404).json({ error: 'Product not found' });
    }
    
    console.log('Found product:', product);
    res.json(product);
  } catch (err) {
    console.error('Error getting product by ID:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  upload // Export multer upload for use in routes
};
