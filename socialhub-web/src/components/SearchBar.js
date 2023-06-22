import React, { useState } from "react";
import { Input, Radio } from "antd";

import { SEARCH_KEY } from "../constants";

const { Search } = Input;

function SearchBar(props) {
    const [searchType, setSearchType] = useState(SEARCH_KEY.all);
    const [error, setError] = useState("");

    const changeSearchType = (e) => {
        const searchType = e.target.value;
        setSearchType(searchType);
        setError("");
        // inform Home component => {type: all, keyword: ""}
        if (searchType === SEARCH_KEY.all) {
          props.handleSearch({ type: searchType, keyword: "" });
        }
    };

    const handleSearch = (value) => {
        // display error message if needed
        if (searchType !== SEARCH_KEY.all && value === "") {
            setError("Please input your search keyword!");
            return;
        }
        setError("");
        // search type + search value => get search result
        props.handleSearch({ type: searchType, keyword: value });
    };

    return (
        <div className="search-bar">
            <Search
                placeholder="input search text"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={handleSearch}
                disabled={searchType === SEARCH_KEY.all}
            />
            <p className="error-msg">{ error }</p>

            <Radio.Group
                onChange={changeSearchType}
                value={searchType}
                className="search-type-group"
            >
                <Radio value={SEARCH_KEY.all}>All</Radio>
                <Radio value={SEARCH_KEY.keyword}>Keyword</Radio>
                <Radio value={SEARCH_KEY.user}>User</Radio>
            </Radio.Group>
        </div>
    );
}

export default SearchBar;
