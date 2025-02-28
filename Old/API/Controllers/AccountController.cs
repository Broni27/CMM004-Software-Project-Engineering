using API.DTOs;
using API.models;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly TokenService _tokenService;
        public AccountController(DataContext context, TokenService tokenService) {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("login")] //api/account/login
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto) {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email.ToLower() == loginDto.Email.ToLower());

            if (user == null) 
                return Unauthorized("Invalid email or password");
            var passwordSalt = new HMACSHA512(user.PasswordSalt);
            var computeHash = passwordSalt.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            if (!computeHash.SequenceEqual(user.PasswordHash))
                return Unauthorized("Invalid email or password");

            return new UserDto {
                Username = user.Username,
                Email = user.Email,
                Token = _tokenService.CreateToken(user)
            };

        }

        [HttpPost("register")] //api/account/register
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto) {
            if (await _context.Users.AnyAsync(u => u.Username.ToLower()==registerDto.Username.ToLower()))
                return BadRequest("This username is used!");
            if (await _context.Users.AnyAsync(u => u.Email.ToLower()==registerDto.Email.ToLower()))
                return BadRequest("This email is used!");
            var signingKey = new HMACSHA512();
            User newUser = new User
            {
                Username = registerDto.Username.ToLower(),
                Email = registerDto.Email,
                Realname = registerDto.Realname,
                Role = Role.USER,
                PasswordHash = signingKey.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = signingKey.Key
            };
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            return new UserDto {
                Username = newUser.Username,
                Email = newUser.Email,
                Token = _tokenService.CreateToken(newUser)
            };
        }
    }
}
