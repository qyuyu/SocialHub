import React, { useState, useEffect } from "react";
import { Tabs, message, Row, Col, Button } from "antd";
import axios from "axios";
import CreatePostButton from "./CreatePostButton";
import SearchBar from "./SearchBar";
import PhotoGallery from "./PhotoGallery";
import { SEARCH_KEY, BASE_URL, TOKEN_KEY } from "../constants";

const { TabPane } = Tabs;

function Home(props) {
    const [posts, setPost] = useState([]);
    const [activeTab, setActiveTab] = useState("image");
    const [searchOption, setSearchOption] = useState({
        type: SEARCH_KEY.all,
        keyword: ""
    });

    useEffect(() => {
        const { type, keyword } = searchOption;
        fetchPost(searchOption);
    }, [searchOption]);

    const handleSearch = option => {
        console.log(option);
        // get search result from the server
        // by updating search option
        setSearchOption({type: option.type, keyword: option.keyword});
    }

    const fetchPost = (option) => {
        const { type, keyword } = option;
        let url = "";

        if (type === SEARCH_KEY.all) {
            url = `${BASE_URL}/search`;
        } else if (type === SEARCH_KEY.user) {
            url = `${BASE_URL}/search?user=${keyword}`;
        } else {
            url = `${BASE_URL}/search?keywords=${keyword}`;
        }

        const opt = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };

        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    setPost(res.data);
                }
            })
            .catch((err) => {
                message.error("Fetch posts failed!");
                console.log("fetch posts failed: ", err.message);
            });
    };

    const renderPosts = (type) => {
        if (!posts || posts.length === 0) {
            return <div>No data!</div>;
        }
        if (type === "image") {
            // remove all non-image posts
            // add attribute to each image post
            // pass image[] to PhotoGallary
            const imageArr = posts
                .filter(post => post.type === "image")
                .map(post => {
                    return {
                        postId: post.id,
                        src: post.url,
                        thumbnail: post.url,
                        thumbnailWidth: 320,
                        thumbnailHeight: 174,
                        user: post.user,
                        caption: post.message
                    }
                })
            return <PhotoGallery images={imageArr}/>
        } else if (type === "video") {
            console.log("video -> ", posts);
            return (
                <Row gutter={32}>
                    {posts
                        .filter(post => post.type === "video")
                        .map( post => (
                            <Col span={8} key={post.url}>
                                <video
                                    controls={true}
                                    src={post.url}
                                    className="video-block"
                                />
                                <p>
                                    {post.user} : {post.message}
                                </p>
                            </Col>
                        ))
                    }
                </Row>
            )
        }
    };

    const showPost = (postType) => {
        // post type
        setActiveTab(postType)
        setTimeout(() => {
            //refresh post list
            setSearchOption( {type: SEARCH_KEY.all, keyword: ""});
        }, 3000)
    }

    const operations = <CreatePostButton onShowPost={showPost}/>;

    return (
        <div className="home">
            <SearchBar handleSearch={handleSearch}/>
            <div className="display">
                <Tabs
                    onChange={(key) => setActiveTab(key)}
                    defaultActiveKey="image"
                    activeKey={activeTab}
                    tabBarExtraContent={operations}
                >
                    <TabPane tab="Images" key="image">
                        {renderPosts("image")}
                    </TabPane>
                    <TabPane tab="Videos" key="video">
                        {renderPosts("video")}
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}

export default Home;