import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography, CircularProgress } from '@mui/material';
import { ValidationError } from '../../types';
import { NoteMutation } from '../../types';

interface Props {
  onSubmit: (note: NoteMutation) => void;
  existing?: NoteMutation;
  isEdit?: boolean;
  Loading: boolean;
  error: ValidationError | null;
}

const initialState: NoteMutation = {
  text: '',
  title: '',
};

const NoteForm: React.FC<Props> = ({ onSubmit, error, Loading, isEdit, existing = initialState }) => {
  const [state, setState] = useState<NoteMutation>(existing);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(state);
    setState({ text: '', title: '' });
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
        {Loading ? <CircularProgress /> : isEdit ? 'Edit note' : 'Create note'}
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '70%' }} onSubmit={onFormSubmit}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Title"
              type="text"
              name="title"
              autoComplete="off"
              value={state.title}
              onChange={onChange}
              error={Boolean(getFieldError('title'))}
              helperText={getFieldError('title')}
            />
          </Grid>
          <Grid item>
            <TextField
              required
              fullWidth
              multiline
              rows={5}
              label="Text"
              type="text"
              name="text"
              autoComplete="off"
              value={state.text}
              onChange={onChange}
              error={Boolean(getFieldError('text'))}
              helperText={getFieldError('text')}
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

export default NoteForm;
