package service

import (
	"fmt"

	"around/backend"
	"around/constants"
	"around/model"

	"github.com/olivere/elastic/v7"
)

func CheckUser(username, password string) (bool, error) {
	query := elastic.NewBoolQuery()
	query.Must(elastic.NewTermQuery("username", username))
	query.Must(elastic.NewTermQuery("password", password))

	searchResult, err := backend.ESBackend.ReadFromES(query, constants.USER_INDEX)
	if err != nil {
		return false, err
	}

	return searchResult.TotalHits() > 0, nil
}

func AddUser(user *model.User) (bool, error) {
	query := elastic.NewTermQuery("username", user.Username)
	searchResult, err := backend.ESBackend.ReadFromES(query, constants.USER_INDEX)
	if err != nil {
		return false, err
	}

	if searchResult.TotalHits() > 0 {
		return false, nil
	}

	err = backend.ESBackend.SaveToES(user, constants.USER_INDEX, user.Username)
	if err != nil {
		return false, err
	}
	
	fmt.Printf("User is added: %s\n", user.Username)
	return true, nil
}
