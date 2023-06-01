import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FamilyList } from '../../types';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/user/userSlice';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Navigate, useNavigate } from 'react-router-dom';

interface Props {
  family: FamilyList;
  deleteFamily: React.MouseEventHandler;
  deletingFamily: string | false;
  onEditing: React.MouseEventHandler;
  getInFamily: React.MouseEventHandler;
  leaveFamily: React.MouseEventHandler;
}

const FamilyItem: React.FC<Props> = ({ family, deleteFamily, deletingFamily, onEditing, getInFamily, leaveFamily }) => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  let buttons;
  let name;
  let secondButtons;
  if (!user) {
    return <Navigate to="/" />;
  }

  const find = family.users.some((Users) => Users._id === user._id);

  if (user?.role === 'admin' || user?._id === family.owner._id) {
    buttons = (
      <>
        <Button
          disabled={deletingFamily ? deletingFamily === family._id : false}
          size="small"
          sx={{ color: 'black' }}
          onClick={deleteFamily}
        >
          <DeleteIcon />
        </Button>
        <Button size="small" sx={{ color: 'black' }} onClick={onEditing}>
          <EditIcon />
        </Button>
      </>
    );
  }
  if (user._id === family.owner._id) {
    secondButtons = <></>;
  } else if (!find) {
    secondButtons = (
      <Button size="small" sx={{ color: 'black' }} onClick={getInFamily}>
        <PersonAddIcon />
      </Button>
    );
  } else if (find) {
    secondButtons = (
      <Button size="small" sx={{ color: 'black' }}>
        <ExitToAppIcon onClick={leaveFamily} />
      </Button>
    );
  }
  if (family.owner.displayName === user?.displayName) {
    name = <>You</>;
  } else {
    name = family.owner.displayName;
  }

  return (
    <Card sx={{ maxWidth: 300, margin: '10px' }}>
      <CardActionArea onClick={() => navigate('/family/' + family._id)}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Family: {family.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Owner: {name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {buttons}
        {secondButtons}
      </CardActions>
    </Card>
  );
};

export default FamilyItem;
