package com.prashant.teams.dto;


import com.prashant.teams.model.Group;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupDto {
    private String id;
    private String name;

    public static GroupDto from(Group group) {
        GroupDto dto = new GroupDto();
        dto.id=group.getId();
        dto.name=group.getName();
        return dto;
    }

}
