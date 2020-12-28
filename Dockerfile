FROM maven:3.6.3-jdk-11 AS build
WORKDIR /usr/local/service
COPY src /usr/local/service/src
COPY pom.xml /usr/local/service
RUN mvn -f /usr/local/service/pom.xml clean package

FROM adoptopenjdk/openjdk11:latest
EXPOSE 8080
WORKDIR /usr/local/service
COPY --from=build /usr/local/service/target/printserver-0.0.1-SNAPSHOT.jar /usr/local/service/target/printserver-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java", "-jar", "target/printserver-0.0.1-SNAPSHOT.jar"]


