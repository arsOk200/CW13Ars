import React, { useEffect } from 'react';
import {
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  TableHead,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectOneFamily, selectOneFamilyLoading } from '../../features/family/familySlice';
import { useParams } from 'react-router-dom';
import { fetchOneFamily, LeaveFromFamily } from '../../features/family/familyThunk';
import BackHandIcon from '@mui/icons-material/BackHand';
import FamilyPageUsers from './FamilyPageUsers';
const FamilyPage = () => {
  const dispatch = useAppDispatch();
  const oneFamily = useAppSelector(selectOneFamily);
  const fetchingOnefamily = useAppSelector(selectOneFamilyLoading);
  const { id } = useParams() as { id: string };
  useEffect(() => {
    if (id) {
      dispatch(fetchOneFamily(id));
    }
  }, [dispatch, id]);

  const onDelete = async (userId: string) => {
    await dispatch(LeaveFromFamily(userId));
    await dispatch(fetchOneFamily(id));
  };
  return (
    <>
      <Typography sx={{ mb: 2 }} variant="h4">
        Family: {oneFamily?.name}
      </Typography>
      {!fetchingOnefamily ? (
        oneFamily?.owner.length ? (
          oneFamily?.owner.map((user) => (
            <Typography key={user._id} sx={{ mb: 2 }} variant="h4">
              owner: {user.displayName}
            </Typography>
          ))
        ) : (
          <>
            <BackHandIcon fontSize="large" />
            <Typography variant="h5" sx={{ marginLeft: '5px' }}>
              No Owners
            </Typography>
          </>
        )
      ) : (
        <CircularProgress />
      )}

      <Paper elevation={3} sx={{ width: '100%', height: '500px', overflowX: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ bgcolor: '#252525' }}>
              <TableRow>
                <TableCell align="left" sx={{ color: 'white' }}>
                  Users
                </TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>
                  Manegment
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!fetchingOnefamily ? (
                oneFamily?.users.length !== 0 ? (
                  oneFamily?.users.map((USER) => (
                    <FamilyPageUsers key={USER._id} user={USER} Leave={() => onDelete(id)} />
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
                    <CircularProgress />
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
