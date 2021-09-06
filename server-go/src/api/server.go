package api

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"example.com/tribal/src/api/routes"
	"example.com/tribal/src/config"
	"example.com/tribal/src/database"
	"github.com/gorilla/mux"
)

func Run() {
	config.Load()

	//Db connection
	db, err := sql.Open("postgres", config.PsqlInfo)
	if err != nil {
		log.Fatal("Error while connecting:", err)
	}
	defer db.Close()

	//Test connection
	err = db.Ping()
	if err != nil {
		log.Fatal("Error while connecting DB:", err)
	}
	database.DBConnection = db

	log.Println("Connected to Postgres DB")

	//Start listening
	listen(config.PORT)
}

func listen(port int) {
	log.Printf("Listening on port %d \n", config.PORT)

	r := mux.NewRouter().StrictSlash(true)
	r = routes.SetupRoutes(r)
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Initial route")
	})

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), r))
}
