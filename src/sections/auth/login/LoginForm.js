import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, IconButton, InputAdornment, TextField, Checkbox, Link } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import GlobalSnackbar from '../../../components/GlobalSnackBar';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    fetch('http://localhost:8006/user/Admin-Login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.get('email'),
        password: data.get('password'),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success === true) {
          localStorage.setItem('token', data.token);
          // setTimeout(() => {
          //   navigate('/dashboard');
          // }, 3000);
          const userDetails = data.data._id;
          localStorage.setItem('userDetails', userDetails);
          navigate('/dashboard', { replace: true });

          // console.log(userDetails);
        }
      })
      .catch((err) => console.log(err));
  };

  // const handleClick = () => {
  //   navigate('/dashboard', { replace: true });
  // };

  return (
    <form onSubmit={handleSubmit}>
    <Stack spacing={3}>
      <TextField name="email" label="Email address" value={formData.email} onChange={handleFormChange} required />

      <TextField
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleFormChange}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Stack>

    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
      <Checkbox name="remember" label="Remember me" />
      <Link variant="subtitle2" underline="hover">
        Forgot password?
      </Link>
    </Stack>

    <LoadingButton fullWidth size="large" type="submit" variant="contained">
      <GlobalSnackbar buttonText="Login" message="Welcome Back Chief" />
    </LoadingButton>
  </form>
  );
}
