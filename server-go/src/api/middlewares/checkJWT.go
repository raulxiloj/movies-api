package middlewares

import (
	"fmt"
	"log"
	"net/http"

	"example.com/tribal/src/config"
	"github.com/golang-jwt/jwt"
)

func CheckToken(next http.HandlerFunc) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		tokenString := r.Header.Get("token")

		if tokenString == "" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		//Validate token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}
			return config.JWT_SECRET, nil
		})

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			log.Println(claims)
			next(w, r)
		} else {
			fmt.Println(err)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
	}

}
