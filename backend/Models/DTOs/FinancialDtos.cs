namespace WealthWise.Api.Models.DTOs
{
    public class AccountDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal Balance { get; set; }
    }

    public class AccountCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal InitialBalance { get; set; }
    }

    public class TransactionDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int AccountId { get; set; }
        public string AccountName { get; set; } = string.Empty;
        public bool IsRecurring { get; set; }
    }

    public class TransactionCreateDto
    {
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public int AccountId { get; set; }
        public bool IsRecurring { get; set; }
        public string? RecurringFrequency { get; set; }
    }

    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Icon { get; set; }
    }

    public class BudgetDto
    {
        public int Id { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal Amount { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public decimal Spent { get; set; }
    }

    public class GoalDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal TargetAmount { get; set; }
        public decimal CurrentAmount { get; set; }
        public DateTime Deadline { get; set; }
        public decimal Progress => TargetAmount > 0 ? (CurrentAmount / TargetAmount) * 100 : 0;
    }

    public class DashboardSummaryDto
    {
        public decimal NetWorth { get; set; }
        public List<TransactionDto> RecentTransactions { get; set; } = new();
        public List<BudgetDto> TopBudgets { get; set; } = new();
        public decimal MonthlyIncome { get; set; }
        public decimal MonthlyExpenses { get; set; }
    }
}
