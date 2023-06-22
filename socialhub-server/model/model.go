package model

type Post struct {
	// 首字母小写就变为private fields
	// json tag：go自带json包能把body转化为json数据
	// ``反引号为了方便省去转义
	Id      string `json:"id"`
    User    string `json:"user"`
    Message string `json:"message"`
    Url     string `json:"url"`
    Type    string `json:"type"`
}

type User struct {
    Username string `json:"username"`
    Password string `json:"password"`
    Age      int64  `json:"age"`
    Gender   string `json:"gender"`
}