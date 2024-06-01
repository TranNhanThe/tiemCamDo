
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import ChecklistIcon from '@mui/icons-material/Checklist';
import SearchIcon from '@mui/icons-material/Search';
import { Dialog, DialogActions, DialogContent, DialogTitle, Select, FormControl, MenuItem, InputLabel } from '@mui/material';

// import logo from '../../public/logo192.png';
import logo from '../logo.svg';
import loading from '../loading.png';
import fishy from '../fishy.jpg';
import spin from '../spin.mp3';

import EditPopUp from './EditPopUp';
import AddPopUp from './AddPopUp';



//=============================================================================

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

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'todo_name',
    numeric: false,
    disablePadding: true,
    label: 'Tasks',
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'edit',
    numeric: true,
    disablePadding: false,
    label: 'Edit',
  }
];

//======================================================================================

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />

        </TableCell>

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <h2>{headCell.label}</h2>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>


  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

//=================================================================================

function EnhancedTableToolbar({ numSelected, selected, setSelected, setRows }) {
  const handleDelete = async () => {
    try {
      const response = await axios.delete('http://localhost:5000/todo/delete', {
        data: { ids: selected },
      });

      if (response.status === 200) {
        console.log('Todos deleted successfully');
        // Không cần gửi yêu cầu GET sau khi xóa
        // Cập nhật UI với danh sách todo đã được xóa
        const updatedResponse = await axios.get('http://localhost:5000/todo');
        const updatedTodos = updatedResponse.data;
        setRows(updatedTodos);
        setSelected([]);
      } else {
        console.error('Failed to delete todos');
      }
    } catch (error) {
      console.error('Error deleting todos:', error);
    }
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleUpdateRows = (updatedTodos) => {
    setRows(updatedTodos);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"

          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h5"
          id="tableTitle"
          component="div"
        >
          Todolist
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Add Todo">
        <IconButton>
          <AddPopUp onSubmit={handleUpdateRows} />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};


//======================================[DEFAULT FUNCTION]===================================================

export default function EnhancedTodo() {
  const [rows, setRows] = useState([]);
  const [cloneRows, setClonerows] = useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [showRow, setShowRow] = React.useState({});
  const [status, setStatus] = useState();
  const inputRef = useRef(null);

  //handleSubmit

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  useEffect(() => {
    axios.get('http://localhost:5000/todo')
      .then(response => {
        setRows(response.data);
        setClonerows(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );

  const handleShowRow = (rowId) => {
    setShowRow(prevState => ({
      ...prevState,
      [rowId]: !prevState[rowId] // Đảo ngược trạng thái hiển thị của hàng có id là rowId
    }));
  };
  const handleUpdateRows = (updatedTodos) => {
    setRows(updatedTodos);
  };

  const [searchValue, setSearchValue] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };


  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedSearchValue = searchValue.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let filteredTodos = cloneRows;
  
    if (selectedValue) {
      const normalizedStatus = selectedValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      filteredTodos = filteredTodos.filter(row => row.status.toLowerCase() === normalizedStatus.toLowerCase());
    }
    console.log('status spoted:' + filteredTodos.status)
  
    filteredTodos = filteredTodos.filter(row => {
      const normalizedTodoName = row.todo_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return normalizedTodoName.toLowerCase().includes(trimmedSearchValue.toLowerCase());
    });
    console.log(filteredTodos)
  
    setRows(filteredTodos);
  }

  
  //------------View---------------
  return (
    <div>
      <br />

      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TextField
          inputRef={inputRef}
          name="todo_name"
          id="outlined-basic"
          label="Tìm Task"
          variant="outlined"
          style={{ width: '50%', height: '50px' }}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        
        <FormControl fullWidth style={{ width: '30%',marginTop: '5px' }}>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedValue}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value={''}>Tất cả</MenuItem>
            <MenuItem value={'Pending'}>Pending</MenuItem>
            <MenuItem value={'Doing'}>Doing</MenuItem>
            <MenuItem value={'Done'}>Done</MenuItem>
          </Select>
        </FormControl>



        <Button type="submit" variant="contained" color="primary" style={{ height: '55px', marginTop: '5px' }}>
        <SearchIcon/>
        </Button>
      </form>

      <br />
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            selected={selected}
            setSelected={setSelected}
            setRows={setRows}
          />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (

                    <TableRow
                      hover
                      // onClick={(event) => handleClick(event, row._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          onClick={(event) => handleClick(event, row._id)}
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />

                      </TableCell>

                      <TableCell
                        component="th"
                        id={labelId}
                        onClick={(event) => { handleClick(event, row._id) }}
                        scope="row"
                        padding="none"
                      >
                        {row.todo_name}
                      </TableCell>
                      <TableCell align="right">{row.status}</TableCell>
                      <TableCell align="right">
                        <EditPopUp
                          id={(row._id).toString()}
                          name={(row.todo_name).toString()}
                          status={(row.status).toString()}
                          onSubmit={handleUpdateRows}
                        />
                      </TableCell>

                      {/* {showRow[row._id] && <PopupForm 
                        id={(row._id).toString()}
                      />} */}


                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Box>
    </div>

  );
}