package com.chess.course.config;

import com.chess.course.entity.Course;
import com.chess.course.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner initData(CourseRepository courseRepository) {
        return args -> {
            if (courseRepository.count() == 0) {
                // Khởi tạo Khóa học mẫu 1
                Course course1 = new Course();
                course1.setTitle("Khai cuộc Ruy Lopez - Cấp độ Cơ bản");
                course1.setDescription("Khóa học chi tiết về khai cuộc Ruy Lopez dành cho người mới bắt đầu. Giúp bạn hiểu rõ cấu trúc tốt và kiểm soát trung tâm.");
                course1.setPrice(new BigDecimal("199000"));
                course1.setThumbnailUrl("https://example.com/ruy-lopez-thumbnail.jpg");
                courseRepository.save(course1);

                // Khởi tạo Khóa học mẫu 2
                Course course2 = new Course();
                course2.setTitle("Chiến thuật Tàn cuộc - GM Lê Quang Liêm");
                course2.setDescription("Khóa học nâng cao về tàn cuộc Vua - Tốt và các kỹ năng phối hợp quân nặng do chính GM Lê Quang Liêm hướng dẫn.");
                course2.setPrice(new BigDecimal("499000"));
                course2.setThumbnailUrl("https://example.com/endgame-thumbnail.jpg");
                courseRepository.save(course2);

                System.out.println("====== [DataSeeder] Đã bơm dữ liệu giả cho bảng Courses ======");
            } else {
                System.out.println("====== [DataSeeder] Dữ liệu Courses đã tồn tại, bỏ qua Data Seeder ======");
            }
        };
    }
}
