using System;

namespace API.Dtos;

public class UpdateUserDto
{
    public required string Username { get; set;}
    public required string Email { get; set; }
    public required string Realname {get ; set;}
}
