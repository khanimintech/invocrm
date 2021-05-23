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
    onInputChange, hideTin
 }) => {
    const { name, value } = field;
    const { setFieldValue, submitCount } = form;
    const { error } = meta;
    if (date)
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
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
                value={value || ""}
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
                onChange={(e, option) => {
                    const { setFieldValue } = form
                    if (field.name ===  "executor.tin"  || field.name ===  "company.tin"){
                        setFieldValue(field.name, option ?  option.value : null )
                        setFieldValue("bank_account.account", option ? option.account : null)
                        setFieldValue("bank.name", option ?  option.name : null)
                        setFieldValue("bank_account.swift_no", option ? option.swift_no : null)
                        setFieldValue("bank.code", option ? option.code : null )
                        setFieldValue("bank_account.correspondent_account", option ? option.correspondent_account : null)
                        // setFieldValue("bank.id", option ? option.id : null)
                    }
                    else{
                        setFieldValue(field.name, option ? option.value : null)
                    }
                }}
                onInputChange={(e, option) => {
                    const { setFieldValue } = form
                    if (field.name ===  "executor.tin"  || field.name ===  "company.tin"){
                        setFieldValue(field.name, option ? option.value : null )
                        setFieldValue("bank_account.account", option?  option.account : null)
                        setFieldValue("bank.name", option ?  option.name : null)
                        setFieldValue("bank_account.swift_no", option ? option.swift_no : null)
                        setFieldValue("bank.code", option ? option.code : null)
                        setFieldValue("bank_account.correspondent_account", option ? option.correspondent_account : null)
                        // setFieldValue("bank.id", option ? option.id : null)
                    }
                    else{
                        setFieldValue(field.name, option ? option.value : null)
                        setFieldValue("bank_account.account", "")
                        setFieldValue("bank.name", "")
                        setFieldValue("bank_account.swift_no", "")
                        setFieldValue("bank.code", "")
                        setFieldValue("bank_account.correspondent_account", "")
                        // setFieldValue("bank.id", "")
                    }

                }}
                renderInput={params => (
                <TextField
                    {...params}
                    label={label}
                    margin="normal"
                    fullWidth
                    variant="outlined"
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