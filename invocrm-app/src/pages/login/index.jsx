import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import './styles.scss'
import { LoginService } from '../../services/LoginService';
import { withRouter } from 'react-router-dom';


const Login = ({ setUser, history , handleRequest}) => {


    const handleSubmit = (values, { setErrors }) => {
        handleRequest(
            LoginService.login(values)
        )
        .then(res => {
            const user = res.body.user;
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
            history.push("/contracts")
        })
        .catch(err => {
            if (err.body.email || err.body.password) setErrors({"email_or_password": true});
        })
    }

    
    return (
        <div class="login-wrapper">
            <div id="formContent">
            <h2 class="active"> İnvoCRM </h2>
            <Formik
                initialValues={{ email: '', password: '' }}
                validate={values => {
                    const errors = {};
                    if (!values.email) {
                    errors.email = 'Bu sahə mütləqdir';
                    }
                    return errors;
                }}
                onSubmit={handleSubmit}>
                {({  errors }) => (
                    <Form>
                        <Field type="email" name="email" id="login"  type="text" placeholder="E-mail" />
                        <Field type="password" name="password"   id="password" placeholder="Şifrə" />
                        <ErrorMessage name="password" component="div" />
                        <button type="submit" >
                            Daxil ol
                        </button>
                        {
                                errors.email_or_password ? (
                                    <p style={{fontSize: "14px", color: "#d32f2f"}} >
                                        Login ve ya şifrə yalnışdır.
                                </p>
                                ): null
                            }
                    </Form>
                )}
                </Formik>
        </div>
        </div>
    )
}


export default withRouter(Login);