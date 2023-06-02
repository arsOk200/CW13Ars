import React, { useEffect, useState } from 'react';
import FamilyItem from '../Family/FamilyItem';
import BackHandIcon from '@mui/icons-material/BackHand';
import { CircularProgress, Container, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectDeletingFamily,
  selectGetAllFamilyLoading,
  selectOneFamily,
  selectFamilyError,
  selectFamilyList,
  selectUpdateFamilyLoading,
} from '../../features/family/familySlice';
import { useParams } from 'react-router-dom';
import useConfirm from '../Confirm&Alert/useConfirm';
import {
  fetchOneFamily,
  fetchFamily,
  removeFamily,
  updateFamily,
  addToFamily,
  LeaveFromFamily,
} from '../../features/family/familyThunk';
import { toast } from 'react-toastify';
import { FamilyMutation } from '../../types';
import ModalBody from '../ModalBody';
import FamilyForm from './FamilyForm';

const FamilyList = () => {
  const dispatch = useAppDispatch();
  const family = useAppSelector(selectFamilyList);
  const familyLoading = useAppSelector(selectGetAllFamilyLoading);
  const deletingFamily = useAppSelector(selectDeletingFamily);
  const oneFamily = useAppSelector(selectOneFamily);
  const updateLoading = useAppSelector(selectUpdateFamilyLoading);
  const error = useAppSelector(selectFamilyError);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [IDFor, setIdFor] = useState('');
  const { id } = useParams();
  const { confirm } = useConfirm();

  useEffect(() => {
    dispatch(fetchFamily());
  }, [dispatch, id]);

  const deleteFamily = async (ID: string) => {
    if (await confirm('Delete', 'Do you really want to delete?')) {
      await dispatch(removeFamily(ID));
      await dispatch(fetchFamily());
      toast('Family deleted');
    } else {
      return;
    }
  };

  const AddToGroup = async (FamilyId: string) => {
    await dispatch(addToFamily(FamilyId));
    await dispatch(fetchFamily());
  };

  const LeaveFromGroup = async (FamilyId: string) => {
    if (await confirm('', 'Do you really want to Join?')) {
      await dispatch(LeaveFromFamily(FamilyId));
      await dispatch(fetchFamily());
    }
  };
  const openDialog = async (ID: string) => {
    await dispatch(fetchOneFamily(ID));
    setIdFor(ID);
    setIsDialogOpen(true);
  };

  const onFormSubmit = async (ToChange: FamilyMutation) => {
    if (await confirm('Edit', 'Do you really want to Edit?')) {
      try {
        await dispatch(updateFamily({ id: IDFor, name: ToChange })).unwrap();
        await dispatch(fetchFamily()).unwrap();
        setIsDialogOpen(false);
        toast('Family Edited');
      } catch (error) {
        throw new Error(`error: ${error}`);
      }
    } else {
      return;
    }
  };
  return (
    <Container sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
      {!familyLoading ? (
        family.length !== 0 ? (
          family.map((family) => (
            <FamilyItem
              key={family._id}
              family={family}
              deleteFamily={() => deleteFamily(family._id)}
              deletingFamily={deletingFamily}
              onEditing={() => openDialog(family._id)}
              getInFamily={() => AddToGroup(family._id)}
              leaveFamily={() => LeaveFromGroup(family._id)}
            />
          ))
        ) : (
          <>
            <BackHandIcon fontSize="large" />
            <Typography variant="h5" sx={{ marginLeft: '5px' }}>
              There are no families at the moment!
            </Typography>
          </>
        )
      ) : (
        <CircularProgress />
      )}
      {oneFamily && (
        <ModalBody isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <FamilyForm error={error} existing={oneFamily} onSubmit={onFormSubmit} Loading={updateLoading} isEdit />
        </ModalBody>
      )}
    </Container>
  );
};

export default FamilyList;
