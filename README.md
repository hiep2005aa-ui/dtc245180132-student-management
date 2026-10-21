
# He Thong Quan Ly Sinh Vien

## Huong dan trien khai
docker compose up -d --build

## Cong dich vu
- Website: https://localhost/students
- phpMyAdmin: https://localhost/pma/
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

## LogQL mau
1. {container="student-app"}
2. {container="student-app"} |= "ERROR"
3. rate({container="student-app"}[1m])
