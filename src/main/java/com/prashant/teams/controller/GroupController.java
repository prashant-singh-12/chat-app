package com.prashant.teams.controller;

import com.prashant.teams.dto.GroupDto;
import com.prashant.teams.model.Group;
import com.prashant.teams.model.GroupMembership;
import com.prashant.teams.repository.GroupMembershipRepository;
import com.prashant.teams.repository.GroupRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/groups")
@Slf4j
public class GroupController {

    private GroupRepository groupRepository;
    private GroupMembershipRepository membershipRepository;

    public GroupController(GroupRepository groupRepository, GroupMembershipRepository groupMembershipRepository) {
        this.groupRepository = groupRepository;
        this.membershipRepository = groupMembershipRepository;
    }


    @GetMapping("/general")
    public GroupDto getGeneralGroup() {
        Group group = groupRepository.findByName("general")
                .orElseThrow(() -> new RuntimeException("General group not found"));
        return GroupDto.from(group);
    }


    @GetMapping
    public List<GroupDto> getGroupsForUser(@RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "5") int size) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Pageable pageable= PageRequest.of(page, size);
        log.info("Getting groups call for user with email: " + email);
        Page<GroupMembership> memberships = membershipRepository.findByUserEmail(email, pageable);
        return memberships.stream()
                .map(m -> groupRepository.findById(m.getGroupId()))
                .flatMap(Optional::stream) // handles nulls cleanly
                .map(GroupDto::from)
                .toList();

    }



    @PostMapping("/{groupId}/join")
    public void joinGroup(@PathVariable String groupId, @RequestParam String userId) {
        boolean exists = membershipRepository.existsByUserEmailAndGroupId(userId, groupId);
        if (!exists) {
            membershipRepository.save(GroupMembership.builder().userEmail(userId).groupId(groupId).build());
        }
    }






}
