import { Button, Container, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddSubCategoryPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [maincategory, setMainCategory] = useState([]);
  const [age, setAge] = useState('');

  const imgRef = useRef();
  const onClickHandler = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('Name', data.name);
    formData.append('category', data.category);
    formData.append('Image', imgRef.current.files[0]);
    console.log(data, data.category);

    fetch('http://localhost:8006/subcategory/add-category', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          navigate('/dashboard/subcategory');
        }
        return response.json();
      })

      .catch((error) => {
        // Handle errors here
        console.error('Error:', error);
        alert('Failed to add category'); // You can replace this with your error handling logic
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8006/category/get-categories`)
      .then((res) => {
        setMainCategory(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleChange = (event) => {
    setData({ ...data, category: event.target.value });
  };

  return (
    <>
      <Container>
        <h1>Add Sub-Category</h1>
        <form
          style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'start', gap: 20 }}
          onSubmit={onClickHandler}
        >
          <TextField type="text" onChange={onChangeHandler} name="name" label="Category Name" />
          <InputLabel id="demo-simple-select-label">Select Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={data.category}
            label="Age"
            onChange={handleChange}
          >
            {maincategory.map((elem, ind) => (
              <MenuItem key={elem._id} value={elem._id}>
                {elem.Name}
              </MenuItem>
            ))}
          </Select>
          <input type="file" ref={imgRef} name="Image" />
          <Button type="submit" variant="contained" style={{ margin: '20px 0px' }}>
            Add
          </Button>
        </form>
      </Container>
    </>
  );
};

export default AddSubCategoryPage;
