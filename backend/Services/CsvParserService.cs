using System.Globalization;
using WealthWise.Api.Models.DTOs;

namespace WealthWise.Api.Services
{
    public interface ICsvParserService
    {
        IEnumerable<TransactionCreateDto> ParseTransactions(Stream csvStream);
    }

    public class CsvParserService : ICsvParserService
    {
        public IEnumerable<TransactionCreateDto> ParseTransactions(Stream csvStream)
        {
            var transactions = new List<TransactionCreateDto>();
            using (var reader = new StreamReader(csvStream))
            {
                // Skip header
                reader.ReadLine();

                while (!reader.EndOfStream)
                {
                    var line = reader.ReadLine();
                    if (string.IsNullOrEmpty(line)) continue;

                    var values = line.Split(',');
                    if (values.Length < 4) continue;

                    if (DateTime.TryParse(values[0], out DateTime date) &&
                        decimal.TryParse(values[1], out decimal amount))
                    {
                        transactions.Add(new TransactionCreateDto
                        {
                            Date = date,
                            Amount = amount,
                            Description = values[2],
                            CategoryId = int.Parse(values[3]),
                            AccountId = values.Length > 4 ? int.Parse(values[4]) : 0
                        });
                    }
                }
            }
            return transactions;
        }
    }
}
