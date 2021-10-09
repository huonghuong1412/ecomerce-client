import { Button, Dialog, Grid, IconButton, makeStyles, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import CloseIcon from '@material-ui/icons/Close';
import { getUserLogin } from '../../actions/services/UserActions';
import { updateAddressUser } from 'actions/services/AddressActions'
import { getListProvince, getListDistrict, getListWard } from 'actions/services/GHNServices'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
// import Loading from 'components/Loading/Loading';
// import useTimeout from 'hooks/useTimeout';
toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
});

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 600,
        overflow: 'hidden',
        padding: 30
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
    padding: {
        paddingLeft: 30,
        paddingRight: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
}))

const AddressForm = (props) => {
    const classes = useStyles();
    const { onClose, open } = props;

    const [data, setData] = useState({
        listCity: [],
        listDistrict: [],
        listWard: []
    })

    const [user, setUser] = useState({
        id: '',
        fullName: '',
        username: '',
        city: '',
        district: '',
        ward: '',
        house: ''
    })

    const getListCity = () => {
        getListProvince()
            .then((res) => {
                setData({
                    ...data,
                    listCity: res.data.data.sort((a, b) => a.ProvinceID - b.ProvinceID),
                })
            })
            .catch(err => console.log(err))
    }

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
        updateAddressUser(user)
            .then((res) => {
                toast.success("Cập nhật thông tin thành công.")
                handleCloseForm();
            })
            .catch(err => console.log(err))
    }

    const getUser = () => {
        getUserLogin()
            .then(res => {
                setUser(res.data);
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getUser();
        getListCity();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // useTimeout(() => setLoading(false), loading ? 1000 : null);

    return (
        <>
            {
                // loading ? <Loading /> : (
                <Dialog onClose={onClose} open={open} className={classes.formControl}>
                    <IconButton aria-label="delete" onClick={onClose} className="close-icon">
                        <CloseIcon fontSize="large" />
                    </IconButton>
                    <div className="row sm-gutter section__content">
                        <div className="col l-12 m-12 c-12">
                            <Grid className={classes.padding} container spacing={2}>
                                <Grid item sm={12} xs={12}>
                                    <div className="input-group">
                                        <label className="select">
                                            <select required name='city' onChange={(e) => {
                                                setUser({
                                                    ...user,
                                                    city: data.listCity.filter(item => item.ProvinceID === parseInt(e.target.value))[0]?.ProvinceName || "",
                                                    city_id: parseInt(e.target.value)
                                                })
                                                getListDistrict(e.target.value)
                                                    .then((res) => setData({
                                                        ...data,
                                                        listDistrict: res.data.data,
                                                        listWard: []
                                                    }))
                                                    .catch(() => alert("ERROR"))
                                            }} value={user.city_id}>
                                                <option value="">-- Thành phố --</option>
                                                {
                                                    data.listCity.map((item) => {
                                                        return (
                                                            <option key={item.ProvinceID} value={item.ProvinceID}>{item.ProvinceName ? item.ProvinceName : user.city}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </label>
                                    </div>
                                </Grid>
                                <Grid item sm={12} xs={12}>
                                    <div className="input-group">
                                        <label className="select">
                                            <select required name='district' onChange={(e) => {
                                                setUser({
                                                    ...user,
                                                    district: data.listDistrict.filter(item => item.DistrictID === parseInt(e.target.value))[0]?.DistrictName || "",
                                                    district_id: parseInt(e.target.value)
                                                })
                                                getListWard(e.target.value)
                                                    .then((res) => setData({
                                                        ...data,
                                                        listWard: res.data.data,
                                                    }))
                                                    .catch(() => alert("ERROR"))
                                            }} value={user.district_id}>
                                                <option>-- Quận/Huyện --</option>
                                                {
                                                    data.listDistrict.sort((a, b) => a.DistrictID - b.DistrictID).map((item) => {
                                                        return (
                                                            <option key={item.DistrictID} value={item.DistrictID}>{item.DistrictName}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </label>
                                    </div>
                                </Grid>
                                <Grid item sm={12} xs={12}>
                                    <div className="input-group">
                                        <label className="select">
                                            <select required name='ward' onChange={(e) => {
                                                setUser({
                                                    ...user,
                                                    ward: data.listWard.filter(item => item.WardCode === e.target.value)[0]?.WardName || "",
                                                    ward_id: e.target.value
                                                })

                                            }} value={user.ward_id}>
                                                <option>-- Xã/Phường --</option>
                                                {
                                                    data.listWard.map((item) => {
                                                        return (
                                                            <option key={item.WardCode} value={item.WardCode}>{item.WardName}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </label>
                                    </div>
                                </Grid>

                                <Grid item sm={12} xs={12}>
                                    <TextField
                                        type="text"
                                        name="house"
                                        required
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
                        </div>
                    </div>
                </Dialog>
                // )
            }
        </>
    )
}
export default AddressForm;