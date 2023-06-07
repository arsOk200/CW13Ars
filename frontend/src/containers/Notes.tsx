import React, { useEffect, useState } from 'react';
import { Alert, CircularProgress, Container, Paper, Typography } from '@mui/material';
import NoteForm from '../components/Notes/NoteForm';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectCreateNoteLoading,
  selectGetAllNoteLoading,
  selectNoteError,
  selectNoteList,
  selectOneNote,
  selectRemoveNoteLoading,
  selectUpdateNoteLoading,
} from '../features/notes/noteSlice';
import { createNote, fetchNote, fetchOneNote, removeNote, updateNote } from '../features/notes/noteThunk';
import useConfirm from '../components/Confirm&Alert/useConfirm';
import { toast } from 'react-toastify';
import { NoteMutation } from '../types';
import NoteItem from '../components/Notes/NoteItem';
import ModalBody from '../components/ModalBody';

const Notes = () => {
  const dispatch = useAppDispatch();
  const notes = useAppSelector(selectNoteList);
  const notesFetching = useAppSelector(selectGetAllNoteLoading);
  const createLoading = useAppSelector(selectCreateNoteLoading);
  const existingNote = useAppSelector(selectOneNote);
  const deleteLoading = useAppSelector(selectRemoveNoteLoading);
  const updateLoading = useAppSelector(selectUpdateNoteLoading);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const error = useAppSelector(selectNoteError);
  const [Id, setId] = useState('');
  const { confirm } = useConfirm();

  useEffect(() => {
    dispatch(fetchNote());
  }, [dispatch]);

  const onSubmit = async (NoteMutation: NoteMutation) => {
    try {
      await dispatch(createNote(NoteMutation)).unwrap();
      await dispatch(fetchNote()).unwrap();
      toast('Note created!');
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  };

  const removeNoteItemFunction = async (id: string) => {
    if (await confirm('Delete', 'Do you really want to delete?')) {
      await dispatch(removeNote(id)).unwrap();
      await dispatch(fetchNote()).unwrap();
      toast('Note deleted');
    } else {
      return;
    }
  };

  const onFormSubmit = async (ToChange: NoteMutation) => {
    if (await confirm('Edit', 'Do you really want to Edit?')) {
      try {
        await dispatch(updateNote({ id: Id, name: ToChange })).unwrap();
        await dispatch(fetchNote()).unwrap();
        setIsDialogOpen(false);
        toast('Note Edited');
      } catch (error) {
        throw new Error(`error: ${error}`);
      }
    } else {
      return;
    }
  };

  const openDialog = async (ID: string) => {
    await dispatch(fetchOneNote(ID));
    setId(ID);
    setIsDialogOpen(true);
  };
  return (
    <>
      <Typography sx={{ mb: 2 }} variant="h4">
        New Note
      </Typography>
      <NoteForm onSubmit={onSubmit} Loading={createLoading} error={error} />
      <Container>
        {error ? (
          <Alert sx={{ mb: 2 }} severity="error">
            {error.name}
          </Alert>
        ) : (
          ''
        )}
        <Paper elevation={3} sx={{ width: '100%', height: '500px', overflowX: 'hidden' }}>
          {!notesFetching ? (
            notes.length !== 0 ? (
              notes.map((note) => (
                <NoteItem
                  key={note._id}
                  note={note}
                  removeNoteItem={() => removeNoteItemFunction(note._id)}
                  onEditing={() => openDialog(note._id)}
                  deleteLoading={deleteLoading}
                />
              ))
            ) : (
              <Alert severity="warning">there are no notes</Alert>
            )
          ) : (
            <CircularProgress />
          )}
        </Paper>
        {existingNote && (
          <ModalBody isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
            <NoteForm error={error} onSubmit={onFormSubmit} existing={existingNote} isEdit Loading={updateLoading} />
          </ModalBody>
        )}
      </Container>
    </>
  );
};

export default Notes;
