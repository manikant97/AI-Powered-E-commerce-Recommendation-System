import React, { useEffect, useState } from 'react';

const ProductForm = ({ onSave, initialData, categories = [] }) => {
  initialData = initialData || {};
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    price: initialData.price || '',
    description: initialData.description || '',
    category: initialData.category || '',
    stock: initialData.stock || 0,
    featured: initialData.featured || false,
    image: initialData.image || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData.image || '');
  const [imageInputType, setImageInputType] = useState('url'); // 'url' or 'upload'

  const handleInputTypeChange = (type) => {
    setImageInputType(type);
    if (type === 'url') {
      // Clear file when switching to URL
      setImageFile(null);
    } else {
      // Clear URL when switching to upload
      setFormData({ ...formData, image: '' });
      setImagePreview('');
    }
  };

  useEffect(() => {
    // Only reset form when editing an existing product
    if (initialData && initialData.id != null) {
      setFormData({
        title: initialData.title || '',
        price: initialData.price || '',
        description: initialData.description || '',
        category: initialData.category || '',
        stock: initialData.stock || 0,
        featured: initialData.featured || false,
        image: initialData.image || '',
      });
      setImagePreview(initialData.image || '');
      setImageFile(null);
      setImageInputType('url');
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox'
        ? checked
        : type === 'number'
        ? (value === '' ? '' : parseFloat(value))
        : value,
    });
    if (name === 'image') {
      setImagePreview(value);
      // Clear file when URL is entered
      setImageFile(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      // Clear the URL input when file is selected
      setFormData({ ...formData, image: '' });
    } else {
      setImageFile(null);
      setImagePreview('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;
    
    console.log('Submitting form with imageInputType:', imageInputType);
    console.log('Form data:', formData);
    console.log('Image file:', imageFile);
    
    if (imageInputType === 'upload' && imageFile) {
      // Use FormData for file upload
      const data = new FormData();
      data.append('title', formData.title);
      data.append('price', formData.price);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('stock', formData.stock);
      data.append('featured', formData.featured);
      data.append('image', imageFile);
      console.log('Sending FormData with file upload');
      onSave(data, true); // true = isMultipart
    } else if (imageInputType === 'url' && formData.image) {
      // Use regular form data for URL
      console.log('Sending regular form data with URL');
      onSave(formData, false);
    } else {
      // No image provided, still save the product
      console.log('Sending regular form data without image');
      onSave(formData, false);
    }
    
    // Only reset form if not editing
    if (!initialData || !initialData._id) {
      setFormData({
        title: '',
        price: '',
        description: '',
        category: '',
        stock: 0,
        featured: false,
        image: '',
      });
      setImageFile(null);
      setImagePreview('');
      setImageInputType('url');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Product Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Price ($)</label>
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 w-full border rounded px-3 py-2"
        >
          <option value="">Select category</option>
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <option key={index} value={cat.name.toLowerCase().replace(/\s+/g, '-')}>
                {cat.name}
              </option>
            ))
          ) : (
            <option value="" disabled>No categories available</option>
          )}
        </select>
        {categories.length === 0 && (
          <p className="text-sm text-gray-500 mt-1">
            No categories available. Please add categories in the Category Management section first.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Stock</label>
        <input
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
        />
        <label className="text-sm">Featured Product</label>
      </div>

      <div>
        <label className="block text-sm font-medium">Image Input Type</label>
        <div className="flex gap-4 mt-1">
          <label>
            <input
              type="radio"
              name="imageInputType"
              value="url"
              checked={imageInputType === 'url'}
              onChange={() => handleInputTypeChange('url')}
            />{' '}
            URL
          </label>
          <label>
            <input
              type="radio"
              name="imageInputType"
              value="upload"
              checked={imageInputType === 'upload'}
              onChange={() => handleInputTypeChange('upload')}
            />{' '}
            Upload
          </label>
        </div>
      </div>
      {imageInputType === 'url' && (
        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>
      )}
      {imageInputType === 'upload' && (
        <div>
          <label className="block text-sm font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>
      )}
      {imagePreview && (
        <div>
          <label className="block text-sm font-medium">Image Preview</label>
          <img src={imagePreview} alt="Preview" className="h-24 mt-2 rounded border" />
        </div>
      )}
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Save Product
      </button>
    </form>
  );
};

export default ProductForm;
