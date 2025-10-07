const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  stock: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  image: { type: String },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
