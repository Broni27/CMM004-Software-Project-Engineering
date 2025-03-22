using API.DTOs;
using API.models;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Security.Claims;
using System.Text;
using API.Dtos;

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

        [Authorize]
        [HttpDelete("close")] // api/account/close
        public async Task<ActionResult> DeleteUser([FromBody] DeleteAccountDto deleteAccountDto)
        {
            try
            {
                // Retrieve user ID from JWT Token
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized("User not authenticated");
                }

                // Find user by ID
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound($"User with ID {userId} not found.");
                }

                var passwordSalt = new HMACSHA512(user.PasswordSalt);
                var computeHash = passwordSalt.ComputeHash(Encoding.UTF8.GetBytes(deleteAccountDto.Password));

                if (!computeHash.SequenceEqual(user.PasswordHash))
                    return Unauthorized("Invalid password!");

                // Remove user
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return NoContent(); // Successfully deleted
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }

        }

        [Authorize]
        [HttpPut("passwordchange")] //api/account/passwordchange
        public async Task<ActionResult> UpdatePassword([FromBody] UpdatePasswordDto updatePasswordDto)
        {
            // Retrieve user ID from JWT Token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("User not authenticated");
            }

            // Find user by ID
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound($"User with ID {userId} not found.");
            }

            var passwordSalt = new HMACSHA512(user.PasswordSalt);
            var computeHash = passwordSalt.ComputeHash(Encoding.UTF8.GetBytes(updatePasswordDto.Password));

            if (!computeHash.SequenceEqual(user.PasswordHash))
                return Unauthorized("Invalid password!");

            var signingKey = new HMACSHA512();
            user.PasswordHash = signingKey.ComputeHash(Encoding.UTF8.GetBytes(updatePasswordDto.NewPassword));
            user.PasswordSalt = signingKey.Key;
            
            await _context.SaveChangesAsync();
            return NoContent();

        }

        [Authorize]
        [HttpPut("profile/update")] //api/acount/profile/update
        public async Task<ActionResult<UserDto>> UpdateProfile([FromBody] UpdateUserDto updateUserDto)
        {
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

            user.Username = updateUserDto.Username;
            user.Email = updateUserDto.Email;
            user.Realname = updateUserDto.Realname;
            await _context.SaveChangesAsync();

            return NoContent();

        }
    }
}