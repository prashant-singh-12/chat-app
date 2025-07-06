package com.prashant.teams.controller;

import com.prashant.teams.model.Message;
import com.prashant.teams.model.MessageType;
import com.prashant.teams.service.ChatService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@Slf4j
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    @GetMapping
    public ResponseEntity<List<Message>> getMessages(@RequestParam String targetId,
                                                     @RequestParam boolean isGroup,
                                                     @RequestParam(required = false)
                                                     @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
                                                         LocalDateTime before,
                                                     @RequestParam(defaultValue = "10") int size,
                                                     Principal principal) {
        String userEmail = principal.getName();
        MessageType type = isGroup ? MessageType.GROUP : MessageType.PRIVATE;
        System.out.println("Fetching messages before: " + before);

        List<Message> messages;
        if (before != null) {
            messages = chatService.getMessagesBefore(userEmail, targetId, type, before, size);
        } else {
            log.info("before is null and there is call for private intial load");
            messages = chatService.getRecentMessages(userEmail, targetId, type, size);
        }

        return ResponseEntity.ok(messages);
    }







    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload Message message, Principal principal) {
        message.setFromUserId(principal.getName());


        if (message.getTimestamp() == null) {
            message.setTimestamp(LocalDateTime.now());
        }

        Message saved = chatService.saveMessage(message);

        System.out.println(message);

        if (message.getType() == MessageType.GROUP) {
            messagingTemplate.convertAndSend("/topic/group/" + message.getReceiverId(), saved);
        } else if (message.getType() == MessageType.PRIVATE) {
            messagingTemplate.convertAndSendToUser(

                    message.getReceiverId(), "/queue/messages", saved
            );

            if (!message.getReceiverId().equals(principal.getName())) {
                System.out.println("I echoing back to the user ");
                messagingTemplate.convertAndSendToUser(
                        principal.getName(), "/queue/messages", saved
                );
            }


        }
    }
}
