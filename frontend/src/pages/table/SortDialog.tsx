import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

interface SortDialogProps {
  open: boolean;
  handleClose: () => void;
  handleSort: (field: string, order: "asc" | "desc") => void;
}

const SortDialog: React.FC<SortDialogProps> = ({
  open,
  handleClose,
  handleSort,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    
    const [field, order] = value.split(",");
    handleSort(field, order as "asc" | "desc");
  };  

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Sort by</DialogTitle>
      <DialogContent>
        <RadioGroup value={selectedValue} onChange={handleChange}>
          <FormControlLabel
            control={<Radio />}
            label="Standard Date Ascending"
            value="standard_date,asc"
          />
          <FormControlLabel
            control={<Radio />}
            label="Standard Date Descending"
            value="standard_date,desc" 
          />
          <FormControlLabel
            control={<Radio />}
            label="Domain Ascending"
            value="domain,asc"
          />
          <FormControlLabel
            control={<Radio />}
            label="Domain Descending"
            value="domain,desc"
          />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SortDialog;