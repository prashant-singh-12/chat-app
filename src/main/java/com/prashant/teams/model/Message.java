package com.prashant.teams.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

//creating index for efficient search --> index on user target type timestamp
@Data
@Document(collection = "messages")
@CompoundIndexes({
        @CompoundIndex(name = "user_target_type_ts_idx", def = "{'fromUserId': 1, 'receiverId': 1, 'type': 1, 'timestamp': -1}")
})

public class Message {
    @Id
    private String id;
    private String fromUserId;
    private String receiverId;    // for private messages or group depending on type
    private String content;
    private MessageType type;
    private LocalDateTime timestamp;
}
