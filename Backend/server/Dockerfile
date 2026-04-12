FROM gradle:8.7-jdk21 AS build
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
RUN gradle dependencies --no-daemon -Dorg.gradle.native=false > /dev/null 2>&1 || true
COPY src ./src
RUN gradle bootJar --no-daemon -Dorg.gradle.native=false

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
