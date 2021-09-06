package routes

import (
	"net/http"

	"github.com/gorilla/mux"
)

//Routes
type Route struct {
	Url     string
	Method  string
	Handler func(http.ResponseWriter, *http.Request)
}

func SetupRoutes(r *mux.Router) *mux.Router {
	for _, route := range userRoutes {
		r.HandleFunc(route.Url, route.Handler).Methods(route.Method)
	}
	return r
}
