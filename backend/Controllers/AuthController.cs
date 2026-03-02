using Microsoft.AspNetCore.Mvc;
using WealthWise.Api.Models.DTOs;
using WealthWise.Api.Services;

namespace WealthWise.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(UserRegisterDto request)
        {
            var result = await _authService.Register(request);
            if (result == null)
                return BadRequest("User already exists or registration failed.");

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(UserLoginDto request)
        {
            var result = await _authService.Login(request);
            if (result == null)
                return Unauthorized("Invalid credentials.");

            return Ok(result);
        }

        [HttpPost("forgot-password")]
        public ActionResult ForgotPassword([FromBody] string email)
        {
            // Simulated forgot password
            return Ok(new { message = "If an account exists for this email, a reset link has been sent." });
        }
    }
}
