import React from 'react';
import { CardActionArea, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { FamilyOne } from '../../types';

interface Props {
  addToFamilyCart: React.MouseEventHandler;
  family: FamilyOne;
}

const FamilyModalItem: React.FC<Props> = ({ addToFamilyCart, family }) => {
  return (
    <Card sx={{ width: '100%', margin: '10px' }}>
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
