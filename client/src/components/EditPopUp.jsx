import React, { useState } from 'react';
import { Button, Box, Dialog, Snackbar, DialogActions, DialogContent, DialogTitle, TextField, Select, FormControl, MenuItem, InputLabel } from '@mui/material';
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';


import axios from 'axios';

const EditPopUp = ({ id, name, status, onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedStatus, setEditedStatus] = useState(status);

  // console.log('edited Status:' + editedStatus)
  // console.log('edited Status:' + editedName)

  const [success, setSuccess] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNameChange = (event) => {
    setEditedName(event.target.value);
  };
  

  const handleChange = (event) => {
    setEditedStatus(event.target.value);
  };

  const handleSubmit = async () => {
    const response = await fetch('http://localhost:5000/todo/id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, newName: editedName, newStatus: editedStatus }),
    });

    if (response.ok) {
      const updatedResponse = await axios.get('http://localhost:5000/todo');
      const updatedTodos = updatedResponse.data;
      setSuccess('Sửa thành công');
      onSubmit(updatedTodos);
    } else {

    }

    handleClose();
   
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}><ModeOutlinedIcon /></Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <Box margin={2}>
            <TextField label="Task" value={editedName} onChange={handleNameChange} variant="outlined" fullWidth />
          </Box>
          <Box margin={2}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">StatusTo</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={editedStatus}
                onChange={handleChange}
              >
                <MenuItem value={editedStatus}>{editedStatus}</MenuItem>
                {editedStatus !== 'Pending' && <MenuItem value={'Pending'}>Pending</MenuItem>}
                {editedStatus !== 'Doing' && <MenuItem value={'Doing'}>Doing</MenuItem>}
                {editedStatus !== 'Done' && <MenuItem value={'Done'}>Done</MenuItem>}
              </Select>
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

export default EditPopUp;