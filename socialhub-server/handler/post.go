package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath"

	"around/model"
	"around/service"

	"github.com/pborman/uuid"

	"github.com/gorilla/mux"

	jwt "github.com/form3tech-oss/jwt-go"
)

var (
	mediaTypes = map[string]string{
		".jpeg": "image",
		".jpg":  "image",
		".gif":  "image",
		".png":  "image",
		".mov":  "video",
		".mp4":  "video",
		".avi":  "video",
		".flv":  "video",
		".wmv":  "video",
	}
)

func deleteHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one request for delete")

	user := r.Context().Value("user")
	claims := user.(*jwt.Token).Claims
	username := claims.(jwt.MapClaims)["username"].(string)
	id := mux.Vars(r)["id"]

	if err := service.DeletePost(id, username); err != nil {
		http.Error(w, "Failed to delete post from backend", http.StatusInternalServerError)
		fmt.Printf("Failed to delete post from backend %v\n", err)
		return
	}
	fmt.Println("Post is deleted successfully")
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	// Parse from body of request to get a json object.
	fmt.Println("Received one post request")

	// jwtmiddleware will put the token into it
	token := r.Context().Value("user")
	claims := token.(*jwt.Token).Claims // type assertion
	username := claims.(jwt.MapClaims)["username"]

	// post is a pointer when initialization
	post := &model.Post{
		// automatically generate a unique #ID
		Id:      uuid.New(),
		User:    username.(string),
		Message: r.FormValue("message"),
	}

	file, header, err := r.FormFile("media_file")
	if err != nil {
		// 400
		http.Error(w, "Media file is not available", http.StatusBadRequest)
		fmt.Printf("Media file is not available %v\n", err)
		return
	}

	// header: meta data
	// Ext: extension
	suffix := filepath.Ext(header.Filename)
	// if suffix does not exist in the mediaTypes, ok = false
	if t, ok := mediaTypes[suffix]; ok {
		post.Type = t
	} else {
		post.Type = "unknown"
	}

	err = service.SavePost(post, file)
	if err != nil {
		http.Error(w, "Failed to save post to backend", http.StatusBadRequest)
		fmt.Printf("Failed to save post to backend %v\n", err)
		return
	}

	fmt.Println("Post is saved to backend successfully.")
}

func searchHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one request for search")
	w.Header().Set("Content-Type", "application/json")

	user := r.URL.Query().Get("user")
	keywords := r.URL.Query().Get("keywords")

	var posts []model.Post
	var err error
	if user != "" {
		posts, err = service.SearchPostsByUser(user)
	} else {
		posts, err = service.SearchPostsByKeywords(keywords)
	}

	if err != nil {
		// 500
		http.Error(w, "Failed to read post from backend", http.StatusInternalServerError)
		fmt.Printf("Failed to read post from backend %v.\n", err)
		return
	}
	// transform the go object to json object
	js, err := json.Marshal(posts)
	if err != nil {
		http.Error(w, "Failed to parse posts into JSON format", http.StatusInternalServerError)
		fmt.Printf("Failed to parse posts into JSON format %v.\n", err)
		return
	}
	w.Write(js)
}
