using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WealthWise.Api.Data;
using WealthWise.Api.Models.Entities;

namespace WealthWise.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ContactController> _logger;

        public ContactController(AppDbContext context, ILogger<ContactController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitMessage(ContactMessage message)
        {
            message.SentAt = DateTime.UtcNow;
            _context.ContactMessages.Add(message);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Contact message received from {Email}: {Subject}", message.Email, message.Subject);
            
            // Simulate email sending
            return Ok(new { message = "Your message has been sent successfully." });
        }
    }
}
