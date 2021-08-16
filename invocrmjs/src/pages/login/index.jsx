import React from 'react';
import { Formik, Form, Field } from 'formik';
import { LoginService } from '../../services/LoginService';
import { withRouter } from 'react-router-dom';

import './styles.scss'


const Login = ({ setUser, history, handleRequest, enqueueSnackbar }) => {


    const handleSubmit = (values, { setErrors }) => {
        handleRequest(
            LoginService.login(values),
            true,
        )
            .then(res => {
                const user = res.body.user;
                setUser(user);
                localStorage.setItem("user", JSON.stringify(user));
                history.push("/contracts")
            })
            .catch(err => {
                if (err.statusCode < 500 && Object.keys(err.body)) {
                    let errors = {};
                    Object.keys(err.body).forEach(errKey => {
                        errors = { ...errors, [errKey]: err.body[errKey] }
                    })
                    setErrors(errors)
                }
                else {
                    enqueueSnackbar("Xəta baş verdi!", { variant: "error", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
                }
            })
    }


    return (
        <div class="login-wrapper">
            <div id="formContent">
                <h2 class="active"> İnvoCRM </h2>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    onSubmit={handleSubmit}>
                    {({ errors }) => (
                        <Form>
                            <Field type="email" name="email" id="login" type="text" placeholder="E-mail" />
                            <p className="err-text">{errors.email ? errors.email : ""}</p>
                            <Field type="password" name="password" id="password" placeholder="Şifrə" />
                            <p className="err-text">{errors.password ? errors.password : ""}</p>
                            <button type="submit" >
                                Daxil ol
                        </button>
                            <p className="err-text" >
                                {errors.non_field_errors ? errors.non_field_errors.join("\r\n") : ""}
                            </p>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}


export default withRouter(Login);