import React, { useState } from 'react';
import { Alert, Box, Button, Grid, TextField, Typography } from '@mui/material';
import { UserMutation, ValidationError } from '../types';
import FileInput from './FileInput/FileInput';

interface Props {
  onSubmit: (user: UserMutation) => void;
  existingUser?: UserMutation;
  isEdit?: boolean;
  isLoading: boolean;
  error: ValidationError | null;
}

const initialState: UserMutation = {
  username: '',
  displayName: '',
  image: null,
  password: '',
};

const UserForm: React.FC<Props> = ({ onSubmit, existingUser = initialState, isEdit, isLoading, error }) => {
  const [state, setState] = useState<UserMutation>(existingUser);

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(state);
  };

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    setState((prevState) => ({
      ...prevState,
      [name]: files && files[0] ? files[0] : null,
    }));
  };

  return (
    <Box
      sx={{
        mt: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5">
        Edit Profile
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mt: 3, width: '100%' }}>
          {error.message}
        </Alert>
      )}
      <Box component="form" onSubmit={submitFormHandler} sx={{ mt: 3, width: '100%' }}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="UserName"
              type="text"
              name="username"
              autoComplete="off"
              value={state.username}
              onChange={inputChangeHandler}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Display name"
              name="displayName"
              autoComplete="off"
              value={state.displayName}
              onChange={inputChangeHandler}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required={!isEdit}
              fullWidth
              label="New password"
              name="password"
              type="password"
              autoComplete="off"
              value={state.password}
              onChange={inputChangeHandler}
            />
          </Grid>
          <Grid item lg>
            <FileInput onChange={fileInputChangeHandler} name="image" label="Image" />
          </Grid>
          {error ? (
            <Alert sx={{ mb: 2 }} severity="error">
              {error.message}
            </Alert>
          ) : (
            ''
          )}
        </Grid>
        <Button
          disabled={
            state.username === '' || state.displayName === '' || isLoading || (!isEdit && state.password === '')
          }
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, bgcolor: 'black', color: 'white' }}
        >
          Edit
        </Button>
      </Box>
    </Box>
  );
};
export default UserForm;
