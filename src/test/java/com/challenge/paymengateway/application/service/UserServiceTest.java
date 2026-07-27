package com.challenge.viagensbackend.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.challenge.viagensbackend.application.dto.UserCreateDTO;
import com.challenge.viagensbackend.application.dto.UserResponseDTO;
import com.challenge.viagensbackend.application.model.User;
import com.challenge.viagensbackend.application.repository.UserRepository;


class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    private UserService userService;

    private UserCreateDTO validDto;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        userService = new UserService(userRepository, passwordEncoder);
        validDto = new UserCreateDTO("Jo�o Silva", "joao@email.com", "123.456.789-09", "senha123");
    }

    @Test
    void shouldCreateUserSuccessfully() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByCpf(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        User savedUser = new User();
        savedUser.setId(1);
        savedUser.setName(validDto.getName());
        savedUser.setEmail(validDto.getEmail());
        savedUser.setCpf(validDto.getCpf());
        savedUser.setPassword("encodedPassword");

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserResponseDTO result = userService.createUser(validDto);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Jo�o Silva", result.getName());
        assertEquals("joao@email.com", result.getEmail());

        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        Exception ex = assertThrows(IllegalArgumentException.class, () -> userService.createUser(validDto));
        assertTrue(ex.getMessage().contains("E-mail"));
        assertTrue(ex.getMessage().contains("cadastrado"));
    }

    @Test
    void shouldThrowExceptionWhenCpfAlreadyExists() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByCpf(anyString())).thenReturn(true);

        Exception ex = assertThrows(IllegalArgumentException.class, () -> userService.createUser(validDto));
        assertTrue(ex.getMessage().contains("CPF"));
        assertTrue(ex.getMessage().contains("cadastrado"));
    }

    @Test
    void shouldThrowExceptionWhenCpfIsInvalid() {
        UserCreateDTO invalidCpfDto = new UserCreateDTO("Maria", "maria@email.com", "111.111.111-11", "1234");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByCpf(anyString())).thenReturn(false);

        Exception ex = assertThrows(IllegalArgumentException.class, () -> userService.createUser(invalidCpfDto));
        assertTrue(ex.getMessage().contains("CPF"));
        assertTrue(ex.getMessage().toLowerCase().contains("inv"));
    }
}
