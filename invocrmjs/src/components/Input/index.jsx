import 'date-fns';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';

const Input = ({field, form, meta, label, placeholder, required, defaultValue, select, options, 
    readOnly, type, date, size, onChange, multiline, rows, checkbox, autoComplete, renderOption,
 }) => {
    const { name, value } = field;
    const { setFieldValue, submitCount } = form;
    const { error } = meta;
    if (date)
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    disableToolbar
                    format={"MM/dd/yyyy"}
                    margin="normal"
                    label={label}
                    value={value || null}
                    onChange={date => setFieldValue(name, date)}
                    KeyboardButtonProps={{
                    'aria-label': 'change date',
                    }}
                    fullWidth
                    required={required}
                    error={submitCount && error}
                    variant="outlined"
                    readOnly={readOnly}
                />
            </MuiPickersUtilsProvider>
        )
    if (select)
        return (
            <TextField
                select
                fullWidth
                label={label}
                value={value || value === 0 ? value :  ""}
                onChange={e => setFieldValue(name, e.target.value)}
                required={required}
                error={submitCount && error}
                variant="outlined"
                size={size}
                InputProps={{
                    readOnly,
                  }}
                >
                {options.map((option) => (
                     <MenuItem key={option.value} value={option.value}>
                     {option.label}
                   </MenuItem>
                ))}
                </TextField>
        )
    if (checkbox)
        return (
            <FormControlLabel
                labelPlacement="start"
                className={submitCount && error  ? "error" : ""}
                control={
                <Checkbox
                    checked={field.value}
                    onChange={e => onChange ?   onChange( e.target.checked) : setFieldValue(name, e.target.checked)}
                    name={field.name}
                    color="primary"

                />
                }
                label={label}
            />
        )
    if (autoComplete)
        return (
            <Autocomplete
                options={options}
                getOptionLabel={option => option.label}
                renderOption={renderOption}
                freeSolo
                value={options ? options.find(o => o.value === field.value ) : null}
                onChange={(e, option) => {
                    const { setFieldValue } = form;
                    const selectedOption = option ? options.find(o => option.value === o.value) : null;
                    if (field.name ===  "executor.tin"  || field.name ===  "company.tin"){
                        setFieldValue(field.name, selectedOption ?  selectedOption.value : null )
                        setFieldValue("bank_account.account", selectedOption ? selectedOption.account : null)
                        setFieldValue("bank.name", selectedOption ?  selectedOption.name : null)
                        setFieldValue("bank_account.swift_no", selectedOption ? selectedOption.swift_no : null)
                        setFieldValue("bank.code", selectedOption ? selectedOption.code : null )
                        setFieldValue("bank_account.correspondent_account", selectedOption ? selectedOption.correspondent_account : null)
                        setFieldValue("bank.tin", selectedOption ? selectedOption.tin : null)
                        // setFieldValue("bank.id", option ? option.id : null)
                    }
                    else{
                        setFieldValue(field.name, selectedOption ? selectedOption.value : null)
                    }
                }}
                onInputChange={(e, option) => {
                    const { setFieldValue } = form;
                    setFieldValue(field.name, option )
                }}
                renderInput={params => (
                <TextField
                    {...params}
                    label={label}
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    error={submitCount && error}
                />
                )}
            />
        )
    return (
        <TextField 
            label={label}
            required={required}
            type={type}
            value={value || ''}
            defaultValue={defaultValue}
            placeholder={placeholder}
            onChange={e => onChange? onChange( e.target.value) : setFieldValue(name, e.target.value)}
            InputProps={{
                readOnly,
              }}
            error={submitCount && error }
            fullWidth
            variant="outlined"
            size={size}
            multiline={multiline}
            rows={rows}
        />
    )
}

export  default Input;