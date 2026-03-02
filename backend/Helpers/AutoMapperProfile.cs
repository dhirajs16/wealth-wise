using AutoMapper;
using WealthWise.Api.Models.DTOs;
using WealthWise.Api.Models.Entities;

namespace WealthWise.Api.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Account, AccountDto>();
            CreateMap<AccountCreateDto, Account>();

            CreateMap<Transaction, TransactionDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : ""))
                .ForMember(dest => dest.AccountName, opt => opt.MapFrom(src => src.Account != null ? src.Account.Name : ""));
            CreateMap<TransactionCreateDto, Transaction>();

            CreateMap<Category, CategoryDto>();

            CreateMap<Budget, BudgetDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : ""));

            CreateMap<Goal, GoalDto>();
        }
    }
}
