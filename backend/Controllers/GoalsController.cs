using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System.Security.Claims;
using WealthWise.Api.Data;
using WealthWise.Api.Models.DTOs;
using WealthWise.Api.Models.Entities;

namespace WealthWise.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GoalsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public GoalsController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GoalDto>>> GetGoals()
        {
            var userId = GetUserId();
            var goals = await _context.Goals
                .Where(g => g.UserId == userId)
                .ToListAsync();
            return Ok(_mapper.Map<IEnumerable<GoalDto>>(goals));
        }

        [HttpPost]
        public async Task<ActionResult<GoalDto>> CreateGoal(GoalDto request)
        {
            var userId = GetUserId();
            var goal = _mapper.Map<Goal>(request);
            goal.UserId = userId;

            _context.Goals.Add(goal);
            await _context.SaveChangesAsync();

            return Ok(_mapper.Map<GoalDto>(goal));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<GoalDto>> UpdateGoal(int id, GoalDto request)
        {
            var userId = GetUserId();
            var goal = await _context.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);
            if (goal == null) return NotFound();

            goal.Name = request.Name;
            goal.TargetAmount = request.TargetAmount;
            goal.CurrentAmount = request.CurrentAmount;
            goal.Deadline = request.Deadline;

            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<GoalDto>(goal));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGoal(int id)
        {
            var userId = GetUserId();
            var goal = await _context.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);
            if (goal == null) return NotFound();

            _context.Goals.Remove(goal);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
