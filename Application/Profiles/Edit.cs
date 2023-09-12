using Application.Core;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Profiles
{
    public class Edit
    {
        public class Command: IRequest<Result<Unit>>
        {
            public string UserName { get; set; }
            public string DisplayName { get; set; }
            public string Bio { get; set; }
        }

        public class CommandValidator: AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(command => command.DisplayName).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dbContext;

            public Handler(DataContext dbContext)
            {
                _dbContext = dbContext;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                string errorMessage = $"Editing {request.UserName} profile failed";
                bool isSuccess = false;
                try
                {
                    var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.UserName == request.UserName);

                    if (user == null) return null;

                    user.DisplayName = request.DisplayName;
                    user.Bio = request.Bio;

                    isSuccess = await _dbContext.SaveChangesAsync() > 0;
                }
                catch (Exception e)
                {
                    errorMessage = e.ToString();
                }

                return isSuccess 
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure(errorMessage);
            }
        }


    }
}