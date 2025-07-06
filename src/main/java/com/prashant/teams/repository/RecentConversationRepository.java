package com.prashant.teams.repository;

import com.prashant.teams.model.RecentConversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RecentConversationRepository extends MongoRepository<RecentConversation, String> {
    Page<RecentConversation> findByUserEmailAndIsGroupFalseOrderByLastUpdatedDesc(String userId, Pageable pageable);

    Optional<RecentConversation> findByUserEmailAndTargetId(String userEmail, String targetId);
}
