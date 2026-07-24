package com.challenge.viagensbackend.application.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.challenge.viagensbackend.application.dto.LoginRequestDTO;
import com.challenge.viagensbackend.application.dto.LoginResponseDTO;
import com.challenge.viagensbackend.config.security.JwtService;
import com.challenge.viagensbackend.config.security.UserDetailsImpl;
import com.challenge.viagensbackend.config.security.UserDetailsServiceImpl;

@Service
public class AuthService { 
  private final UserDetailsServiceImpl userDetailsService;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(UserDetailsServiceImpl userDetailsService, PasswordEncoder passwordEncoder, JwtService jwtService) {
      this.userDetailsService = userDetailsService;
      this.passwordEncoder = passwordEncoder;
      this.jwtService = jwtService;
  }

  public LoginResponseDTO login(LoginRequestDTO dto) {
    UserDetailsImpl user = userDetailsService.loadUserByUsername(dto.getEmailOrCpf());

    if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
      throw new BadCredentialsException("Credenciais invalidas");
    }

    String token = jwtService.generateToken(user);

    return new LoginResponseDTO(token);
  }
  
}
