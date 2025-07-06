package com.prashant.teams.controller;


import com.prashant.teams.dto.GroupDto;
import com.prashant.teams.dto.UserDto;
import com.prashant.teams.model.RecentConversation;
import com.prashant.teams.repository.RecentConversationRepository;
import com.prashant.teams.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/recent")
@Slf4j
public class RecentConversationController {

    private final RecentConversationRepository recentRepo;
    private final UserRepository userRepository;

    public RecentConversationController(RecentConversationRepository recentRepo, UserRepository userRepository) {
        this.recentRepo = recentRepo;
        this.userRepository = userRepository;
    }


    @GetMapping("/users")
    public List<UserDto> getRecentUserChats(@RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "3") int size){
        log.info("Get recent user chats api called now ");
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        Page<RecentConversation> recents = recentRepo.findByUserEmailAndIsGroupFalseOrderByLastUpdatedDesc(currentEmail, PageRequest.of(page, size));

        return recents.stream()
                .map(rc->userRepository.findByEmail(rc.getTargetId()))
                .flatMap(Optional::stream)
                .map(UserDto::from)
                .toList();


    }



}
