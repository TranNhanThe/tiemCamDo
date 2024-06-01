import React, { useState, useRef } from 'react';
import { Button, Box, Dialog, Snackbar, DialogActions, DialogContent, DialogTitle, TextField, Select, FormControl, MenuItem, InputLabel } from '@mui/material';
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import axios from 'axios';

const EditBike = ({ id, bsx, kho, onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [editedBsx, setEditedBsx] = useState(bsx);
  const [editedKho, setEditedKho] = useState(kho);

  // console.log('edited Status:' + editedStatus)
  // console.log('edited Status:' + editedName)

  const [success, setSuccess] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBsxChange = (event) => {
    setEditedBsx(event.target.value);
  };
  

  const handleChange = (event) => {
    setEditedKho(event.target.value);
  };

  const handleSubmit = async () => {
    const response = await fetch('http://192.168.2.29:5000/bike', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, newBsx: editedBsx, newKho: editedKho }),
    });

    if (response.ok) {
      const updatedResponse = await axios.get('http://192.168.2.29:5000/bike');
      const updatedBikes = updatedResponse.data;
      setSuccess('Sửa thành công');
      onSubmit(updatedBikes);
    } else {

    }

    handleClose();
   
  }; 
  const statusInputRef = useRef(null);

 
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (statusInputRef.current && statusInputRef.current === document.activeElement) {
        handleSubmit();
      }
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}><ModeOutlinedIcon /></Button>
      <Dialog open={open} onClose={handleClose} onKeyDown={handleKeyPress}>
        <DialogTitle>Edit Bike</DialogTitle>
        <DialogContent>
          <Box margin={2}>
            <TextField label="Bike" value={editedBsx} onChange={handleBsxChange} variant="outlined" fullWidth />
          </Box>
          <Box margin={2}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={editedKho}
                onChange={handleChange}
                inputRef={statusInputRef}
              >
                <MenuItem value={editedKho}>{editedKho}</MenuItem>
                {editedKho !== '1' && <MenuItem value={'1'}>1</MenuItem>}
                {editedKho !== '2' && <MenuItem value={'2'}>2</MenuItem>}
                {editedKho !== '3' && <MenuItem value={'3'}>3</MenuItem>}
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

export default EditBike;