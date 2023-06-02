import React from 'react';
import { CardActionArea, CardActions, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import family from '../../containers/Family';
import CardContent from '@mui/material/CardContent';
import { FamilyOne } from '../../types';

interface Props {
  addToFamilyCart: React.MouseEventHandler;
  family: FamilyOne;
}

const FamilyModalItem: React.FC<Props> = ({ addToFamilyCart, family }) => {
  return (
    <Card sx={{ maxWidth: 300, margin: '10px' }}>
      <CardActionArea onClick={addToFamilyCart}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Family: {family.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default FamilyModalItem;
