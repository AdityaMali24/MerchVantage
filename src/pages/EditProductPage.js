import { Button, Container, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GlobalSnackbar from '../components/GlobalSnackBar';

const EditProductPage = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState([]);
    const [category, setCategory] = useState([]);
    const [sincategory, setSinCategory] = useState([]);
    const [age, setAge] = useState('');
    const [age2, setAge2] = useState('');

    const [formData, setFormData] = useState({
        Name: '',
        thumbnail: null,
      });

      const productID = useParams();
    //   console.log(productID.product_id);
    useEffect(() => {
        axios.get(`http://localhost:8006/products/get-single-products/${productID.product_id}`).then((res) => {
          setProduct(res.data.data);
          console.log(product);
          setFormData({
            name: res.data.data.name,
            thumbnail: null,
          });
          console.log(formData);
          getCategory();
          getSubCategory();
        });
      }, [productID]);

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
          image: file,
        });
      };
    
      const handleChange2 = (event) => {
        setAge2(event.target.value);
      };
      
      const handleChange = (event) => {
        setAge(event.target.value);
      };


      const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submit btn clicked')
        const formDataObject = new FormData();
        formDataObject.append('Name', formData.Name);
        formDataObject.append('thumbnail', formData.thumbnail);
        formDataObject.append('subcategory', age2); 
        formDataObject.append('category', age); 
        axios
          .put(`http://localhost:8006/products/update-products/${productID.product_id}`, formDataObject)
          // console.log(formDataObject)
          .then((res) => {
            console.log(res)
            if (res.status === 200) {
              console.log('success 200 redirecting...')
              setTimeout(() => {
                navigate('/dashboard/products');
                console.log("done")
              }, 
              3000);
            }
          })
          .catch((err) => console.log(err));
      };

  return (
    <>
    <Container>
      <h1>Edit Product</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'start', gap: 20 }}
      >
        <TextField type="text" name="Name" onChange={handleInputChange} value={formData.Name} />
        <InputLabel id="demo-simple-select-label">Select Sub-Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age2}
          label="Age"
          onChange={handleChange2}
        >
          {sincategory.map((elem, ind) => (
            <MenuItem key={elem._id} value={elem._id}>
              {elem.Name}
            </MenuItem>
          ))}
        </Select>
        <InputLabel id="demo-simple-select-label">Select Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          {category.map((elem, ind) => (
            <MenuItem key={elem._id} value={elem._id}>
              {elem.Name}
            </MenuItem>
          ))}
        </Select>

        <input type="file" name="image" onChange={handleFileChange} />
        <Button type="submit" variant="contained">
          <GlobalSnackbar buttonText='Update' message='Product Update Successfully!'/>
        </Button>
      </form>
    </Container>
  </>
  )
}

export default EditProductPage