CREATE DATABASE IF NOT EXISTS student_db;
USE student_db;

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_code VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    score DECIMAL(4, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO students (student_code, full_name, class_name, score) VALUES
('SV001', 'Nguyen Van An', 'CNTT01', 8.5),
('SV002', 'Tran Thi Bich', 'CNTT01', 9.0),
('SV003', 'Le Van Cuong', 'CNTT02', 7.2);
