package routes

import (
	"net/http"

	"example.com/tribal/src/api/middlewares"
	"github.com/gorilla/mux"
)

//Routes
type Route struct {
	Url          string
	Method       string
	Handler      func(http.ResponseWriter, *http.Request)
	AuthRequired bool
}

func SetupRoutes(r *mux.Router) *mux.Router {
	for _, route := range userRoutes {
		if route.AuthRequired {
			r.HandleFunc(route.Url, middlewares.CheckToken(route.Handler)).Methods(route.Method)
		} else {
			r.HandleFunc(route.Url, route.Handler).Methods(route.Method)
		}
	}
	return r
}
