package com.prashant.teams.repository;

import com.prashant.teams.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    User findByUsername(String username);
    boolean existsByEmailIgnoreCase(String email);
    Optional<User> findByEmail(String email);
}
