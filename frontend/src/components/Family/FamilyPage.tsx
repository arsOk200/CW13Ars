import React, { useEffect } from 'react';
import {
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectOneFamily, selectOneFamilyLoading } from '../../features/family/familySlice';
import { useParams } from 'react-router-dom';
import { fetchOneFamily, LeaveFromFamily } from '../../features/family/familyThunk';
import BackHandIcon from '@mui/icons-material/BackHand';
import FamilyPageUsers from './FamilyPageUsers';
import FamilyPageProducts from './FamilyPageProducts';
import { removeFromUsersCart } from '../../features/products/productsThunk';
import useConfirm from '../Confirm&Alert/useConfirm';

const FamilyPage = () => {
  const dispatch = useAppDispatch();
  const oneFamily = useAppSelector(selectOneFamily);
  const fetchingOnefamily = useAppSelector(selectOneFamilyLoading);
  const {id} = useParams() as { id: string };
  const FamilyUsers = oneFamily?.users;
  const {confirm} = useConfirm();
  useEffect(() => {
    if (id) {
      dispatch(fetchOneFamily(id));
    }
  }, [dispatch, id]);

  const onDelete = async (userID: string) => {
    if (await confirm('Delete', 'Do you reaally want to delete?')) {
      await dispatch(LeaveFromFamily({familyID: id, userID: userID}));
      await dispatch(fetchOneFamily(id));
    } else {
      return;
    }
  };
  const deleteProductFromFamily = async (ID: string) => {
    if (await confirm('Delete', 'Do you reaally want to delete?')) {
      await dispatch(removeFromUsersCart({idProduct: ID, idFamily: id}));
      await dispatch(fetchOneFamily(id));
    } else {
      return;
    }
  };
  console.log(oneFamily?.owner);
  return (
    <>
      <Typography sx={{mb: 2}} variant="h4">
        Family: {oneFamily?.name}
      </Typography>
      {!fetchingOnefamily ? (
        oneFamily?.owner ? (
          <Typography key={oneFamily?.owner._id} sx={{mb: 2}} variant="h4">
            owner: {oneFamily?.owner.displayName}
          </Typography>
        ) : (
          <>
            <BackHandIcon fontSize="large"/>
            <Typography variant="h5" sx={{marginLeft: '5px'}}>
              No Owners
            </Typography>
          </>
        )
      ) : (
        <CircularProgress/>
      )}

      <Paper elevation={3} sx={{width: '100%', height: '500px', overflowX: 'hidden', marginBottom: '30px'}}>
        <TableContainer>
          <Table sx={{minWidth: 650}} aria-label="simple table">
            <TableHead sx={{bgcolor: '#252525'}}>
              <TableRow>
                <TableCell align="left" sx={{color: 'white'}}>
                  Users
                </TableCell>
                <TableCell align="right" sx={{color: 'white'}}>
                  Manegment
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!fetchingOnefamily ? (
                oneFamily?.users.length !== 0 ? (
                  oneFamily?.users.map((USER) => (
                    <FamilyPageUsers
                      key={USER._id}
                      user={USER}
                      Leave={() => onDelete(USER._id)}
                      owner={oneFamily?.owner}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell>
                      <Alert severity="warning">there are no users</Alert>
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell>
                    <CircularProgress/>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Typography variant="h4" sx={{color: 'black'}}>
        Family Cart
      </Typography>
      <Paper elevation={3} sx={{width: '100%', height: '500px', overflowX: 'hidden'}}>
        <TableContainer>
          <Table sx={{minWidth: 650}} aria-label="simple table">
            <TableHead sx={{bgcolor: '#252525'}}>
              <TableRow>
                <TableCell align="left" sx={{color: 'white'}}>
                  products
                </TableCell>
                <TableCell align="right" sx={{color: 'white'}}>
                  Manegment
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!fetchingOnefamily ? (
                oneFamily?.cart.length !== 0 ? (
                  oneFamily?.cart.map((product) => (
                    <FamilyPageProducts
                      key={product._id}
                      product={product}
                      FamilyUsers={FamilyUsers!}
                      deleteFromCart={() => deleteProductFromFamily(product._id)}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell>
                      <Alert severity="warning">there are no products</Alert>
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell>
                    <CircularProgress/>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default FamilyPage;
