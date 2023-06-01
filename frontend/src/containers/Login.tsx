import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, Avatar, Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { LoginMutation } from '../types';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { googleLogin, login } from '../features/user/userThunks';
import { selectLoginError, selectLoginLoading } from '../features/user/userSlice';

const Login = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectLoginError);
  const loading = useAppSelector(selectLoginLoading);
  const navigate = useNavigate();
  const [firstColor, setFirstColor] = useState('');
  const [secondColor, setSecondColor] = useState('');
  const generateRandomGradient = () => {
    let red = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue = Math.floor(Math.random() * 256);
    const startColor = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
    red = Math.floor(Math.random() * 256);
    green = Math.floor(Math.random() * 256);
    blue = Math.floor(Math.random() * 256);
    const endColor = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
    setFirstColor(startColor);
    setSecondColor(endColor);
  };
  useEffect(() => {
    generateRandomGradient();
  }, [dispatch]);
  const [state, setState] = useState<LoginMutation>({
    username: '',
    password: '',
  });

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    await dispatch(login(state)).unwrap();
    navigate('/');
  };

  return (
    <Container
      component="main"
      maxWidth={'xl'}
      sx={{
        backgroundImage: `linear-gradient(to right, ${firstColor}, ${secondColor})`,
        borderRadius: '200px 10px 200px 10px',
      }}
    >
      <Box
        style={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 3, bgcolor: 'black' }}>
          <LockOpenIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 3, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            {error.error}
          </Alert>
        )}
        <Box component="form" onSubmit={submitFormHandler} sx={{ mt: 3 }}>
          <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                label="Username"
                name="username"
                autoComplete="current-username"
                value={state.username}
                onChange={inputChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={state.password}
                onChange={inputChangeHandler}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color={'inherit'}
            sx={{ mt: 3, mb: 2, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            disabled={loading}
          >
            Sign In
          </Button>
          <Grid container justifyContent="flex-end" sx={{ mb: 2 }}>
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2" sx={{ color: 'black' }}>
                Or sign up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
