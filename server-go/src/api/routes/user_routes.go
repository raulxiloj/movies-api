package routes

import (
	"net/http"

	"example.com/tribal/src/api/controllers"
)

var userRoutes = []Route{
	{
		Url:          "/users",
		Method:       http.MethodPost,
		Handler:      controllers.CreateUser,
		AuthRequired: false,
	},
	{
		Url:          "/users/login",
		Method:       http.MethodPost,
		Handler:      controllers.Login,
		AuthRequired: false,
	},
	{
		Url:          "/users",
		Method:       http.MethodGet,
		Handler:      controllers.GetUsers,
		AuthRequired: true,
	},
}
