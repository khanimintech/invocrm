import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const CreateFormActions = ({ handleClose, handleSave, id, disabled  }) => {
    return (<DialogActions>
        {
            id ? (
                <Button onClick={handleClose} color="secondary">
                   Çıxış
                </Button>
            ) : (
                <Button onClick={handleClose} color="secondary">
                    Ləğv et
                </Button>
            )
        }
            <Button onClick={handleSave} color="primary" disabled={disabled}>
                Yadda saxla
            </Button>

    </DialogActions>
    )
}

export default CreateFormActions;