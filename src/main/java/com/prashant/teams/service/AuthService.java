package com.prashant.teams.service;

import com.prashant.teams.dto.AuthResponse;
import com.prashant.teams.dto.LoginRequest;
import com.prashant.teams.dto.RegisterRequest;
import com.prashant.teams.model.GroupMembership;
import com.prashant.teams.model.User;
import com.prashant.teams.repository.GroupMembershipRepository;
import com.prashant.teams.repository.GroupRepository;
import com.prashant.teams.repository.UserRepository;
import com.prashant.teams.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final GroupRepository groupRepository;
    private final GroupMembershipRepository groupMembershipRepository;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmailIgnoreCase(request.getEmail())){
            throw new RuntimeException("Email already in use");
        }
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        User saved = userRepository.save(user);
//        System.out.println(user.getUsername());
        log.info("Registering user: {}", saved);

        groupRepository.findByNameIgnoreCase("general").ifPresent( generalGroup->{
            boolean alreadyMember= groupMembershipRepository.existsByGroupIdAndUserEmail(generalGroup.getId(), saved.getEmail());
            if(!alreadyMember){
                GroupMembership membership=new GroupMembership();
                membership.setGroupId(generalGroup.getId());
                membership.setUserEmail(saved.getEmail());
                membership.setJoinedAt(Instant.now());
                groupMembershipRepository.save(membership);
                log.info("User {} joined group {}", saved.getUsername(), generalGroup.getName());
            }
        });

        String token = jwtUtil.generateToken(user.getEmail(),user.getUsername());
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println(user);
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        return new AuthResponse(jwtUtil.generateToken(user.getEmail(), user.getUsername()));
    }
}
