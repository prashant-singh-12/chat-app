package com.prashant.teams.repository;

import com.prashant.teams.model.GroupMembership;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.PagingAndSortingRepository;


public interface GroupMembershipRepository extends MongoRepository<GroupMembership, String>, PagingAndSortingRepository<GroupMembership, String> {

    Page<GroupMembership> findByUserEmail(String userEmail, Pageable pageable);

    boolean existsByUserEmailAndGroupId(String userEmail, String groupId);

    boolean existsByGroupIdAndUserEmail(String groupId, String userEmail);
}
