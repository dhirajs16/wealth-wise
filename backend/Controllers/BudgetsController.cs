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
    public class BudgetsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public BudgetsController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BudgetDto>>> GetBudgets([FromQuery] int year, [FromQuery] int month)
        {
            var userId = GetUserId();
            var budgets = await _context.Budgets
                .Include(b => b.Category)
                .Where(b => b.UserId == userId && b.Year == year && b.Month == month)
                .ToListAsync();

            var result = new List<BudgetDto>();

            foreach (var budget in budgets)
            {
                var spent = await _context.Transactions
                    .Where(t => t.UserId == userId && 
                                t.CategoryId == budget.CategoryId && 
                                t.Date.Year == year && 
                                t.Date.Month == month && 
                                t.Amount < 0)
                    .SumAsync(t => t.Amount);

                var dto = _mapper.Map<BudgetDto>(budget);
                dto.Spent = Math.Abs(spent);
                result.Add(dto);
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<BudgetDto>> UpsertBudget(BudgetDto request)
        {
            var userId = GetUserId();
            var budget = await _context.Budgets
                .FirstOrDefaultAsync(b => b.UserId == userId && 
                                          b.CategoryId == request.CategoryId && 
                                          b.Year == request.Year && 
                                          b.Month == request.Month);

            if (budget == null)
            {
                budget = new Budget
                {
                    UserId = userId,
                    CategoryId = request.CategoryId,
                    Year = request.Year,
                    Month = request.Month,
                    Amount = request.Amount
                };
                _context.Budgets.Add(budget);
            }
            else
            {
                budget.Amount = request.Amount;
            }

            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<BudgetDto>(budget));
        }
    }
}
