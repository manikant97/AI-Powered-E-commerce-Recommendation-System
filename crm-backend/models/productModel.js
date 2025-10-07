let products = [];
let nextId = 1;

function getAll() {
  return products;
}

function getById(id) {
  return products.find(p => p.id === id);
}

function addProduct(data) {
  const newProduct = {
    id: nextId++,
    title: data.title,
    price: data.price,
    description: data.description,
    category: data.category,
    stock: data.stock,
    featured: !!data.featured,
    image: data.image,
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  return newProduct;
}

function updateProduct(id, data) {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  products[index] = {
    ...products[index],
    title: data.title,
    price: data.price,
    description: data.description,
    category: data.category,
    stock: data.stock,
    featured: !!data.featured,
    image: data.image
  };
  return products[index];
}

function deleteProduct(id) {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
}

module.exports = {
  getAll,
  getById,
  addProduct,
  updateProduct,
  deleteProduct
};
