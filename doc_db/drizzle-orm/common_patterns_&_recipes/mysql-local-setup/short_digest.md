## Setup MySQL with Docker

Pull image: `docker pull mysql` (or `mysql:8.2` for specific version)

Start container:
```bash
docker run --name drizzle-mysql -e MYSQL_ROOT_PASSWORD=mypassword -d -p 3306:3306 mysql
```

Optional: `-e MYSQL_DATABASE=dbname`, `-e MYSQL_USER=user -e MYSQL_PASSWORD=pass`

Connection URL: `mysql://root:mypassword@localhost:3306/mysql`