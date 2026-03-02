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
    public class ReportsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ReportsController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet("summary")]
        public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
        {
            var userId = GetUserId();
            var now = DateTime.UtcNow;
            
            var accounts = await _context.Accounts.Where(a => a.UserId == userId).ToListAsync();
            var netWorth = accounts.Sum(a => a.Balance);

            var recentTransactions = await _context.Transactions
                .Include(t => t.Category)
                .Include(t => t.Account)
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.Date)
                .Take(5)
                .ToListAsync();

            var monthlyIncome = await _context.Transactions
                .Where(t => t.UserId == userId && t.Date.Year == now.Year && t.Date.Month == now.Month && t.Amount > 0)
                .SumAsync(t => t.Amount);

            var monthlyExpenses = await _context.Transactions
                .Where(t => t.UserId == userId && t.Date.Year == now.Year && t.Date.Month == now.Month && t.Amount < 0)
                .SumAsync(t => t.Amount);

            return Ok(new DashboardSummaryDto
            {
                NetWorth = netWorth,
                RecentTransactions = _mapper.Map<List<TransactionDto>>(recentTransactions),
                MonthlyIncome = monthlyIncome,
                MonthlyExpenses = Math.Abs(monthlyExpenses)
            });
        }

        [HttpGet("spending-by-category")]
        public async Task<ActionResult> GetSpendingByCategory([FromQuery] int year, [FromQuery] int month)
        {
            var userId = GetUserId();
            var data = await _context.Transactions
                .Include(t => t.Category)
                .Where(t => t.UserId == userId && t.Date.Year == year && t.Date.Month == month && t.Amount < 0)
                .GroupBy(t => t.Category!.Name)
                .Select(g => new { Category = g.Key, Amount = Math.Abs(g.Sum(t => t.Amount)) })
                .ToListAsync();

            return Ok(data);
        }
    }
}
