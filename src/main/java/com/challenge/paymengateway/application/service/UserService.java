package com.challenge.viagensbackend.application.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.challenge.viagensbackend.application.dto.UserCreateDTO;
import com.challenge.viagensbackend.application.dto.UserResponseDTO;
import com.challenge.viagensbackend.application.model.User;
import com.challenge.viagensbackend.application.repository.UserRepository;
import com.challenge.viagensbackend.common.utils.CPFUtils;

import jakarta.transaction.Transactional;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final BCryptPasswordEncoder passwordEncoder;
  
  public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }
  
  @Transactional
  public UserResponseDTO createUser(UserCreateDTO dto) {
    if (userRepository.existsByEmail(dto.getEmail())) {
      throw new IllegalArgumentException("E-mail ja cadastrado");
    }
    if (userRepository.existsByCpf(dto.getCpf())) {
      throw new IllegalArgumentException("CPF ja cadastrado");
    }

    User user = new User();
    user.setName(dto.getName());
    user.setEmail(dto.getEmail());

    String strippedCpf = dto.getCpf().replaceAll("\\D", "");

    if (!CPFUtils.isValidCPF(strippedCpf)) {
        throw new IllegalArgumentException("CPF inválido");
    }

    user.setCpf(strippedCpf);
    user.setPassword(passwordEncoder.encode(dto.getPassword()));

    User savedUser = userRepository.save(user);

    return new UserResponseDTO(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getCpf());
  }

  public List<User> listAll() {
    return userRepository.findAll();
  }
}
