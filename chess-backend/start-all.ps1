Start-Process powershell -ArgumentList "-NoExit -Command `"cd eureka-server; mvn spring-boot:run`"" -WindowStyle Normal
Start-Sleep -Seconds 15

Start-Process powershell -ArgumentList "-NoExit -Command `"cd api-gateway; mvn spring-boot:run`"" -WindowStyle Normal
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "-NoExit -Command `"cd user-service; mvn spring-boot:run`"" -WindowStyle Normal
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "-NoExit -Command `"cd course-service; mvn spring-boot:run`"" -WindowStyle Normal
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "-NoExit -Command `"cd payment-service; mvn spring-boot:run`"" -WindowStyle Normal
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "-NoExit -Command `"cd game-service; mvn spring-boot:run`"" -WindowStyle Normal
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "-NoExit -Command `"cd notification-service; mvn spring-boot:run`"" -WindowStyle Normal
