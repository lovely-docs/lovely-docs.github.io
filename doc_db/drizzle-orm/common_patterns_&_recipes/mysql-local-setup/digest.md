## Setup MySQL locally with Docker

### Prerequisites
- Install Docker Desktop for your operating system

### Pull MySQL image
Pull the latest MySQL image from Docker Hub:
```bash
docker pull mysql
```

Or pull a specific version:
```bash
docker pull mysql:8.2
```

Verify the image is downloaded:
```bash
docker images
```

### Start MySQL container
Run a new MySQL container:
```bash
docker run --name drizzle-mysql -e MYSQL_ROOT_PASSWORD=mypassword -d -p 3306:3306 mysql
```

Options explained:
- `--name drizzle-mysql` - container name
- `-e MYSQL_ROOT_PASSWORD=mypassword` - root user password
- `-d` - run in detached mode (background)
- `-p 3306:3306` - map container port 3306 to host port 3306
- `mysql` - image name (can specify version like `mysql:8.2`)

Optional parameters:
- `-e MYSQL_DATABASE=` - create a database on startup (default: `mysql`)
- `-e MYSQL_USER=` and `-e MYSQL_PASSWORD=` - create a new user with password (still requires `MYSQL_ROOT_PASSWORD`)

Verify container is running:
```bash
docker ps
```

### Configure database URL
Connection string format:
```
mysql://<user>:<password>@<host>:<port>/<database>
```

Example for the created container:
```
mysql://root:mypassword@localhost:3306/mysql
```

Use this URL to connect to the database in your application.