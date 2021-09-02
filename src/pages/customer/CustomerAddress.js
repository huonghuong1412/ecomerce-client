import { Button, Grid, makeStyles, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { getUserLogin } from 'actions/services/UserActions';
import AccountNavbar from 'components/AccountNavbar/AccountNavbar.';
import Loading from 'components/Loading/Loading'
import { getAllCity, getAllDistrictByCityId, getAllWardByDistrictId, updateAddressUser } from 'actions/services/AddressActions'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import useTimeout from 'hooks/useTimeout';
toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
});

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 120,
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
    image: {
        marginTop: 10,
        width: 200,
        height: 200,
        objectFit: 'cover',
        marginRight: 10
    },
    textInput: {
        fontSize: '1.3rem'
    }
}))

const CustomerAddress = (props) => {

    const classes = useStyles();

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

    const [addressUser, setAddressUser] = useState({
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
        getAllDistrictByCityId(value)
            .then((res) => setData({
                ...data,
                listDistrict: res.data,
                listWard: []
            }))
            .catch(() => alert("ERROR"))
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

    const handleSubmit = (e) => {
        e.preventDefault();
        updateAddressUser(user)
            .then((res) => {
                toast.success("Cập nhật thông tin thành công.")
                setAddressUser(res.data)

            })
            .catch(err => console.log(err))
    }

    const getUser = () => {
        getUserLogin()
            .then(res => {
                setUser(res.data);
                setAddressUser({
                    city: res.data.city,
                    district: res.data.district,
                    ward: res.data.ward,
                    house: res.data.house,
                })
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
                    <div className="row sm-gutter section__content">
                        <div className="col l-12 m-12 c-12">
                            <div className="home-product">
                                <div className="row sm-gutter section__item">
                                    <div className="col l-3 m-3 c-3">
                                        <AccountNavbar name={user?.username} />
                                    </div>
                                    <div className="col l-9 m-9 c-9">
                                        <Grid className="" container spacing={2}>
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
                                                                <tr>
                                                                    <td>Địa chỉ</td>
                                                                    <td>{addressUser.house + ", " + addressUser.ward + ", " + addressUser.district + ", " + addressUser.city}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </Grid>
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
                                                    style={{ margin: '10px 0', width: '100%' }}
                                                    className="btn btn--e-transparent-brand-b-2"
                                                >Cập nhật địa chỉ</Button>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default CustomerAddress