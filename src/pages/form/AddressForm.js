import { Button, Dialog, Grid, IconButton, makeStyles, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import CloseIcon from '@material-ui/icons/Close';
import { getUserLogin } from '../../actions/services/UserActions';
import { getAllCity, getAllDistrictByCityId, getAllWardByDistrictId, updateAddressUser } from '../../actions/services/AddressActions'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Loading from 'components/Loading/Loading';
import useTimeout from 'hooks/useTimeout';
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
        username: '',
        city: '',
        district: '',
        ward: '',
        house: ''
    })
    const [loading, setLoading] = useState(true);
    const getListCity = () => {
        getAllCity()
            .then((res) => {
                setData({
                    ...data,
                    listCity: res.data
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

    const changeCity = e => {
        const value = e.target.value;
        setUser({
            ...user,
            city: value,
        });
        if (value !== user.city) {
            getAllDistrictByCityId(value)
                .then((res) => setData({
                    ...data,
                    listDistrict: res.data,
                    listWard: []
                }))
                .catch(() => alert("ERROR"))
        }
    };

    const changeDistrict = e => {
        const value = e.target.value;
        setUser({
            ...user,
            district: value,
        });
        getAllWardByDistrictId(value)
            .then((res) => setData({
                ...data,
                listWard: res.data
            }))
            .catch(() => alert("ERROR"))
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

    useTimeout(() => setLoading(false), loading ? 1000 : null);

    return (
        <>
            {
                loading ? <Loading /> : (
                    <Dialog onClose={onClose} open={open} className={classes.formControl}>
                        <IconButton aria-label="delete" onClick={onClose} className="close-icon">
                            <CloseIcon fontSize="large" />
                        </IconButton>
                        <div className="row sm-gutter section__content">
                            <div className="col l-12 m-12 c-12">
                                    <Grid className={classes.padding} container spacing={2}>
                                        <Grid item sm={12} xs={12}>
                                            <label className="select">
                                                <select required="required" name='city' onChange={changeCity} value={user?.city}>
                                                    <option value="">-- Thành phố --</option>
                                                    {
                                                        data.listCity.map((item) => {
                                                            return (
                                                                <option key={item.provinceid} value={item.provinceid}>{item.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </label>
                                        </Grid>
                                        <Grid item sm={12} xs={12}>
                                            <label className="select">
                                                <select required="required" name='district' onChange={changeDistrict} value={user?.district}>
                                                    <option>-- Quận/Huyện --</option>
                                                    {
                                                        data.listDistrict.map((item) => {
                                                            return (
                                                                <option key={item.districtid} value={item.districtid}>{item.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </label>
                                        </Grid>
                                        <Grid item sm={12} xs={12}>
                                            <label className="select">
                                                <select required="required" name='ward' onChange={handleChange} value={user?.ward}>
                                                    <option>-- Xã/Phường --</option>
                                                    {
                                                        data.listWard.map((item) => {
                                                            return (
                                                                <option key={item.wardid} value={item.wardid}>{item.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </label>
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
                                </div>
                            </div>
                    </Dialog>
                )
            }
        </>
    )
}
export default AddressForm;