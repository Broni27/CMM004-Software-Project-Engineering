using API.Data;
using API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserRepository _userRepository;
        public UserController(UserRepository userRepository) {
            _userRepository = userRepository;
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserViewDto>>> GetUsers() // /api/user
        {
            var users = await _userRepository.GetUsersAsync();
            return Ok(users);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")] // /api/user/24
        public async Task<ActionResult> DeleteUser(int id)
        {
            var success = await _userRepository.DeleteUserAsync(id);
            if (!success)
            {
                return NotFound($"User with ID {id} not found.");

            }
            return NoContent();
        }

    }
}
