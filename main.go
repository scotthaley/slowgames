package main

import (
	"github.com/gin-contrib/multitemplate"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"net/http"
)

func createRenderer() multitemplate.Renderer {
	r := multitemplate.NewRenderer()
	r.AddFromFiles("login", "templates/base.tmpl", "templates/login/index.tmpl")
	return r
}

func main() {
	router := gin.Default()
	router.HTMLRender = createRenderer()

	router.Use(static.Serve("/assets", static.LocalFile("./static", false)))

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "login", gin.H{
			"title": "Hello World",
		})
	})

	err := router.Run(":5000")
	if err != nil {
		panic("Failed to start gin server!")
	}
}
