package com.chess.user.config;

import com.chess.user.entity.Role;
import com.chess.user.entity.User;
import com.chess.user.repository.RoleRepository;
import com.chess.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Set;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                // Khởi tạo Roles
                Role adminRole = new Role("ROLE_ADMIN");
                Role userRole = new Role("ROLE_USER");
                roleRepository.save(adminRole);
                roleRepository.save(userRole);

                // Khởi tạo Admin
                User admin = new User();
                admin.setUsername("admin");
                admin.setFullName("Lê Quang Liêm");
                admin.setEmail("admin@vantage.com");
                admin.setPasswordHash("hashed_admin_password_mock");
                admin.setEloRating(2458);
                admin.setRoles(Set.of(adminRole, userRole));
                userRepository.save(admin);

                // Khởi tạo một số User mẫu
                User player1 = new User();
                player1.setUsername("gm_hikaru");
                player1.setFullName("Hikaru Nakamura");
                player1.setEmail("hikaru@vantage.com");
                player1.setPasswordHash("hashed_password_mock");
                player1.setEloRating(2840);
                player1.setRoles(Set.of(userRole));
                userRepository.save(player1);

                User player2 = new User();
                player2.setUsername("magnus_c");
                player2.setFullName("Magnus Carlsen");
                player2.setEmail("magnus@vantage.com");
                player2.setPasswordHash("hashed_password_mock");
                player2.setEloRating(2882);
                player2.setRoles(Set.of(userRole));
                userRepository.save(player2);

                System.out.println("====== [DataSeeder] Đã bơm dữ liệu giả cho bảng Users & Roles ======");
            } else {
                System.out.println("====== [DataSeeder] Dữ liệu Users đã tồn tại, bỏ qua Data Seeder ======");
            }
        };
    }
}
