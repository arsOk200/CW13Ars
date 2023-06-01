import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useOutlet } from 'react-router-dom';
import FamilyList from '../components/Family/FamilyList';
import { FamilyMutation } from '../types';
import ModalBody from '../components/ModalBody';
import FamilyForm from '../components/Family/FamilyForm';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectCreateFamilyLoading, selectFamilyError } from '../features/family/familySlice';
import { toast } from 'react-toastify';
import { createFamily, fetchFamily } from '../features/family/familyThunk';

const Family = () => {
  const dispatch = useAppDispatch();
  const outlet = useOutlet();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const createLoading = useAppSelector(selectCreateFamilyLoading);
  const error = useAppSelector(selectFamilyError);

  const onFormSubmit = async (family: FamilyMutation) => {
    try {
      await dispatch(createFamily(family)).unwrap();
      await dispatch(fetchFamily()).unwrap();
      toast('family created!');
      setIsDialogOpen(false);
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  };
  return (
    <Box sx={{ py: 2 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item sx={{ marginBottom: '20px' }}>
          <Typography variant="caption" sx={{ color: 'black', fontWeight: 'bold' }}>
            Families
          </Typography>
          <Button sx={{ color: 'red' }} onClick={() => setIsDialogOpen(true)}>
            Create Family
          </Button>
        </Grid>
      </Grid>
      {isDialogOpen && (
        <ModalBody isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <FamilyForm error={error} onSubmit={onFormSubmit} Loading={createLoading} />
        </ModalBody>
      )}
      <Box>{!outlet ? <FamilyList /> : outlet}</Box>
    </Box>
  );
};

export default Family;
