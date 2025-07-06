package com.prashant.teams.insertData;

import com.prashant.teams.dto.AuthResponse;
import com.prashant.teams.dto.RegisterRequest;
import com.prashant.teams.repository.UserRepository;
import com.prashant.teams.service.AuthService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class UserData implements CommandLineRunner  {




    private final AuthService authService;
    private final UserRepository userRepository;
    public UserData(AuthService authService,UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }


    @Override
    public void run(String... args) throws Exception {
        if(userRepository.count() > 0) { return;}

        System.out.println("I am running to load user data at the start");
        List<RegisterRequest> registerRequests =new ArrayList<>();
        registerRequests.add(new RegisterRequest("bob","bob@gmail.com","bob@123")
        );
        registerRequests.add(new RegisterRequest("john","john@gmail.com","john@123"));
        registerRequests.add(new RegisterRequest("mary","mary@gmail.com","mary@123"));
        registerRequests.add(new RegisterRequest("jane","jane@gmail.com","jane@123"));
        registerRequests.add(new RegisterRequest("charlie","charlie@gmail.com","charlie@123"));

        List<AuthResponse> authResponses = registerRequests.stream().map(authService::register).toList();
        System.out.println("registered users: " + authResponses);

    }

//    @PostConstruct
//    public void init (){
//
//        List<RegisterRequest> registerRequests =new ArrayList<>();
//        registerRequests.add(new RegisterRequest("bob","bob@gmail.com","bob@123")
//        );
//        registerRequests.add(new RegisterRequest("john","john@gmail.com","john@123"));
//        registerRequests.add(new RegisterRequest("mary","mary@gmail.com","mary@123"));
//        registerRequests.add(new RegisterRequest("jane","jane@gmail.com","jane@123"));
//        registerRequests.add(new RegisterRequest("charlie","charlie@gmail.com","charlie@123"));
//
//        List<AuthResponse> authResponses = registerRequests.stream().map(authService::register).toList();
//        System.out.println("registered users: " + authResponses);
//
//    }
}
