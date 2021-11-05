import { Button, Dialog, Grid, IconButton, makeStyles, TextField } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react'
import CloseIcon from '@material-ui/icons/Close';
import Select from 'react-select'
import { getUserLogin, updateInfo } from '../../actions/services/UserActions';
import { updateAddressUser } from 'actions/services/AddressActions'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import useLocationForm from 'hooks/useLocationForm';
toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
});

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 600,
        overflow: 'hidden',
        maxHeight: '100vh'
    },
    input: {
        display: 'none',
    },
    button: {
        padding: '12px 24px',
        fontWeight: 600,
        fontSize: '1.3rem',
        marginRight: 15
    },
    textInput: {
        fontSize: '1.3rem',
        overflow: 'hidden'
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
    },
    padding: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 20,
        paddingTop: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13
    }
}))

const AddressForm = (props) => {
    const classes = useStyles();
    const { onClose, open } = props;

    const [user, setUser] = useState({
        id: '',
        fullName: '',
        username: '',
        email: '',
        phone: '',
        city: '',
        district: '',
        ward: '',
        house: '',
        city_id: 0,
        district_id: 0,
        ward_id: '',
    })
    const { state, onCitySelect, onDistrictSelect, onWardSelect } = useLocationForm((user?.city_id !== null) ? true : false);

    const {
        cityOptions,
        districtOptions,
        wardOptions,
        selectedCity,
        selectedDistrict,
        selectedWard,
    } = state;

    const handleChange = (e) => {
        const value = e.target.value;
        setUser({
            ...user,
            [e.target.name]: value,
        });
    };

    const handleCloseForm = () => {
        onClose();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { ...user };
        data.city = state.selectedCity.label;
        data.district = state.selectedDistrict.label;
        data.ward = state.selectedWard.label;
        data.house = user.house;
        data.fullName = user.fullName;
        data.phone = user.phone;
        data.email = user.email;
        data.city_id = state.selectedCity.value;
        data.district_id = state.selectedDistrict.value;
        data.ward_id = state.selectedWard.value;
        updateAddressUser(data)
            .then((res) => {
                toast.success("Cập nhật thông tin thành công.")
                handleCloseForm();
            })
            .catch(err => console.log(err))
        updateInfo(data)
            .then(() => {
                getUser();
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                getUser();
            })
    }

    const getUser = useCallback(() => {
        getUserLogin()
            .then(res => {
                setUser(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        getUser();
    }, [getUser])

    return (
        <>
            {
                <Dialog onClose={onClose} open={open} className={classes.formControl}>
                    <IconButton aria-label="delete" onClick={onClose} className="close-icon">
                        <CloseIcon fontSize="large" />
                    </IconButton>
                    <Grid className={classes.padding} container spacing={2}>
                        <Grid item sm={12} xs={12}>
                            <h3 className={classes.title}>
                                Thông tin đặt hàng
                            </h3>
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                className="input-text"
                                type="text"
                                name="fullName"
                                value={user?.fullName}
                                onChange={handleChange}
                                label={
                                    <span>
                                        <span style={{ color: "red" }}>*</span>
                                        Họ và tên
                                    </span>
                                }
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                className="input-text"
                                type="number"
                                name="phone"
                                value={user?.phone}
                                onChange={handleChange}
                                label={
                                    <span>
                                        <span style={{ color: "red" }}>*</span>
                                        Số điện thoại
                                    </span>
                                }
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                className="input-text"
                                type="text"
                                name="email"
                                value={user?.email}
                                onChange={handleChange}
                                label={
                                    <span>
                                        <span style={{ color: "red" }}>*</span>
                                        Email
                                    </span>
                                }
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <Select
                                name="ProvinceID"
                                key={`ProvinceID_${selectedCity?.value}`}
                                isDisabled={cityOptions.length === 0}
                                options={cityOptions}
                                onChange={(option) => onCitySelect(option)}
                                placeholder="Tỉnh/Thành"
                                defaultValue={selectedCity}
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <Select
                                name="DistrictID"
                                key={`DistrictID_${selectedDistrict?.value}`}
                                isDisabled={districtOptions.length === 0}
                                options={districtOptions}
                                onChange={(option) => onDistrictSelect(option)}
                                placeholder="Quận/Huyện"
                                defaultValue={selectedDistrict}
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <Select
                                name="WardCode"
                                key={`WardCode_${selectedWard?.value}`}
                                isDisabled={wardOptions.length === 0}
                                options={wardOptions}
                                placeholder="Phường/Xã"
                                onChange={(option) => onWardSelect(option)}
                                defaultValue={selectedWard}
                            />
                        </Grid>

                        <Grid item sm={12} xs={12}>
                            <TextField
                                type="text"
                                name="house"
                                value={user?.house}
                                fullWidth
                                className={classes.textInput}
                                onChange={handleChange}
                                label='Địa chỉ nhà'
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <Button
                                onClick={handleSubmit}
                                variant="outlined" color="secondary"
                                fullWidth
                                className={classes.button}
                            >Cập nhật địa chỉ</Button>
                        </Grid>
                    </Grid>
                </Dialog>
            }
        </>
    )
}
export default AddressForm;