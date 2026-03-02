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
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public TransactionsController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactions(
            [FromQuery] DateTime? startDate, 
            [FromQuery] DateTime? endDate, 
            [FromQuery] int? categoryId, 
            [FromQuery] int? accountId,
            [FromQuery] string? search)
        {
            var userId = GetUserId();
            var query = _context.Transactions
                .Include(t => t.Category)
                .Include(t => t.Account)
                .Where(t => t.UserId == userId);

            if (startDate.HasValue) query = query.Where(t => t.Date >= startDate.Value);
            if (endDate.HasValue) query = query.Where(t => t.Date <= endDate.Value);
            if (categoryId.HasValue) query = query.Where(t => t.CategoryId == categoryId.Value);
            if (accountId.HasValue) query = query.Where(t => t.AccountId == accountId.Value);
            if (!string.IsNullOrEmpty(search)) query = query.Where(t => t.Description.Contains(search));

            var transactions = await query.OrderByDescending(t => t.Date).ToListAsync();
            return Ok(_mapper.Map<IEnumerable<TransactionDto>>(transactions));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TransactionDto>> GetTransaction(int id)
        {
            var userId = GetUserId();
            var transaction = await _context.Transactions
                .Include(t => t.Category)
                .Include(t => t.Account)
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (transaction == null) return NotFound();

            return Ok(_mapper.Map<TransactionDto>(transaction));
        }

        [HttpPost]
        public async Task<ActionResult<TransactionDto>> CreateTransaction(TransactionCreateDto request)
        {
            var userId = GetUserId();
            
            // Validate account
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == request.AccountId && a.UserId == userId);
            if (account == null) return BadRequest("Invalid account.");

            var transaction = _mapper.Map<Transaction>(request);
            transaction.UserId = userId;

            // Update account balance
            account.Balance += transaction.Amount;

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id }, _mapper.Map<TransactionDto>(transaction));
        }

        private readonly ICsvParserService _csvParserService;

        public TransactionsController(AppDbContext context, IMapper mapper, ICsvParserService csvParserService)
        {
            _context = context;
            _mapper = mapper;
            _csvParserService = csvParserService;
        }

        [HttpPost("import")]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> ImportTransactions(IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest("Please upload a CSV file.");

            var userId = GetUserId();
            var parsedTransactions = _csvParserService.ParseTransactions(file.OpenReadStream());
            var savedTransactions = new List<Transaction>();

            foreach (var dto in parsedTransactions)
            {
                var transaction = _mapper.Map<Transaction>(dto);
                transaction.UserId = userId;
                
                var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == dto.AccountId && a.UserId == userId);
                if (account != null)
                {
                    account.Balance += transaction.Amount;
                    _context.Transactions.Add(transaction);
                    savedTransactions.Add(transaction);
                }
            }

            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<IEnumerable<TransactionDto>>(savedTransactions));
        }
    }
}
