package com.example.userservicejava;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class UserServiceJavaApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserServiceJavaApplication.class, args);
	}

}
