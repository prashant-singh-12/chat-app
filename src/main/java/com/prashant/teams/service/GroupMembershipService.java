package com.prashant.teams.service;

import com.prashant.teams.model.GroupMembership;
import com.prashant.teams.repository.GroupMembershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class GroupMembershipService {

    @Autowired
    private GroupMembershipRepository groupMembershipRepository;

    public void ensureMembership(String groupId, String userEmail) {
        boolean exists = groupMembershipRepository.existsByGroupIdAndUserEmail(groupId, userEmail);
        if (!exists) {
            GroupMembership membership = new GroupMembership();
            membership.setGroupId(groupId);
            membership.setUserEmail(userEmail);
            membership.setJoinedAt(Instant.now());
            groupMembershipRepository.save(membership);
        }
    }
}

