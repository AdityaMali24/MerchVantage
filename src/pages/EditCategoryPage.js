import { Button, Container, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GlobalSnackbar from '../components/GlobalSnackBar';
// import GlobalSnackbar from 'src/components/GlobalSnackBar';

const EditCategoryPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState({});
  const [formData, setFormData] = useState({
    Name: '',
    Image: null,
  });

  const categoryID = useParams();
  console.log(categoryID.category_id);

  useEffect(() => {
    axios
      .get(`http://localhost:8006/category/get-single-category/${categoryID.category_id}`)
      .then((res) => {
        setCategory(res.data.data);
        console.log(res.data.data);
        setFormData({
          Name: res.data.data.Name || '',
          Image: null,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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

  // const submitHandler = () => {
  //   navigate('/dashboard/category');
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataObject = new FormData();

    formDataObject.append('Name', formData.Name);
    formDataObject.append('Image', formData.Image);

    console.log(formData.Name);
    axios
      .put(`http://localhost:8006/category/update-category/${categoryID.category_id}`, formDataObject)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setTimeout(() => {
            navigate('/dashboard/category');
          }, 3000);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Container>
        <h1>Edit Category</h1>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'start', gap: 20 }}
        >
          <TextField type="text" name="Name" onChange={handleInputChange} value={formData.Name} />
          {console.log(formData)}
          <input type="file" name="image" onChange={handleFileChange} />
          <Button type="submit" variant="contained">
            <GlobalSnackbar buttonText="Update" message="Category Updated Successfully" />
          </Button>
        </form>
      </Container>
    </>
  );
};

export default EditCategoryPage;
