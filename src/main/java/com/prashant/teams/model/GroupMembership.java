package com.prashant.teams.model;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document("group_memberships")
@CompoundIndexes({@CompoundIndex(name = "user_group_idx",def = "{'userId':1, 'groupId':1}")})
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class GroupMembership {

    @Id
    private String Id;
    private String userEmail;
    private String groupId;
    private Instant joinedAt;

}
