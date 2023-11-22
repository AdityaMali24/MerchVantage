import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import { CloseOutlined } from '@mui/icons-material';
// import CloseIcon from '@mui/icons-material/Close';

export default function GlobalSnackbar(props) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseOutlined fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <div>
      <Button onClick={handleClick} style={{color:'#fff',fontSize:16}}>{props.buttonText}</Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={props.message}
        action={action}
      />
    </div>
  );
}