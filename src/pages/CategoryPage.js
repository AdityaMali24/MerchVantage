import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import axios from 'axios';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  // Link,
} from '@mui/material';
import { NavLink } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom/dist';

// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Name', label: 'Name', alignRight: false },
  { id: 'Image', label: 'Image', alignRight: false },
  { id: 'createdAt', label: 'createdAt', alignRight: false },
  { id: 'Customize', label: 'Customize', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('Name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [categoryData, setcategoryData] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    // Function to fetch user data
    const fetchcategoryData = async () => {
      try {
        const response = await axios.get('http://localhost:8006/category/get-categories'); // Replace with your API endpoint
        if (response.status === 200) {
          setcategoryData(response.data.data); // Update the user data state with the fetched data
          console.log(response.data.data); // Update the user data state with the fetched data
        }
      } catch (error) {
        // Handle any errors here
        console.error('Error fetching user data:', error);
      }
    };

    // Call the fetchcategoryData function when the component mounts
    fetchcategoryData();
  }, []);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = categoryData.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const categoryHandler = () => {
    navigate('/dashboard/add-category');
  };

  const onDeleteHandler = (categoryid) => {
    axios
      .delete(`http://localhost:8006/category/delete-category/${categoryid}`)
      .then(() => {
        console.log('Category Deleted');
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - categoryData.length) : 0;

  const filteredCategory = applySortFilter(categoryData, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredCategory.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Category
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={categoryHandler}>
            New Category
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={categoryData.length} // Update the row count based on fetched data
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredCategory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, Name, Image, createdAt } = row;
                    const selectedUser = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, _id)} />
                        </TableCell>
                        <TableCell align="left">{Name}</TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <img
                              alt="io"
                              src={`http://localhost:8006/uploads/category/${Image}`}
                              width={50}
                              height={50}
                              style={{ borderRadius: '50%' }}
                            />
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{createdAt}</TableCell>
                        <TableCell>
                          <MenuItem sx={{ color: 'error.main' }}>
                            <Iconify icon={'eva:edit-2-outline'} sx={{ mr: 2 }} />
                            {console.log(filteredCategory)}
                            <Link to={`edit/${_id}`}>
                              {/* {console.log(`dashboard/edit/${_id}`)} */}
                              Edit
                            </Link>
                          </MenuItem>
                          <MenuItem sx={{ color: 'error.main' }}>
                            <Button style={{ color: 'red' }} onClick={() => onDeleteHandler(_id)}>
                            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                            Delete
                            </Button>
                          </MenuItem>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={categoryData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
