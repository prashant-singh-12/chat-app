package com.prashant.teams.insertData;

import com.prashant.teams.model.Group;
import com.prashant.teams.model.GroupMembership;
import com.prashant.teams.repository.GroupMembershipRepository;
import com.prashant.teams.repository.GroupRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GroupData implements CommandLineRunner {

    private final GroupRepository groupRepository;
    private final GroupMembershipRepository groupMembershipRepository;


    public GroupData(GroupRepository groupRepository, GroupMembershipRepository groupMembershipRepository) {
        this.groupRepository = groupRepository;
        this.groupMembershipRepository = groupMembershipRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        if (groupRepository.count()>0)return;

        Group teamBeta = new Group();
        teamBeta.setName("teamBeta");
        teamBeta.setDescription("TeamBeta  discussion group");
        groupRepository.save(teamBeta);

        Group devsGuns = new Group();
        devsGuns.setName("devsGuns");
        devsGuns.setDescription("Developer chat group");
        groupRepository.save(devsGuns);

        Group kalia = new Group();
        kalia.setName("kalia");
        kalia.setDescription("kalia private group");
        groupRepository.save(kalia);

        // Insert memberships (replace emails with your actual dummy user IDs/emails)
        List<GroupMembership> memberships = List.of(
                GroupMembership.builder().userEmail("prashant@gmail.com").groupId(teamBeta.getId()).build(),
//                GroupMembership.builder().userId("alice@example.com").groupId(general.getId()).build(),
//                GroupMembership.builder().userId("bob@example.com").groupId(general.getId()).build(),

                GroupMembership.builder().userEmail("prashant@gmail.com").groupId(devsGuns.getId()).build(),
//                GroupMembership.builder().userId("charlie@example.com").groupId(devs.getId()).build(),

//                GroupMembership.builder().userId("bob@example.com").groupId(teamAlpha.getId()).build(),
                GroupMembership.builder().userEmail("prashant@gmail.com").groupId(kalia.getId()).build()
        );

        groupMembershipRepository.saveAll(memberships);

        System.out.println("✅ Inserted dummy groups and group memberships.");





    }
}
