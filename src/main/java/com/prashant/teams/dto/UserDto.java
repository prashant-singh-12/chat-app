package com.prashant.teams.dto;

import com.prashant.teams.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDto {

    private String email;
    private String userName;


    public static UserDto from(User user) {
        return new UserDto(user.getEmail(), user.getUsername());
    }

}
