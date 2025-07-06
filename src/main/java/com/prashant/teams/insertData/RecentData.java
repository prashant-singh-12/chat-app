package com.prashant.teams.insertData;

import com.prashant.teams.model.RecentConversation;
import com.prashant.teams.repository.RecentConversationRepository;
import com.prashant.teams.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Slf4j
public class RecentData implements CommandLineRunner {
    private final RecentConversationRepository repository;
    private final UserRepository userRepository;

    public RecentData(RecentConversationRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return; // Skip if already populated

        log.info("Again it ran this code");
        List<RecentConversation> dummyData = List.of(
                RecentConversation.builder()
                        .userEmail("prashant@gmail.com")
                        .targetId("bob@gmail.com")
                        .isGroup(false)
                        .lastUpdated(LocalDateTime.now().minusMinutes(10))
                        .build(),

                RecentConversation.builder()
                        .userEmail("parshant@gmail.com")
                        .targetId("charlie@gmail.com")
                        .isGroup(false)
                        .lastUpdated(LocalDateTime.now().minusHours(1))
                        .build(),

                RecentConversation.builder()
                        .userEmail("prashant@gmail.com")
                        .targetId("general")
                        .isGroup(true)
                        .lastUpdated(LocalDateTime.now().minusMinutes(5))
                        .build(),

                RecentConversation.builder()
                        .userEmail("prashant@gmail.com")
                        .targetId("general")
                        .isGroup(true)
                        .lastUpdated(LocalDateTime.now().minusHours(2))
                        .build()
        );

        repository.saveAll(dummyData);
        System.out.println("✅ Dummy recent conversations loaded.");
    }
}
