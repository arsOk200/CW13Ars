import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography, CircularProgress } from '@mui/material';
import { CategoryMutation, ValidationError } from '../../types';

interface Props {
  onSubmit: (category: CategoryMutation) => void;
  existing?: CategoryMutation;
  isEdit?: boolean;
  Loading: boolean;
  error: ValidationError | null;
}

const initialState: CategoryMutation = {
  name: '',
};

const CategoryForm: React.FC<Props> = ({ onSubmit, error, Loading, isEdit, existing = initialState }) => {
  const [state, setState] = useState<CategoryMutation>(existing);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(state);
    setState({ name: '' });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
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
        {Loading ? <CircularProgress /> : isEdit ? 'Edit category' : 'Create category'}
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '70%' }} onSubmit={onFormSubmit}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Category"
              type="text"
              name="name"
              autoComplete="off"
              value={state.name}
              onChange={onChange}
              error={Boolean(getFieldError('name'))}
              helperText={getFieldError('name')}
            />
          </Grid>
        </Grid>
        <Button
          disabled={Loading}
          type="submit"
          fullWidth
          variant="contained"
          color="info"
          sx={{ mt: 3, mb: 2, bgcolor: 'black' }}
        >
          {Loading ? <CircularProgress /> : isEdit ? 'Edit' : 'Create'}
        </Button>
      </Box>
    </Box>
  );
};

export default CategoryForm;
