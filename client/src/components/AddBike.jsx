import React, { useState, useRef } from 'react';
import { Button, Box, Dialog, Snackbar, DialogActions, DialogContent, DialogTitle, TextField, Select, FormControl, MenuItem, InputLabel } from '@mui/material';
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import AddBoxIcon from '@mui/icons-material/AddBox';
import FormHelperText from '@mui/material/FormHelperText';

import axios from 'axios';

const AddBike = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [bsx, setBsx] = useState();
  const [kho, setKho] = useState();

  // console.log('edited Status:' + editedStatus)
  // console.log('edited Status:' + editedName)

  const [bsxError, setBsxError] = useState('');
  const [khoError, setKhoError] = useState('');
  const [success, setSuccess] = useState('');
  
  const validate = () => {
    let isValid = true;

    if (!bsx) {
      setBsxError('Bsx is required');
      
      isValid = false;
    } else {
      setBsxError('');
      
    }

    if (!kho) {
      setKhoError('Kho is required');
     
      isValid = false;
    } else {
      setKhoError('');
      
    }

    if (!bsx || !kho){
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
    setBsx('');
    setKho('');
    setOpen(false);
  };

  const handleBsxChange = (event) => {
    setBsx(event.target.value);
  };


  const handleChange = (event) => {
    setKho(event.target.value);
  };

  const inputRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      try {
        const response = await fetch('http://localhost:5000/bike', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bsx: bsx, kho: kho }),
        });

        if (response.ok) {
          console.log('Bike added successfully');
          // Fetch the updated list of todos
          const updatedResponse = await fetch('http://localhost:5000/bike');
          const updatedBikes = await updatedResponse.json();
          // Update the UI with the updated list of todos
          onSubmit(updatedBikes);
          inputRef.current.focus();
          setBsx('');
          
        } else {
          console.error('Failed to add bike');
        }
      } catch (error) {
        console.error('Error adding bike:', error);
      }
    }
  };
  return (
    <div>
      <AddBoxIcon onClick={handleClickOpen} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Bike</DialogTitle>
        <DialogContent>
          <Box margin={2}>
            <TextField
              inputRef={inputRef}
              label="Bike"
              value={bsx}
              onChange={handleBsxChange}
              variant="outlined"
              error={!!bsxError}
              helperText={bsxError}
              fullWidth />
          </Box>
          <Box margin={2}>
            <FormControl fullWidth error={!!khoError}>
              <InputLabel id="demo-simple-select-label">Kho</InputLabel>
              <Select 
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={kho}
                onChange={handleChange}
              >
                <MenuItem value={kho}>{kho}</MenuItem>
                {kho !== '1' && <MenuItem value={'1'}>Kho số 1</MenuItem>}
                {kho !== '2' && <MenuItem value={'2'}>Kho số 2</MenuItem>}
                {kho !== '3' && <MenuItem value={'3'}>Kho số 3</MenuItem>}
              </Select>
              <FormHelperText>{khoError}</FormHelperText>
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

export default AddBike;