using System;
using API.Dtos;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UserRepository
{
    private readonly DataContext _context;
    public UserRepository(DataContext context) {
        _context = context;
    }

    public async Task<List<UserViewDto>> GetUsersAsync() {
        var users = await _context.Users
        .Select(x => new UserViewDto {
            Email = x.Email,
            Username = x.Username,
            Realname = x.Realname,
            Id = x.Id
        })
        .ToListAsync();
    return users;
    }

    public async Task<bool> DeleteUserAsync(int userId) {
        var user = await _context.Users
        .FirstOrDefaultAsync(x => x.Id == userId);

        if (user == null) return false;
        _context.Users.Remove(user);

        await _context.SaveChangesAsync();
        return true;
    }

}
