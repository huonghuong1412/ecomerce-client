import { Dialog } from '@material-ui/core';
import { API_URL } from 'actions/constants/constants';
import { addComment } from 'actions/services/CommentServices';
import React, { useState } from 'react'
import ReactStars from "react-rating-stars-component";
import { toast } from 'react-toastify';

export default function CustomerReviewForm(props) {

    const { onClose, open, product, user } = props;

    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setContent(value)
    };

    const handleCloseForm = () => {
        onClose();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const now = new Date();
        const create_time = now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear();
        const data = {
            rating: rating,
            content: content,
            productId: product?.product_id,
            displayName: user,
            date_comment: create_time
        }
        addComment(data)
            .then((res) => {
                toast.info(res.data.message, {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                handleCloseForm();
            })
            .catch(() => {
                toast.error('Bình luận sản phẩm không thành công!', {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
    }

    const ratingChanged = (newRating) => {
        setRating(newRating)
    };

    return (
        <Dialog onClose={onClose} open={open} style={{
            minWidth: 650,
            padding: 30
        }}>
            <div className="iwgwUj write-review">
                <div className="write-review__close" onClick={handleCloseForm}>
                    <img src="https://salt.tikicdn.com/ts/upload/9b/80/20/6d09a37c46316cbdaf5024c6520c9801.jpg" alt="" />
                </div>
                <form className="write-review__inner">
                    <div className="write-review__product">
                        <img src={`${API_URL}/images/product/${product?.mainImage}`} alt="" className="write-review__product-img" />
                        <div className="write-review__product-wrap">
                            <div className="write-review__product-name">{product?.product_name}</div>
                            <div className="write-review__product-seller">{'ABC'}</div>
                        </div>
                    </div>
                    <div className="write-review__heading">Vui lòng đánh giá</div>
                    <div className="write-review__stars">
                        <ReactStars
                            count={5}
                            onChange={ratingChanged}
                            size={50}
                            activeColor="#ffd700"
                        />
                    </div>
                    <textarea rows={8} placeholder="Chia sẻ thêm thông tin sản phẩm" className="write-review__input" defaultValue={""} onChange={handleChange} />
                    <div className="write-review__buttons">
                        <button type="submit" className="write-review__button write-review__button--submit" onClick={handleSubmit}>
                            <span>Gửi đánh giá</span>
                        </button>
                    </div>
                </form>
            </div>
        </Dialog>
    )
}
