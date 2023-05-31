import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import {
  createCategory,
  fetchCategory,
  fetchOneCategory,
  removeCategory,
  updateCategory,
} from '../../features/category/CategoryThunk';
import { CategoryMutation } from '../../types';
import {
  selectCategoryError,
  selectCategoryList,
  selectCreateCategoryLoading,
  selectGetAllCategoryLoading,
  selectOneCategory,
  selectUpdateCategoryLoading,
} from '../../features/category/CategorySlice';
import CategoryForm from './CategoryForm';
import ModalBody from '../ModalBody';
import useConfirm from '../Confirm&Alert/useConfirm';
import CategoryItem from './CategoryItem';

const CreateCategory = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectCategoryError);
  const existingCategory = useAppSelector(selectOneCategory);
  const createLoading = useAppSelector(selectCreateCategoryLoading);
  const updateLoading = useAppSelector(selectUpdateCategoryLoading);
  const categories = useAppSelector(selectCategoryList);
  const fetchLoading = useAppSelector(selectGetAllCategoryLoading);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [Id, setId] = useState('');
  const { confirm } = useConfirm();

  const onSubmit = async (CategoryMutation: CategoryMutation) => {
    try {
      await dispatch(createCategory(CategoryMutation)).unwrap();
      await dispatch(fetchCategory()).unwrap();
      toast('Category created!');
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  };

  const openDialog = async (ID: string) => {
    await dispatch(fetchOneCategory(ID));
    setId(ID);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);

  const removeCardCategory = async (id: string) => {
    if (await confirm('Delete', 'Do you reaally want to delete?')) {
      await dispatch(removeCategory(id)).unwrap();
      await dispatch(fetchCategory()).unwrap();
      toast('Category deleted');
    } else {
      return;
    }
  };

  const onFormSubmit = async (ToChange: CategoryMutation) => {
    if (await confirm('Edit', 'Do you really want to Edit?')) {
      try {
        await dispatch(updateCategory({ id: Id, name: ToChange })).unwrap();
        await dispatch(fetchCategory()).unwrap();
        setIsDialogOpen(false);
        toast('Category Edited');
      } catch (error) {
        throw new Error(`error: ${error}`);
      }
    } else {
      return;
    }
  };
  return (
    <>
      <Typography sx={{ mb: 2 }} variant="h4">
        New category
      </Typography>
      <CategoryForm onSubmit={onSubmit} error={error} Loading={createLoading} />
      <Box sx={{ mb: 4 }}>
        <Container>
          <Paper elevation={3} sx={{ width: '100%', height: '500px', overflowX: 'hidden' }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableBody>
                  {!fetchLoading ? (
                    categories.length !== 0 ? (
                      categories.map((category) => (
                        <CategoryItem
                          key={category._id}
                          category={category}
                          removeCategoryItem={() => removeCardCategory(category._id)}
                          onEditing={() => openDialog(category._id)}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell>
                          <Alert severity="warning">there are no categories</Alert>
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
        </Container>
        {existingCategory && (
          <ModalBody isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
            <CategoryForm
              error={error}
              onSubmit={onFormSubmit}
              existing={existingCategory}
              isEdit
              Loading={updateLoading}
            />
          </ModalBody>
        )}
      </Box>
    </>
  );
};

export default CreateCategory;
