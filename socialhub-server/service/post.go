package service

import (
	"around/backend"
	"around/constants"
	"around/model"
	"mime/multipart"
	"reflect"

	"github.com/olivere/elastic/v7"
)

func SearchPostsByUser(user string) ([]model.Post, error) {
	query := elastic.NewTermQuery("user", user)
	searchResult, err := backend.ESBackend.ReadFromES(query, constants.POST_INDEX)
	if err != nil {
		return nil, err
	}
	return getPostFromSearchResult(searchResult)
}

func SearchPostsByKeywords(keywords string) ([]model.Post, error) {
	query := elastic.NewMatchQuery("message", keywords)
	query.Operator("AND")
	if keywords == "" {
		query.ZeroTermsQuery("all")
	}
	searchResult, err := backend.ESBackend.ReadFromES(query, constants.POST_INDEX)
	if err != nil {
		return nil, err
	}
	return getPostFromSearchResult(searchResult)
}

func getPostFromSearchResult(searchResult *elastic.SearchResult) ([]model.Post, error) {
	var ptype model.Post
	var posts []model.Post

	for _, item := range searchResult.Each(reflect.TypeOf(ptype)) {
		p := item.(model.Post)
		posts = append(posts, p)
	}
	return posts, nil
}

func SavePost(post *model.Post, file multipart.File) error {
	MediaLink, err := backend.GCSBackend.SaveToGCS(file, post.Id)
	if err != nil {
		return err
	}
	post.Url = MediaLink
	// if medialink successfully created but cannot save to ES:
	// does not affect the user experience
	// aoes affect the GCS storage

	// How can we achieve transaction?
	// hard to do, but we can periodically check garbage images in the GCS
	// how to check: loop all files in GCS, search ES by url
	err = backend.ESBackend.SaveToES(post, constants.POST_INDEX, post.Id)
	return err
}

func DeletePost(id string, user string) error {
	query := elastic.NewBoolQuery()
	query.Must(elastic.NewTermQuery("id", id))
	query.Must(elastic.NewTermQuery("user", user))

	return backend.ESBackend.DeleteFromES(query, constants.POST_INDEX)
}
