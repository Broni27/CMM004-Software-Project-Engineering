using API.DTOs;
using API.models;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Security.Claims;
using System.Text;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly TokenService _tokenService;
        public AccountController(DataContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("login")] //api/account/login
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            //Check if email or password are missing
            if (string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
            {
                return BadRequest("Email and password are required.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email.ToLower() == loginDto.Email.ToLower());

            if (user == null)
                return Unauthorized("Invalid email or password");

            var passwordSalt = new HMACSHA512(user.PasswordSalt);
            var computeHash = passwordSalt.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            if (!computeHash.SequenceEqual(user.PasswordHash))
                return Unauthorized("Invalid email or password");

            return new UserDto
            {
                Username = user.Username,
                Email = user.Email,
                Realname = user.Realname,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("register")] //api/account/register
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            //Check if any required fields are missing
            if (string.IsNullOrWhiteSpace(registerDto.Username) ||
                string.IsNullOrWhiteSpace(registerDto.Email) ||
                string.IsNullOrWhiteSpace(registerDto.Password) ||
                string.IsNullOrWhiteSpace(registerDto.Realname))
            {
                return BadRequest(new { message = "All fields are required." });
            }

            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == registerDto.Email.ToLower()))
                return BadRequest(new { message = "This email is already registered." });

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

            return new UserDto
            {
                Username = newUser.Username,
                Email = newUser.Email,
                Realname = newUser.Realname,
                Token = _tokenService.CreateToken(newUser)
            };
        }

        // User profile endpoint, allows retrieval of user details on Profile page
        [HttpGet("profile")] //api/acount/profile
        [Authorize]
        public async Task<ActionResult<UserDto>> GetProfile()
        {
            //Retrieve token from the Authorization header
            var token = Request.Headers["Authorization"].ToString();

            //Logs token for debugging
            Console.WriteLine($"Received Token: {token}");

            //Retrieve user from JWT Token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated");
            }

            //Finds user by ID
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id.ToString() == userId);

            if (user == null)
            {
                return Unauthorized("User not found");
            }

            //Returns user profile data
            return new UserDto
            {
                Username = user.Username,
                Realname = user.Realname,
                Email = user.Email,
                Token = _tokenService.CreateToken(user)
            };
        }
    }
}