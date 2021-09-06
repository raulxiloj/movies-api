package routes

import (
	"net/http"

	"example.com/tribal/src/api/controllers"
)

var userRoutes = []Route{
	{
		Url:     "/users",
		Method:  http.MethodGet,
		Handler: controllers.GetUsers,
	},
	{
		Url:     "/users",
		Method:  http.MethodPost,
		Handler: controllers.CreateUser,
	},
}
