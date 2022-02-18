import React from 'react';

import AddIcon from '@mui/icons-material/AddCircle';
import RemoveIcon from '@mui/icons-material/RemoveCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

function MultipleTextField({
  label,
  name,
  values,
  errors,
  disableAdd,
  onChange,
  onAdd,
  onRemove,
}: {
  label: string;
  name: string;
  values: string[];
  errors?: string[];
  disableAdd?: boolean;
  onChange: (entry: { name: string; index: number; value: string }) => void;
  onRemove: (entry: { name: string; index: number }) => void;
  onAdd: (entry: { name: string }) => void;
}) {
  return (
    <>
      <Typography component="label">{label}</Typography>
      <Box>
        {values.map((_value, index) => {
          return (
            <Box
              width="100%"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              key={index}
            >
              <TextField
                name={name}
                value={values[index]}
                sx={{ width: '90%' }}
                inputProps={{
                  'aria-label': name,
                  name,
                }}
                onChange={({ target: { value } }) =>
                  onChange({
                    name,
                    index,
                    value,
                  })
                }
                error={!!errors?.[index]}
                helperText={errors?.[index]}
              />
              {index > 0 && (
                <Box
                  display="flex"
                  width="10%"
                  justifyContent="center"
                  alignItems="center"
                >
                  <IconButton
                    onClick={() => onRemove({ name, index })}
                    aria-label={`remove-${name}-${index}`}
                    name={`remove-${name}-${index}`}
                    role="button"
                  >
                    <RemoveIcon sx={{ fontSize: 32 }} />
                  </IconButton>
                </Box>
              )}
            </Box>
          );
        })}
        <Box width="100%" mt={1} justifyContent="flex-end" display="flex">
          <Button
            name={`add-${name}`}
            onClick={() => onAdd({ name })}
            sx={{ padding: 1 }}
            disabled={disableAdd}
          >
            Añadir <AddIcon sx={{ marginLeft: 1 }} />
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default MultipleTextField;
