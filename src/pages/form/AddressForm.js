import { Button, Dialog, Grid, IconButton, withStyles } from '@material-ui/core';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import React from 'react'
import { connect } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import { getCurrentUser } from '../../actions/services/UserActions';
import Select from 'react-select'
import { getAllCity, getAllDistrictByCityId, getAllWardByDistrictId, updateAddressUser } from '../../actions/services/AddressActions'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
});

const styles = theme => ({
    dialog: {
        padding: '15px 20px',
        minWidth: 450
    },
    text: {
        fontSize: '1.3rem',
        width: '100%'
    }
})

class AddressForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            citySelect: {},
            districtSelect: {},
            wardSelect: {},
            city: "",
            district: "",
            ward: "",
            house: "",
            phone: "",

            listCity: [],
            listDistrict: [],
            listWard: [],
            cityId: null,
            districtId: null
        }
    }

    componentDidMount() {
        this.props.getCurrentUser();
        this.getData();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            username: nextProps.user.username,
            phone: nextProps.user.phone,
            house: nextProps.user?.address?.house,
            citySelect: {
                label: nextProps.user?.address?.city
            },
            districtSelect: {
                label: nextProps.user.address?.district
            },
            wardSelect: {
                label: nextProps.user.address?.ward
            },
        })
    }

    getAuth = () => {
        getCurrentUser()
            .then((res) => {
                const auth = res.data;
                this.setState({
                    citySelect: {
                        name: auth.city,
                        value: auth.city
                    },
                    districtSelect: {
                        name: auth.district,
                        value: auth.district
                    },
                    wardSelect: {
                        name: auth.ward,
                        value: auth.ward
                    },
                    city: auth.city,
                    district: auth.district,
                    ward: auth.ward,
                    house: auth.house
                })
            })
            .catch(err => {
                console.log(err);
            })
    }

    getData = () => {
        getAllCity()
            .then((res) => {
                this.setState({
                    listCity: res.data.map(item => {
                        return {
                            value: item.provinceid,
                            label: item.name
                        }
                    })
                })
            })
            .catch(err => console.log(err))
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            username: this.state.username,
            phone: this.state.phone,
            city: this.state.city,
            district: this.state.district,
            ward: this.state.ward,
            house: this.state.house
        }
        updateAddressUser(data)
            .then(() => {
                toast.success("Cập nhật thông tin thành công.")
                this.props.onClose();
                this.props.getCurrentUser();
            })
            .catch(err => console.log(err))
    }

    render() {
        const { onClose, open, classes  } = this.props;
        return (
            <>
                <Dialog onClose={onClose} open={open} className={classes.text}>
                    <IconButton aria-label="delete" onClick={onClose} className="close-icon">
                        <CloseIcon fontSize="large" />
                    </IconButton>
                    <div className="row sm-gutter section__content">
                        <div className="col l-12 m-12 c-12">
                            <div className="home-product">
                                <div className="row sm-gutter section__item">
                                    <div className="col l-2 m-2 c-2"></div>
                                    <div className="col l-8 m-8 c-8">
                                        <ValidatorForm onSubmit={this.handleSubmit}>
                                            <Grid className="" container spacing={2}>
                                                <Grid item sm={12} xs={12}>
                                                    <Select
                                                        options={this.state.listCity}
                                                        name="city"
                                                        placeholder="Thành phố"
                                                        value={this.state.citySelect || {}}
                                                        onChange={(option) => {
                                                            this.setState({
                                                                cityId: option.value,
                                                                city: option.label
                                                            }, () => {
                                                                getAllDistrictByCityId(this.state.cityId)
                                                                    .then(res => {
                                                                        this.setState({
                                                                            listDistrict: res.data.map(item => {
                                                                                return {
                                                                                    value: item.districtid,
                                                                                    label: item.name
                                                                                }
                                                                            })
                                                                        })
                                                                    })
                                                            })
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item sm={12} xs={12}>
                                                    <Select
                                                        options={this.state.listDistrict}
                                                        name="district"
                                                        placeholder="Quận/Huyện"
                                                        value={this.state.districtSelect || {}}
                                                        onChange={(option) => {
                                                            this.setState({
                                                                districtId: option.value,
                                                                district: option.label
                                                            }, () => {
                                                                getAllWardByDistrictId(this.state.districtId)
                                                                    .then(res => {
                                                                        this.setState({
                                                                            listWard: res.data.map(item => {
                                                                                return {
                                                                                    value: item.wardid,
                                                                                    label: item.name
                                                                                }
                                                                            })
                                                                        })
                                                                    })
                                                            })
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item sm={12} xs={12}>
                                                    <Select
                                                        options={this.state.listWard}
                                                        value={this.state.wardSelect || {}}
                                                        name="ward"
                                                        placeholder="Xã/Phường"
                                                        onChange={(option) => {
                                                            this.setState({
                                                                ward: option.label
                                                            })
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item sm={12} xs={12}>
                                                    <TextValidator
                                                        className={classes.text}
                                                        type="text"
                                                        name="house"
                                                        fullWidth
                                                        value={this.state.house}
                                                        onChange={this.handleInputChange}
                                                        label={
                                                            <span>
                                                                <span style={{ color: "red", fontSize: '1.2rem' }}>*</span>
                                                                Địa chỉ nhà
                                                            </span>
                                                        }
                                                        validators={["required"]}
                                                        errorMessages={["Trường này không được để trống"]}
                                                    />
                                                </Grid>

                                                <Grid item sm={12} xs={12}>
                                                    <TextValidator
                                                        className={classes.text}
                                                        type="text"
                                                        fullWidth
                                                        name="phone"
                                                        value={this.state.phone}
                                                        onChange={this.handleInputChange}
                                                        label={
                                                            <span>
                                                                <span style={{ color: "red", fontSize: '1.2rem' }}>*</span>
                                                                Số điện thoại
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
                                                    >Cập nhật địa chỉ</Button>
                                                </Grid>
                                            </Grid>
                                        </ValidatorForm>
                                    </div>
                                    <div className="col l-2 m-2 c-2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.auth.auth
    }
}

export default connect(mapStateToProps, { getCurrentUser })(withStyles(styles)(AddressForm))