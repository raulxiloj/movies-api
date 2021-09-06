package database

import (
	"database/sql"

	_ "github.com/lib/pq"
)

var (
	DBConnection *sql.DB
)

// func Connect() (*sql.DB, error) {
// 	db, err := sql.Open("postgres", config.PsqlInfo)
// 	if err != nil {
// 		fmt.Println(err)
// 		return nil, err
// 	}
// 	return db, nil
// }
