package com.prashant.teams.repository;

import com.prashant.teams.model.Group;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface GroupRepository extends MongoRepository<Group, String> {
    Optional<Group> findByName(String groupName);

    Optional<Group> findByNameIgnoreCase(String general);
}
