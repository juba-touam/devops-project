package com.example.userservicejava.services.impl;

import com.example.userservicejava.models.dto.UserRequest;
import com.example.userservicejava.models.dto.UserResponse;
import com.example.userservicejava.models.entity.User;
import com.example.userservicejava.repositories.UserRepository;
import com.example.userservicejava.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    // --- READS ---

    @Override
    @Cacheable(value = "usersById", key = "#p0") // p0 = id
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        return mapToResponse(user);
    }

    @Override
    @Cacheable(value = "usersAll", key = "'all'")
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    // --- WRITES ---

    @Override
    @Caching(evict = {
            @CacheEvict(value = "usersAll", key = "'all'"),
            @CacheEvict(value = "usersById", key = "#result.id", condition = "#result != null")
    })
    public UserResponse createUser(UserRequest dto) {
        if (userRepository.existsByEmail(dto.getEmail())) throw new RuntimeException("Email déjà utilisé");
        if (userRepository.existsByUsername(dto.getUsername())) throw new RuntimeException("Nom d’utilisateur déjà utilisé");

        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .active(true)
                .build();

        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "usersAll", key = "'all'"),
            @CacheEvict(value = "usersById", key = "#p0") // p0 = id
    })
    public UserResponse updateUser(Long id, UserRequest dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());

        User updated = userRepository.save(user);
        return mapToResponse(updated);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "usersAll", key = "'all'"),
            @CacheEvict(value = "usersById", key = "#p0") // p0 = id
    })
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) throw new RuntimeException("Utilisateur introuvable");
        userRepository.deleteById(id);
    }

    // --- Mapper ---

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .active(user.isActive())
                .build();
    }
}
