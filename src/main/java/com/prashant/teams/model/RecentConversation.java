package com.prashant.teams.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "recent_conversations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@CompoundIndexes({
        @CompoundIndex(name = "user_target_idx", def = "{'userId': 1, 'targetId': 1}")
})

public class RecentConversation {

    private String id;

    private String userEmail;
    private String targetId;
    private boolean isGroup;
    private String lastMessage;
    private LocalDateTime lastUpdated;


}
