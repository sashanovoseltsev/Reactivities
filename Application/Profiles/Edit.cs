using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Profiles
{
    public class Edit
    {
        public class Command: IRequest<Result<Unit>>
        {
            public UserProfile Profile { get; set; }
        }

        public class CommandValidator: AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(command => command.Profile).SetValidator(new UserProfileValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dbContext;
            private readonly IMapper _mapper;
            private readonly UserManager<AppUser> _userManager;

            public Handler(DataContext dbContext, IMapper mapper, UserManager<AppUser> userManager)
            {
                _userManager = userManager;
                _mapper = mapper;
                _dbContext = dbContext;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                string errorMessage = $"Editing {request.Profile.UserName} profile failed";
                IdentityResult result = null;
                try
                {
                    var user = await _userManager.FindByNameAsync(request.Profile.UserName);

                    if (user == null) return null;

                    user.DisplayName = request.Profile.DisplayName;
                    user.Bio = request.Profile.Bio;

                    result = await _userManager.UpdateAsync(user);
                }
                catch (Exception e)
                {
                    errorMessage = e.ToString();
                }

                return result.Succeeded 
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure(errorMessage);
            }
        }


    }
}