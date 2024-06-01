import React, { useState, useRef } from 'react';
import { Button, Box, Dialog, Snackbar, DialogActions, DialogContent, DialogTitle, TextField, Select, FormControl, MenuItem, InputLabel } from '@mui/material';
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import AddBoxIcon from '@mui/icons-material/AddBox';
import FormHelperText from '@mui/material/FormHelperText';

import axios from 'axios';

const AddPopUp = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState();
  const [status, setStatus] = useState();

  // console.log('edited Status:' + editedStatus)
  // console.log('edited Status:' + editedName)

  const [nameError, setNameError] = useState('');
  const [statusError, setStatusError] = useState('');
  const [success, setSuccess] = useState('');
  
  const validate = () => {
    let isValid = true;

    if (!name) {
      setNameError('Task name is required');
      
      isValid = false;
    } else {
      setNameError('');
      
    }

    if (!status) {
      setStatusError('Status is required');
     
      isValid = false;
    } else {
      setStatusError('');
      
    }

    if (!name || !status){
      setSuccess('');
    } else {
      setSuccess('Thêm thành công');
    }

    return isValid;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setName('');
    setStatus('');
    setOpen(false);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };


  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const inputRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      try {
        const response = await fetch('http://localhost:5000/todo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ todo_name: name, status: status }),
        });

        if (response.ok) {
          console.log('Todo added successfully');
          // Fetch the updated list of todos
          const updatedResponse = await fetch('http://localhost:5000/todo');
          const updatedTodos = await updatedResponse.json();
          // Update the UI with the updated list of todos
          onSubmit(updatedTodos);
          inputRef.current.focus();
          setName('');
          
        } else {
          console.error('Failed to add todo');
        }
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };
  return (
    <div>
      <AddBoxIcon onClick={handleClickOpen} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <Box margin={2}>
            <TextField
              inputRef={inputRef}
              label="Task"
              value={name}
              onChange={handleNameChange}
              variant="outlined"
              error={!!nameError}
              helperText={nameError}
              fullWidth />
          </Box>
          <Box margin={2}>
            <FormControl fullWidth error={!!statusError}>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select 
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                onChange={handleChange}
              >
                <MenuItem value={status}>{status}</MenuItem>
                {status !== 'Pending' && <MenuItem value={'Pending'}>Pending</MenuItem>}
                {status !== 'Doing' && <MenuItem value={'Doing'}>Doing</MenuItem>}
                {status !== 'Done' && <MenuItem value={'Done'}>Done</MenuItem>}
              </Select>
              <FormHelperText>{statusError}</FormHelperText>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        message={success}
        onClose={() => setSuccess('')}
      />
    </div>
  );
};

export default AddPopUp;