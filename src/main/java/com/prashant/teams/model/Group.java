package com.prashant.teams.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "groups")
@Getter
@Setter
public class Group {
    @Id
    private String id;
    private String name;
    private String description;

    // getters and setters
}
