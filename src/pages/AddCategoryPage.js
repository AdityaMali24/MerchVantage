import { Button, Container, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalSnackbar from '../components/GlobalSnackBar';

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const imgRef = useRef();
  const onClickHandler = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('Name', data.name);
    formData.append('Image', imgRef.current.files[0]);
    console.log(data.name);
    console.log(formData)

    fetch('http://localhost:8006/category/add-category', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // You can parse the response if it returns JSON
      })
      .then(() => {
        // Handle the response data here, if needed
        setTimeout(() => {
          navigate('/dashboard/category');
        }, 3000);
        console.log(formData);
      })
      .catch((error) => {
        // Handle errors here
        console.error('Error:', error);
        alert('Failed to add category'); // You can replace this with your error handling logic
      });
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    console.log(data);
  };

  return (
    <>
      <Container>
        <h1>Add Category</h1>
        <form
          onSubmit={onClickHandler}
          style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'start', gap: 20 }}
        >
          <TextField type="text" onChange={onChangeHandler} name="name" label="Category Name" />
          <input type="file" ref={imgRef} name="Image" />
          <Button type="submit" variant="contained" style={{ margin: '20px 0px' }}>
            <GlobalSnackbar buttonText="Add" message="Category added successfully!" />
          </Button>
        </form>
      </Container>
    </>
  );
};

export default AddCategoryPage;
