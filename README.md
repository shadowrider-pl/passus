# Passus

Recruitment task:

We have a program that processes data records whose components can be represented in the form of field-value name pairs (eg srcIp = "192.168.10.1").

Each record has a time field saved in the same way as other values. The time field is required. Records may represent data of various types, e.g. entries from logs.

Records can be read from any source (eg file, database) and saved for any purpose (eg file, database).

We assume that you may need to add a new source or target implementation at any time.

Works:

1. Please design interfaces and classes (without detailed implementation) for a program that meets the above assumptions.

2. By using the definition from point 1, please implement a fully working record saving to the MongoDB database.

3. Please implement unit tests to check the correctness of the implementation from point 2.


The following solution was proposed:

class PassusLog {

    ZonedDateTime time;

    […]

    // remaining fields

    [...]

}

interface PassusLogInterface {
	PassusLog convertLog(PassusLog log);
	[…]
	// possibly other methods
	[...]
}

class converts the data record as specified in the task:
class LogConverter implements LogInterface{
	PassusLog convertLog(PassusLog log){
	// convert the log in some way
	}
	[...]
}

class that retrieves a data record from the database and converts it

class DBConv {

     // get the record from the database

     PassusLog logFromDB = // respectively downloaded record

     // convert the record according to the task

     PassusLog logConverted = LogConverter.convertLog (logFromDB);

}

the moment comes when you need to add a new data source to transform - from a file

class FileConv {

     // open the file;

     // read the data;

     PassusLog logFromFile = // the corresponding record from the file

     // convert the record according to the task

     PassusLog logConverted = LogConverter.convertLog (logFromDB);

}

The solution of the task has been accepted, so I additionally proposed a full application that performs all the activities discussed in the task. The program uses Java, Spring, Angular, and JHipster technologies.

# Application description
The application is based on Spring Boot and the MongoDB database on the backend and Angular on the frontend using the JHipster generator. The user accessing the program through a web browser. There are two language versions available: English and Polish. The main purpose of the program is to support logs. There are two users available - user and admin with different roles and default passwords.
Current application functions:
     1. browsing logs
     2. creating logs
     3. converting logs
     4. sending log files to the server with the possibility of saving their contents to the database
     5. downloading a file with logs downloaded from the database
6. converting logs from a file and downloading a file with changed logs, without writing to the database
These functions are available from the main page after logging in.


# Application structure
In / src / main / java / finbarre / domain / there is an Entity PassusLog created with fields:
   @Id
    private String id;

    @NotNull
    @Field ( "time")
    private ZonedDateTime time;

    @Field ( "name")
    private String name;

    @Field ( "value")
    private String value;

In / src / main / java / finbarre / service / PassusLogService is an interface to support basic CRUD operations to the database.
W / src / main / java / finbarre / web / rest / there are classes responsible for handling REST, including PassusLogResource implementing PassusLogService to handle logs.
In addition, there is also the PassusLogServiceImpl class implementing PassusLogService, used to handle logs through calls other than REST. Access to the database is specified in /src/main/resources/config/application-dev.yml and application-prod.yml [currently as
    date:
        mongodb:
            uri: mongodb: // localhost: 27017
            database: Passus
]
Frontend is located in the / src / main / webapp / app / directory.

# Log processing
The log processing operation consists in adding the prefix to value [STATUS = CHECKED] to the end, if it does not exist. If exists, it will be removed. It’s done by the class ConvertLog in / src / main / java / finbarre / service / impl / and RestController ConvertLogResource in / src / main / java / finbarre / web / rest /.
Files that support processing from the front are located in / src / main / webapp / app / entities / convert-passus-log /.


# Sending files
Uploading files to the server is done by FileUploadController with support classes w / src / main / java / finbarre / storage /.
All uploaded files can be deleted or transferred to the database.
The contents of the file should be as follows:
- each log should be on a separate line
- log fields are separated by a semicolon
- if there is a semicolon in the last field, in the value field in the database there will be content to this semicolon and the remaining part will be ignored
- time field must be in the format ISO_DATE_TIME, e.g.: '2011-11-03T18:20:50' - if it is not then this log will not be added
In the main directory there is a log1.txt file with sample data to be added to the database.
Files are saved to the upload-dir directory.

The data in the sent files can be converted and immediately downloaded without writing to the database.



# Downloading logs
The DownloadLogsResource deals with downloading the log file. The first thing is to get the list of logs and save them to download-dir / logs.txt in WriteLogsToFileService w / src / main / java / finbarre / storage /. Each time it checks whether the logs.txt file exists, if it is, it is deleted and created again.

# Summary
In the task it was important that records collected from any source could be processed. This was done using the ConvertLog class. Regardless of whether records are downloaded from a file or from a database, they are processed only with this class.

# Tests
The database write tests required in the task are in / src / test / java / finbarre / web / rest / PassusLogResourceIntTest

# Start-up instructions
There are several ways to run the application.
Assuming that we have a MongoDB database in the system, it is easiest to execute the command in the root directory
./mvnw
and enter the address in the browser: http://localhost:8080/#/



This application was generated using JHipster 5.6.0, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v5.6.0](https://www.jhipster.tech/documentation-archive/v5.6.0).

## Development

To start your application in the dev profile, simply run:

    


For further instructions on how to develop with JHipster, have a look at [Using JHipster in development][].

### Using angular-cli

You can also use [Angular CLI][] to generate some custom client code.

For example, the following command:

    ng generate component my-component

will generate few files:

    create src/main/webapp/app/my-component/my-component.component.html
    create src/main/webapp/app/my-component/my-component.component.ts
    update src/main/webapp/app/app.module.ts


## Building for production

To optimize the Passus application for production, run:


To ensure everything worked, run:



Refer to [Using JHipster in production][] for more details.

## Testing

To launch your application's tests, run:

    ./gradlew test

For more information, refer to the [Running tests page][].

### Code quality

Sonar is used to analyse code quality. You can start a local Sonar server (accessible on http://localhost:9001) with:

```
docker-compose -f src/main/docker/sonar.yml up -d
```

Then, run a Sonar analysis:

```
./gradlew -Pprod clean test sonarqube
```

For more information, refer to the [Code quality page][].

## Using Docker to simplify development (optional)

You can use Docker to improve your JHipster development experience. A number of docker-compose configuration are available in the [src/main/docker](src/main/docker) folder to launch required third party services.

For example, to start a  database in a docker container, run:

    docker-compose -f src/main/docker/.yml up -d

To stop it and remove the container, run:

    docker-compose -f src/main/docker/.yml down

You can also fully dockerize your application and all the services that it depends on.
To achieve this, first build a docker image of your app by running:

    

Then run:

    docker-compose -f src/main/docker/app.yml up -d

For more information refer to [Using Docker and Docker-Compose][], this page also contains information on the docker-compose sub-generator (`jhipster docker-compose`), which is able to generate docker configurations for one or several JHipster applications.

## Continuous Integration (optional)

To configure CI for your project, run the ci-cd sub-generator (`jhipster ci-cd`), this will let you generate configuration files for a number of Continuous Integration systems. Consult the [Setting up Continuous Integration][] page for more information.

[JHipster Homepage and latest documentation]: https://www.jhipster.tech
[JHipster 5.6.0 archive]: https://www.jhipster.tech/documentation-archive/v5.6.0

[Using JHipster in development]: https://www.jhipster.tech/documentation-archive/v5.6.0/development/
[Using Docker and Docker-Compose]: https://www.jhipster.tech/documentation-archive/v5.6.0/docker-compose
[Using JHipster in production]: https://www.jhipster.tech/documentation-archive/v5.6.0/production/
[Running tests page]: https://www.jhipster.tech/documentation-archive/v5.6.0/running-tests/
[Code quality page]: https://www.jhipster.tech/documentation-archive/v5.6.0/code-quality/
[Setting up Continuous Integration]: https://www.jhipster.tech/documentation-archive/v5.6.0/setting-up-ci/


