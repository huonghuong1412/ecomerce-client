import { Button, Grid, makeStyles, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { getUserLogin } from 'actions/services/UserActions';
import AccountNavbar from 'components/AccountNavbar/AccountNavbar.';
import Loading from 'components/Loading/Loading'
import { updateAddressUser } from 'actions/services/AddressActions'
import { getListProvince, getListDistrict, getListWard } from 'actions/services/GHNServices'
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
        fullName: '',
        username: '',
        city: '',
        district: '',
        ward: '',
        house: ''
    })

    const [addressUser, setAddressUser] = useState({
        city: '',
        city_id: 0,
        district: '',
        district_id: 0,
        ward: '',
        ward_id: '',
        house: ''
    })
    const [loading, setLoading] = useState(true);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        updateAddressUser(user)
            .then((res) => {
                toast.success("Cập nhật thông tin thành công.")
                setAddressUser(res.data)
                getUser();
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

        document.title = "Số địa chỉ | Tiki"

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
                                    <div className="col l-2-4 m-3 c-3">
                                        <AccountNavbar name={user?.fullName} />
                                    </div>
                                    <div className="col l-9-4 m-9 c-9">
                                        <Grid container>
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
                                            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                                                <Grid item sm={12} xs={12}>
                                                    {/* <label className="select">
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
                                                </label> */}
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
                                                    {/* <label className="select">
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
                                                </label> */}
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
                                                    {/* <label className="select">
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
                                                </label> */}
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
                                                        value={user?.house}
                                                        fullWidth
                                                        className={classes.textInput}
                                                        onChange={handleChange}
                                                        label='Địa chỉ nhà'

                                                    />
                                                </Grid>
                                                <Grid item sm={12} xs={12}>
                                                    <Button
                                                        type="submit"
                                                        variant="outlined" color="secondary"
                                                        style={{ margin: '10px 0', width: '100%' }}
                                                        className="btn btn--e-transparent-brand-b-2"
                                                    >Cập nhật địa chỉ</Button>
                                                </Grid>
                                            </form>
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