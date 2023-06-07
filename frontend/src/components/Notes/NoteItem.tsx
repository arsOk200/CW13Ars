import React from 'react';
import { CardActions, CircularProgress, IconButton, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { NoteList } from '../../types';

interface Props {
  note: NoteList;
  removeNoteItem: React.MouseEventHandler;
  onEditing: React.MouseEventHandler;
  deleteLoading: string | false;
}

const NoteItem: React.FC<Props> = ({ note, removeNoteItem, onEditing, deleteLoading }) => {
  return (
    <Card sx={{ width: '98%', margin: '20px 5px', border: '1px solid black' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {note.title}
        </Typography>
        <Typography variant="body2">{note.text}</Typography>
      </CardContent>
      <CardActions>
        <IconButton
          disabled={deleteLoading ? deleteLoading === note._id : false}
          aria-label="delete"
          onClick={removeNoteItem}
        >
          {deleteLoading && deleteLoading === note._id && <CircularProgress />}
          <DeleteIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={onEditing}>
          <EditIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default NoteItem;
