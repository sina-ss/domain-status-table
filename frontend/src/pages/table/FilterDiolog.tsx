import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox
} from "@mui/material";

interface FilterDialogProps {
  open: boolean;
  handleClose: () => void;
  selectedStatuses: string[];
  handleStatusChange: (status: string, checked: boolean) => void;
}

const statuses = ["ADDED", "NOT_ADDED", "BUG", "DISORDER"];

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  handleClose,
  selectedStatuses,
  handleStatusChange
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Filter by Status</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <FormGroup>
            {statuses.map(status => (
              <FormControlLabel
                key={status}
                control={
                  <Checkbox
                    checked={selectedStatuses.includes(status)}
                    onChange={(e) => handleStatusChange(status, e.target.checked)}
                  />
                }
                label={status}
              />
            ))}
          </FormGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;