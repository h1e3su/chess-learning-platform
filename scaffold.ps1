$baseDir = "d:\THAYDAUIEU\chess-backend"
New-Item -ItemType Directory -Force -Path $baseDir | Out-Null

$parentPom = @"
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.chess</groupId>
    <artifactId>chess-backend</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.4</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <properties>
        <java.version>17</java.version>
        <spring-cloud.version>2023.0.1</spring-cloud.version>
    </properties>

    <modules>
        <module>eureka-server</module>
        <module>api-gateway</module>
        <module>user-service</module>
        <module>course-service</module>
        <module>payment-service</module>
        <module>game-service</module>
        <module>notification-service</module>
    </modules>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>`${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

</project>
"@
Set-Content -Path "$baseDir\pom.xml" -Value $parentPom -Encoding UTF8

$services = @(
    @{ name="eureka-server"; package="com.chess.eureka"; class="EurekaServerApplication"; deps="spring-cloud-starter-netflix-eureka-server"; port="8761" },
    @{ name="api-gateway"; package="com.chess.gateway"; class="ApiGatewayApplication"; deps="spring-cloud-starter-gateway, spring-cloud-starter-netflix-eureka-client"; port="8080" },
    @{ name="user-service"; package="com.chess.user"; class="UserServiceApplication"; deps="spring-boot-starter-web, spring-boot-starter-data-jpa, org.postgresql:postgresql, spring-cloud-starter-netflix-eureka-client"; port="8081" },
    @{ name="course-service"; package="com.chess.course"; class="CourseServiceApplication"; deps="spring-boot-starter-web, spring-boot-starter-data-jpa, org.postgresql:postgresql, spring-cloud-starter-netflix-eureka-client"; port="8082" },
    @{ name="payment-service"; package="com.chess.payment"; class="PaymentServiceApplication"; deps="spring-boot-starter-web, spring-boot-starter-data-jpa, org.postgresql:postgresql, spring-cloud-starter-netflix-eureka-client, org.springframework.boot:spring-boot-starter-amqp"; port="8083" },
    @{ name="game-service"; package="com.chess.game"; class="GameServiceApplication"; deps="spring-boot-starter-web, spring-boot-starter-websocket, spring-boot-starter-data-mongodb, org.springframework.boot:spring-boot-starter-data-redis, spring-cloud-starter-netflix-eureka-client"; port="8084" },
    @{ name="notification-service"; package="com.chess.notification"; class="NotificationServiceApplication"; deps="spring-boot-starter-web, org.springframework.boot:spring-boot-starter-amqp, spring-boot-starter-data-mongodb, spring-cloud-starter-netflix-eureka-client"; port="8085" }
)

foreach ($svc in $services) {
    $svcDir = "$baseDir\$($svc.name)"
    $pkgDir = "$svcDir\src\main\java\" + $svc.package.Replace('.', '\')
    $resDir = "$svcDir\src\main\resources"
    
    New-Item -ItemType Directory -Force -Path $pkgDir | Out-Null
    New-Item -ItemType Directory -Force -Path $resDir | Out-Null
    
    # pom.xml
    $depsXml = ""
    foreach ($dep in $svc.deps.Split(",")) {
        $dep = $dep.Trim()
        if ($dep -like "*:*") {
            $parts = $dep.Split(":")
            $groupId = $parts[0]
            $artifactId = $parts[1]
        } else {
            $groupId = "org.springframework.cloud"
            $artifactId = $dep
            if ($dep -like "spring-boot-*") {
                $groupId = "org.springframework.boot"
            }
        }
        $depsXml += @"
        <dependency>
            <groupId>$groupId</groupId>
            <artifactId>$artifactId</artifactId>
        </dependency>
"@
    }

    $pomXml = @"
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.chess</groupId>
        <artifactId>chess-backend</artifactId>
        <version>1.0-SNAPSHOT</version>
    </parent>

    <artifactId>$($svc.name)</artifactId>

    <dependencies>
$depsXml
    </dependencies>
</project>
"@
    Set-Content -Path "$svcDir\pom.xml" -Value $pomXml -Encoding UTF8

    # Application.java
    $annotations = "@SpringBootApplication`n"
    if ($svc.name -eq "eureka-server") {
        $annotations += "@EnableEurekaServer`n"
    } elseif ($svc.name -ne "api-gateway") {
        $annotations += "@EnableDiscoveryClient`n"
    }

    $imports = "import org.springframework.boot.SpringApplication;`nimport org.springframework.boot.autoconfigure.SpringBootApplication;"
    if ($svc.name -eq "eureka-server") {
        $imports += "`nimport org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;"
    } elseif ($svc.name -ne "api-gateway") {
        $imports += "`nimport org.springframework.cloud.client.discovery.EnableDiscoveryClient;"
    }

    $appJava = @"
package $($svc.package);

$imports

$annotations
public class $($svc.class) {
    public static void main(String[] args) {
        SpringApplication.run($($svc.class).class, args);
    }
}
"@
    Set-Content -Path "$pkgDir\$($svc.class).java" -Value $appJava -Encoding UTF8

    # application.yml
    $appYml = @"
server:
  port: $($svc.port)

spring:
  application:
    name: $($svc.name)
"@
    
    if ($svc.name -eq "eureka-server") {
        $appYml += @"
eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
"@
    } else {
        $appYml += @"

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
"@
    }

    Set-Content -Path "$resDir\application.yml" -Value $appYml -Encoding UTF8
}
