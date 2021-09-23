import React, { useState } from 'react'
import { Button, Grid, makeStyles } from '@material-ui/core';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from 'actions/services/UserActions';
import { useEffect } from 'react';

const useStyles = makeStyles({
    text: {
        fontSize: '1.3rem'
    }
})

export default function LoginPage(props) {

    const dispatch = useDispatch();
    const classes = useStyles();

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {

        document.title = "Đăng nhập | Tiki"

        let isAuth = localStorage.getItem('token')
        if(isAuth && isAuth !== 'undefined') {
           props.history.goBack();
        }
     }, [props.history])

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            username,
            password
        }
        dispatch(login(data, props.history));
    }
    return (
        <>
            <div className="row sm-gutter section__content">
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter section__item">
                            <div className="col l-6 m-4 c-4">
                                <div className="content-left">
                                    <h2>Đăng nhập</h2>
                                    <p>Đăng nhập để theo dõi đơn hàng, lưu <br />danh sách sản phẩm yêu thích, nhận<br /> nhiều ưu đãi hấp dẫn.</p>
                                    <img src="https://pipe.tikicdn.com/media/upload/2018/10/12/2a3acb91a35d45e1b4b7c96912a0c84a.png" alt="" />
                                </div>
                            </div>
                            <div className="col l-6 m-8 c-8">
                                <ValidatorForm onSubmit={handleSubmit}>
                                    <Grid className="" container spacing={2}>
                                        <Grid item sm={12} xs={12}>
                                            <TextValidator
                                                className={classes.text}
                                                fullWidth
                                                type="text"
                                                name="username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                label={
                                                    <span>
                                                        <span style={{ color: "red" }}>*</span>
                                                        Tên tài khoản
                                                    </span>
                                                }
                                                validators={["required"]}
                                                errorMessages={["Trường này không được để trống"]}
                                            />
                                        </Grid>
                                        <Grid item sm={12} xs={12}>
                                            <TextValidator
                                                className={classes.text}
                                                fullWidth
                                                type="password"
                                                name="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                label={
                                                    <span>
                                                        <span style={{ color: "red" }}>*</span>
                                                        Mật khẩu
                                                    </span>
                                                }
                                                validators={["required"]}
                                                errorMessages={["Trường này không được để trống"]}
                                            />
                                        </Grid>

                                        <Grid item sm={12} xs={12}>
                                            <Button
                                                variant="outlined" color="secondary"
                                                style={{ margin: '10px 0', width: '100%' }}
                                                className="btn btn--e-transparent-brand-b-2"
                                                type="submit"
                                            >Đăng nhập</Button>
                                        </Grid>
                                        <Grid item sm={12} xs={12}>
                                            <div className="auth-form__social">
                                                <Link to="/" className="auth-form__social-facebook btn btn--size-s btn--width-icon">
                                                    <i className="auth-form__social-icon fab fa-facebook-square" />
                                                    <span className="auth-form__social-text">Kết nối với Facebook</span>
                                                </Link>
                                            </div>
                                        </Grid>
                                        <Grid item sm={12} xs={12}>
                                            <div className="auth-form__social">
                                                <Link to="/" className="auth-form__social-google btn btn--size-s btn--width-icon">
                                                    <i className="auth-form__social-icon fab fa-google"></i>
                                                    <span className="auth-form__social-text">Kết nối với Google</span>
                                                </Link>
                                            </div>
                                        </Grid>
                                        <Grid item sm={12} xs={12}>
                                            <div className="auth-form__social">
                                                <Link to="/" className="auth-form__social-instagram btn btn--size-s btn--width-icon">
                                                    <i className="auth-form__social-icon fab fa-instagram"></i>
                                                    <span className="auth-form__social-text">Kết nối với Instagram</span>
                                                </Link>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </ValidatorForm>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
