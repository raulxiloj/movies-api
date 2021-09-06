package config

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

var (
	PORT        = 0
	DB_HOST     = ""
	DB_PORT     = 0
	DB_NAME     = ""
	DB_USER     = ""
	DB_PASSWORD = ""
	PsqlInfo    = ""
)

func Load() {
	var err error
	err = godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}

	PORT, err = strconv.Atoi(os.Getenv("API_PORT"))
	if err != nil {
		//log.Println(err)
		PORT = 5000
	}

	DB_HOST = os.Getenv("DB_HOST")
	DB_PORT, err = strconv.Atoi(os.Getenv("DB_PORT"))
	if err != nil {
		log.Fatal(err)
	}
	DB_NAME = os.Getenv("DB_NAME")
	DB_USER = os.Getenv("DB_USER")
	DB_PASSWORD = os.Getenv("DB_PASSWORD")

	PsqlInfo = fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=require",
		DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)
}
