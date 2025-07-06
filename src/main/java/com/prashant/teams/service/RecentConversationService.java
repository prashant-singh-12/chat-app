package com.prashant.teams.service;

import com.prashant.teams.model.RecentConversation;
import com.prashant.teams.repository.RecentConversationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RecentConversationService {

    @Autowired
    private RecentConversationRepository repository;

    public void upsertConversation(String userEmail, String targetId, boolean isGroup, String lastMessage) {
        RecentConversation convo = repository
                .findByUserEmailAndTargetId(userEmail, targetId)
                .orElseGet(RecentConversation::new);

        convo.setUserEmail(userEmail);
        convo.setTargetId(targetId);
        convo.setGroup(isGroup);
        convo.setLastMessage(lastMessage);
        convo.setLastUpdated(LocalDateTime.now());

        repository.save(convo);
    }
}
