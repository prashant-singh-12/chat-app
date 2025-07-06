package com.prashant.teams.repository;

import com.prashant.teams.model.Message;
import com.prashant.teams.model.MessageType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {

    //    FETCH ALL PRIVATE USER MESSAGES INITIAL LOAD
    @Query("{ $and: ["
            + "  { $or: ["
            + "    { $and: [ { fromUserId: ?0 }, { receiverId: ?1 } ] },"
            + "    { $and: [ { fromUserId: ?1 }, { receiverId: ?0 } ] }"
            + "  ] },"
            + "  { type: ?2 }"
            + "] }")
    List<Message> findMessages(String userEmail, String targetId, MessageType type, Pageable pageable);
    //    FETCH PRIVATE MESSAGES BEFORE GIVEN TIMESTAMP
    @Query("{ $and: ["
            + "  { $or: ["
            + "    { $and: [ { fromUserId: ?0 }, { receiverId: ?1 } ] },"
            + "    { $and: [ { fromUserId: ?1 }, { receiverId: ?0 } ] }"
            + "  ] },"
            + "  { type: ?2 },"
            + "  { timestamp: { $lt: ?3 } }"
            + "] }")
    List<Message> findMessagesBefore(String userEmail, String targetId, MessageType type, LocalDateTime before, Pageable pageable);


    //    FETCH GROUP MESSAGES INITIAL LOAD
    @Query("{ 'receiverId': ?0, 'type': ?1 }")
    List<Message> findGroupMessages(String targetId, MessageType type, Pageable pageable);

    // 4. Fetch GROUP messages before a timestamp (for scroll-up)
    @Query("{ 'receiverId': ?0, 'type': ?1, 'timestamp': { $lt: ?2 } }")
    List<Message> findGroupMessagesBefore(String targetId, MessageType type, LocalDateTime before, Pageable pageable);




}










