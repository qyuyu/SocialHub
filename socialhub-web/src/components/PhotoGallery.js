import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Gallery from 'react-grid-gallery';
import { DeleteOutlined } from "@ant-design/icons";
import { BASE_URL, TOKEN_KEY } from "../constants";
import axios from "axios";
import { message } from "antd";

const captionStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    maxHeight: "240px",
    overflow: "hidden",
    position: "absolute",
    bottom: "0",
    width: "100%",
    color: "white",
    padding: "2px",
    fontSize: "90%"
};

const wrapperStyle = {
    display: "block",
    minHeight: "1px",
    width: "100%",
    border: "1px solid #ddd",
    overflow: "auto"
};

function PhotoGallery(props) {
    const [ images, setImages ] = useState(props.images);
    const [ curImgIdx, setCurImgIdx ] = useState(0);
    const imageArr = images.map( image => {
        return {
            ...image,
            customOverlay: (
                <div style={captionStyle}>
                    <div>{`${image.user}: ${image.caption}`}</div>
                </div>
            )
        }
    })
    const onCurrentImageChange = index => {
        setCurImgIdx(index);
        console.log(index);
    }
    const onDeleteImage = () => {
        if(window.confirm("Are you gonna delete this image?")) {
            // step1: find the current selected image from the images
            // step2: remove the selected image from the imageArr
            // step3: inform the backend server to delete the current selected image
            // step4: analyze the response from the backend
            //        case1: successfully delete => update UI
            //        case2: failed => inform users
            const curImg = images[curImgIdx];
            const newImgArr = images.filter((img, index) => index !== curImgIdx);
            const opt = {
                method: "DELETE",
                url: `${BASE_URL}/post/${curImg.postId}`,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                }
            };
            axios(opt)
                .then( res => {
                    console.log('delete result -> ', res);
                    // case1: success
                    if(res.status === 200) {
                        // step1: set state
                        setImages(newImgArr);
                    }
                })
                .catch( err => {
                    // case2: fail
                    message.error('Fetch posts failed!');
                    console.log('fetch posts failed: ', err.message);
                })
        }
    }

    useEffect( () => {
        setImages(props.images);
    }, [props.images])

    return (
        <div style={wrapperStyle}>
            <Gallery
                images={imageArr}
                enableImageSelection={false}
                backdropClosesModal={true}
                currentImageWillChange={onCurrentImageChange}
                customControls={[
                    <button
                        type="primary"
                        icon={<DeleteOutlined />}
                        onClick={onDeleteImage}>Delete Image</button>
                ]}
            />
        </div>
    );
}

PhotoGallery.proptype = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            src: PropTypes.string,
            thumbnail: PropTypes.string,
            thumbnailWidth: PropTypes.number,
            thumbnailHeight: PropTypes.number,
            user: PropTypes.string,
            caption: PropTypes.string
            })
    ).isRequired
}

export default PhotoGallery;