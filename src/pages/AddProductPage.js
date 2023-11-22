import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddProductPage = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState([]);
    const [sincategory, setSinCategory] = useState([]);
    const [formData, setFormData] = useState({
      Name: '',
      thumbnail: null,
      subcategory: '',
      category: '',
      quantity: '',
      price: '',
      shortdescription: '',
    });

    useEffect(() => {
        getCategory();
        getSubCategory();
      }, []);

      const getCategory = () => {
        axios
          .get(`http://localhost:8006/category/get-categories`)
          .then((res) => {
            setCategory(res.data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      };
    
      const getSubCategory = () => {
        axios
          .get(`http://localhost:8006/subcategory/get-sub-category`)
          .then((res) => {
            setSinCategory(res.data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      };

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
          ...formData,
          thumbnail: file,
        });
      };


      const handleSubmit = (e) => {
        e.preventDefault();
        const formDataObject = new FormData();
        formDataObject.append('Name', formData.Name);
        formDataObject.append('thumbnail', formData.thumbnail);
        formDataObject.append('subcategory', formData.subcategory);
        formDataObject.append('category', formData.category);
        formDataObject.append('quantity', formData.quantity);
        formDataObject.append('price', formData.price);
        formDataObject.append('shortdescription', formData.shortdescription);
    
        axios
          .post('http://localhost:8006/products/add-products', formDataObject)
          .then((res) => {
            if (res.status === 201) {
              // Product added successfully, you can redirect or show a success message
              navigate('/dashboard/products'); // Redirect to product list
            }
          })
          .catch((err) => {
            console.error('Error adding product:', err);
          });
      };

  return (
    <Container>
    <h1>Add Product</h1>
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'start',
        gap: 20,
      }}
    >
      <TextField
        type="text"
        name="Name"
        label="Product Name"
        onChange={handleInputChange}
        value={formData.Name}
      />
      <InputLabel id="category-label">Select Category</InputLabel>
      <Select
        labelId="category-label"
        id="category-select"
        value={formData.category}
        onChange={handleInputChange}
        name="category"
        label="Category"
      >
        {category.map((elem) => (
          <MenuItem key={elem._id} value={elem._id}>
            {elem.Name}
          </MenuItem>
        ))}
      </Select>
      <InputLabel id="subcategory-label">Select Sub-Category</InputLabel>
      <Select
        labelId="subcategory-label"
        id="subcategory-select"
        value={formData.subcategory}
        onChange={handleInputChange}
        name="subcategory"
        label="Sub-Category"
      >
        {sincategory.map((elem) => (
          <MenuItem key={elem._id} value={elem._id}>
            {elem.Name}
          </MenuItem>
        ))}
      </Select>
      <TextField
        type="number"
        name="quantity"
        label="Quantity"
        onChange={handleInputChange}
        value={formData.quantity}
      />
      <TextField
        type="number"
        name="price"
        label="Price"
        onChange={handleInputChange}
        value={formData.price}
      />
      <TextField
        type="text"
        name="shortdescription"
        label="Short Description"
        onChange={handleInputChange}
        value={formData.shortdescription}
      />
      <input type="file" name="thumbnail" onChange={handleFileChange} />
      <Button type="submit" variant="contained" color="primary">
        Add Product
      </Button>
    </form>
  </Container>
  )
}

export default AddProductPage