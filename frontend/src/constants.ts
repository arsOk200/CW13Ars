import { styled, TableRow } from '@mui/material';

export const apiUrl = 'http://localhost:8001';
export const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#c7c7c7',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
