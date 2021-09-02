import { Button, Checkbox, FormControlLabel, Grid } from '@material-ui/core';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import React from 'react'
import { connect } from 'react-redux';
import { getCurrentUser } from 'actions/services/UserActions';
import AccountNavbar from 'components/AccountNavbar/AccountNavbar.';
import _ from 'lodash'
import Loading from 'components/Loading/Loading'

class ProfilePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fullName: "",
            phone: "",
            email: "",
            username: "",
            dateOfBirth: "",
            password: "",
            passwordNew: "",
            passwordNewConfirm: "",
            checked: false
        }
    }

    componentDidMount() {
        this.props.getCurrentUser();
    }

    componentDidUpdate(prevState, prevProps) {

    }

    componentWillReceiveProps(nextProps) {
        this.setState({ ...nextProps.user })
    }

    handleChange = (event) => {
        this.setState({
            checked: !this.state.checked
        })
    };

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state);
    }

    render() {
        const { user } = this.props;
        let {
            fullName,
            phone,
            email,
            username,
            dateOfBirth,
            password,
            passwordNew,
            passwordNewConfirm,
            checked
        } = this.state;
        return (
            <>
                {
                    user && !_.isEmpty(user) && username !== "" ? (
                        <div className="row sm-gutter section__content">
                            <div className="col l-12 m-12 c-12">
                                <div className="home-product">
                                    <div className="row sm-gutter section__item">
                                        <div className="col l-3 m-3 c-3">
                                            <AccountNavbar name={username} />
                                        </div>
                                        <div className="col l-9 m-9 c-9">
                                            <Grid item md={12}>
                                                <div className="group">
                                                    <h4 className="heading">Thông tin khách hàng</h4>
                                                    <div className="content has-table">
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <td>Họ tên</td>
                                                                    <td>{user.fullName}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Username</td>
                                                                    <td>{user.username}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Email</td>
                                                                    <td>{user.email}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Số điện thoại</td>
                                                                    <td>{user.phone}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Ngày sinh</td>
                                                                    <td>{user.dateOfBirth}</td>
                                                                </tr>
                                                                {/* <tr>
                                                                    <td>Địa chỉ</td>
                                                                    <td>{user.house + ", " + user.ward + ", " + user.district + ", " + user.city}</td>
                                                                </tr> */}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <ValidatorForm onSubmit={this.handleSubmit}>
                                                <Grid className="" container spacing={2}>
                                                    <Grid item sm={12} xs={12}>
                                                        <TextValidator
                                                            className="input-text"
                                                            type="text"
                                                            name="fullName"
                                                            value={fullName}
                                                            onChange={this.handleInputChange}
                                                            label={
                                                                <span>
                                                                    <span style={{ color: "red" }}>*</span>
                                                                    Họ và tên
                                                                </span>
                                                            }
                                                            validators={["required"]}
                                                            errorMessages={["Trường này không được để trống"]}
                                                        />
                                                    </Grid>
                                                    <Grid item sm={12} xs={12}>
                                                        <TextValidator
                                                            className="input-text"
                                                            type="number"
                                                            name="phone"
                                                            value={phone}
                                                            // onChange={(e) => setPhone(e.target.value)}
                                                            onChange={this.handleInputChange}
                                                            label={
                                                                <span>
                                                                    <span style={{ color: "red" }}>*</span>
                                                                    Số điện thoại
                                                                </span>
                                                            }
                                                            validators={["required"]}
                                                            errorMessages={["Trường này không được để trống"]}
                                                        />
                                                    </Grid>
                                                    <Grid item sm={12} xs={12}>
                                                        <TextValidator
                                                            className="input-text"
                                                            type="text"
                                                            name="email"
                                                            value={email}
                                                            // onChange={(e) => setEmail(e.target.value)}
                                                            onChange={this.handleInputChange}
                                                            label={
                                                                <span>
                                                                    <span style={{ color: "red" }}>*</span>
                                                                    Email
                                                                </span>
                                                            }
                                                            validators={["required"]}
                                                            errorMessages={["Trường này không được để trống"]}
                                                        />
                                                    </Grid>
                                                    <Grid item sm={12} xs={12}>
                                                        <TextValidator
                                                            className="input-text"
                                                            type="text"
                                                            name="username"
                                                            value={username}
                                                            disabled
                                                            inputProps={{
                                                                style: { color: 'blue' },
                                                            }}
                                                            // onChange={(e) => setUsername(e.target.value)}
                                                            onChange={this.handleInputChange}
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
                                                            className="input-text"
                                                            style={{ margin: '5px 0' }}
                                                            type="date"
                                                            name="dateOfBirth"
                                                            value={dateOfBirth}
                                                            onChange={this.handleInputChange}
                                                            placeholder=""
                                                            label={
                                                                <span>
                                                                    <span style={{ color: "red" }}>*</span>
                                                                    Ngày sinh
                                                                </span>
                                                            }
                                                            validators={["required"]}
                                                            errorMessages={["Ngày sinh không được để trống"]}
                                                        />
                                                    </Grid>

                                                    <Grid item sm={12} xs={12}>
                                                        <FormControlLabel
                                                            control={<Checkbox
                                                                checked={checked}
                                                                onChange={this.handleChange}
                                                                name="checked" />}
                                                            label="Đổi mật khẩu"
                                                        />
                                                    </Grid>
                                                    {
                                                        checked ? (
                                                            <>
                                                                <Grid item sm={12} xs={12}>
                                                                    <TextValidator
                                                                        className="input-text"

                                                                        type="password"
                                                                        name="password"
                                                                        value={password}
                                                                        defaultValue={user.password}
                                                                        onChange={this.handleInputChange}
                                                                        // onChange={(e) => setPassword(e.target.value)}
                                                                        label={
                                                                            <span>
                                                                                <span style={{ color: "red" }}>*</span>
                                                                                Mật khẩu cũ
                                                                            </span>
                                                                        }
                                                                        validators={["required"]}
                                                                        errorMessages={["Trường này không được để trống"]}
                                                                    />
                                                                </Grid>
                                                                <Grid item sm={12} xs={12}>
                                                                    <TextValidator
                                                                        className="input-text"

                                                                        type="password"
                                                                        name="passwordNew"
                                                                        value={passwordNew}
                                                                        onChange={this.handleInputChange}
                                                                        label={
                                                                            <span>
                                                                                <span style={{ color: "red" }}>*</span>
                                                                                Mật khẩu mới
                                                                            </span>
                                                                        }
                                                                        validators={["required"]}
                                                                        errorMessages={["Trường này không được để trống"]}
                                                                    />
                                                                </Grid>
                                                                <Grid item sm={12} xs={12}>
                                                                    <TextValidator
                                                                        className="input-text"

                                                                        type="password"
                                                                        name="passwordNewConfirm"
                                                                        value={passwordNewConfirm}
                                                                        onChange={this.handleInputChange}
                                                                        label={
                                                                            <span>
                                                                                <span style={{ color: "red" }}>*</span>
                                                                                Xác nhận mật khẩu mới
                                                                            </span>
                                                                        }
                                                                        validators={["required"]}
                                                                        errorMessages={["Trường này không được để trống"]}
                                                                    />
                                                                </Grid>
                                                            </>
                                                        ) : ""
                                                    }

                                                    <Grid item sm={12} xs={12}>
                                                        <Button
                                                            variant="outlined" color="secondary"
                                                            style={{ margin: '10px 0', width: '100%' }}
                                                            className="btn btn--e-transparent-brand-b-2"
                                                            type="submit"
                                                        >Cập nhật thông tin</Button>
                                                    </Grid>
                                                </Grid>
                                            </ValidatorForm>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : <Loading />
                }
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.auth
    }
}

export default connect(mapStateToProps, { getCurrentUser })(ProfilePage)