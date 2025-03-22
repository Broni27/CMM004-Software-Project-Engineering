using System;

namespace API.Dtos;

public class UpdatePasswordDto
{
    public required string Password { get; set; }
    public required string NewPassword { get; set; }
}
