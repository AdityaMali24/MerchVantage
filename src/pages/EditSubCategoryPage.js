import { Button, Container, TextField, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditSubCategoryPage = () => {
  const navigate = useNavigate();
  const [maincategory, setMainCategory] = useState([]);
  const [scategory, setCategory] = useState([]);
  const [formData, setFormData] = useState({
    Name: '',
    Image: null,
  });
  const [age, setAge] = useState('');

  const categoryID = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8006/subcategory/get-single-sub-category/${categoryID.subcategory_id}`)
      .then((res) => {
        setCategory(res.data.data);
        console.log(res.data.data);
        setFormData({
          Name: res.data.data.Name || '',
          Image: null,
        });

        // Fetch the main categories here after setting scategory
        getSingleCategory(); // Pass the category ID to the function
      })
      .catch((err) => {
        console.log(err);
      });
  }, [categoryID.subcategory_id]); // Include categoryID.subcategory_id in the dependency array

  const getSingleCategory = () => {
    axios
      .get(`http://localhost:8006/category/get-categories`)
      .then((res) => {
        setMainCategory(res.data.data);
        console.log(res.data.data);
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

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataObject = new FormData();

    formDataObject.append('Name', formData.Name);
    formDataObject.append('Image', formData.Image);

    console.log(formData.Name);
    axios
      .put(`http://localhost:8006/subcategory/update-sub-category/${categoryID.subcategory_id}`, formDataObject)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          navigate('/dashboard/subcategory');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Container>
        <h1>Edit Sub-Category</h1>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'start', gap: 20 }}
        >
          <TextField type="text" name="Name" onChange={handleInputChange} value={formData.Name} />
          <InputLabel id="demo-simple-select-label">Select Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleChange}
          >
            {maincategory.map((elem, ind) => (
              <MenuItem key={elem._id} value={elem._id}>
                {elem.Name}
              </MenuItem>
            ))}
          </Select>

          <input type="file" name="image" onChange={handleFileChange} />
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </form>
      </Container>
    </>
  );
};

export default EditSubCategoryPage;
