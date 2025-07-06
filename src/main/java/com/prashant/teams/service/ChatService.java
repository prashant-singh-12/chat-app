package com.prashant.teams.service;

import com.prashant.teams.model.Message;
import com.prashant.teams.model.MessageType;
import com.prashant.teams.repository.MessageRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;


@Service
@Slf4j
public class ChatService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private GroupMembershipService groupMembershipService;

    @Autowired
    private RecentConversationService recentConversationService;

    public Message saveMessage(Message message) {
        // Save the message to MongoDB
        Message saved = messageRepository.save(message);

        if (message.getType() == MessageType.GROUP) {
            // Ensure sender is a member of the group
            groupMembershipService.ensureMembership(message.getReceiverId(), message.getFromUserId());

            // Update recent conversation for sender
            recentConversationService.upsertConversation(message.getFromUserId(), message.getReceiverId(),true, saved.getContent());
        } else if (message.getType() == MessageType.PRIVATE) {
            // Update recent conversation for both sender and receiver
            recentConversationService.upsertConversation(message.getFromUserId(), message.getReceiverId(), false, saved.getContent());
            recentConversationService.upsertConversation(message.getReceiverId(), message.getFromUserId(), false, saved.getContent());
        }

        return saved;
    }



    public List<Message> getRecentMessages(String userEmail, String targetId, MessageType type, int size) {
        Pageable pageable = PageRequest.of(0, size, Sort.by(Sort.Direction.DESC, "timestamp"));

        List<Message> messages;

        if (type == MessageType.GROUP) {
            // Fetch group messages sent to this groupId
            log.info("Getting recent messages from {} group", userEmail);
            messages = messageRepository.findGroupMessages(targetId,type, pageable);
        } else {
            // Fetch private messages between userEmail and targetId
            log.info("Getting recent messages from {} user", userEmail);
            messages = messageRepository.findMessages(userEmail, targetId, type, pageable);
        }


        return messages;
    }



    public List<Message> getMessagesBefore(String userEmail, String targetId, MessageType type, LocalDateTime before, int size) {
        Pageable pageable = PageRequest.of(0, size, Sort.by(Sort.Direction.DESC, "timestamp"));

        if (type == MessageType.GROUP) {
            return messageRepository.findGroupMessagesBefore(
                    targetId, type, before, pageable
            );
        } else {
            return messageRepository.findMessagesBefore(
                    userEmail, targetId,type, before, pageable
            );
        }
    }

}

