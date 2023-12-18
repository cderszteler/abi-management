FROM gradle:jdk21-alpine AS build

COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src

RUN gradle build --no-daemon

FROM eclipse-temurin:21
WORKDIR /app

COPY --from=build /home/gradle/src/build/libs/*.jar /app/spring-boot-application.jar

EXPOSE 5000
ENTRYPOINT ["java", "-jar","/app/spring-boot-application.jar"]