package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"

	"net/http"

	"example.com/tribal/src/api/models"
	"example.com/tribal/src/database"

	"golang.org/x/crypto/bcrypt"
)

//Controllers
func GetUsers(w http.ResponseWriter, r *http.Request) {

	query := `SELECT * FROM users;`
	rows, err := database.DBConnection.Query(query)
	if err != nil {
		log.Fatal("Error getting users ", err)
	}
	defer rows.Close()

	var users []models.User

	for rows.Next() {
		var user models.User
		err = rows.Scan(&user.Id, &user.Name, &user.Username, &user.Password)
		if err != nil {
			log.Fatal("Error getting data from rows returned ", err)
		}
		users = append(users, user)
	}

	json.NewEncoder(w).Encode(users)
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
	var u models.User

	err := json.NewDecoder(r.Body).Decode(&u)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	//Check if a user with that username doesn't already exist
	var name string
	sqlQuery1 := `SELECT name FROM users WHERE username = $1;`
	row := database.DBConnection.QueryRow(sqlQuery1, u.Username)

	erro := row.Scan(&name)
	switch erro {
	case sql.ErrNoRows:
		log.Println("No rows")
	default:
		log.Println("Error DB: ", erro)
	}

	if name != "" {
		log.Println(name)
		http.Error(w, "Error usuario ya existente", http.StatusBadRequest)
		return
	}

	//Hash password
	newPass, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	u.Password = string(newPass)

	sqlStatement := `
	INSERT INTO users(name, username, password)
	VALUES($1,$2,$3)
	`
	_, err = database.DBConnection.Exec(sqlStatement, u.Name, u.Username, u.Password)
	if err != nil {
		log.Fatal("Error creating a user ", err)
	}

	fmt.Printf("User: %+v \n", u)

	w.Write([]byte("Create user"))
}

//Login verifyPassword with bcrypt
//bycrypt.comparehashandpassword ...
