package controllers

import (
	"encoding/json"
	"log"
	"time"

	"net/http"

	"example.com/tribal/src/api/models"
	"example.com/tribal/src/config"
	"example.com/tribal/src/database"
	jwt "github.com/golang-jwt/jwt"

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
	var username string
	sqlQuery1 := `SELECT username FROM users WHERE username = $1;`
	row := database.DBConnection.QueryRow(sqlQuery1, u.Username)

	err = row.Scan(&username)
	if err != nil {
		log.Println("Error fetching data: ", err)
	}

	if username != "" {
		log.Println("Ya existe un usuario con el siguiente username ", username)
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

	json.NewEncoder(w).Encode(u)
}

func Login(w http.ResponseWriter, r *http.Request) {

	var u models.User

	err := json.NewDecoder(r.Body).Decode(&u)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var id int
	var username string
	var password string
	sqlQuery1 := `SELECT id, username, password FROM users WHERE username = $1;`
	row := database.DBConnection.QueryRow(sqlQuery1, u.Username)

	err = row.Scan(&id, &username, &password)
	if err != nil {
		log.Println("Error fetching data: ", err)
	}

	//Match passwords
	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(u.Password))

	if err != nil {
		log.Println("Las contrasena no coinciden ", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	//Create token
	claims := jwt.MapClaims{}
	claims["user_id"] = u.Id
	claims["exp"] = time.Now().Add(time.Hour * 1).Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(config.JWT_SECRET)
	if err != nil {
		log.Println("Error al generar el token ", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Write([]byte(tokenString))
}
