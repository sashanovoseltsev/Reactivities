using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                string error = "Failed to create activity";
                bool isSuccess;
                try
                {
                    var user = await _context.Users.FirstOrDefaultAsync(x => 
                        x.UserName == _userAccessor.GetUsername());

                    var attendee = new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = request.Activity,
                        IsHost = true
                    };

                    request.Activity.Attendees.Add(attendee);

                    _context.Activities.Add(request.Activity);
                    isSuccess = await _context.SaveChangesAsync() > 0;
                }
                catch (Exception e)
                {
                    isSuccess = false;
                    error = e.ToString();
                }

                if (!isSuccess)
                    return Result<Unit>.Failure(error);
                else
                    // Eq. to return nothing. It's a common way for MediatR lib to finish command execution.
                    return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}