using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistance;

namespace Application.Activities
{
    public class Edit
    {
        public class Command: IRequest<Result<Unit>>
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
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                string error = "Failed to edit activity";
                bool isSuccess;
                try
                {
                    var activity = await _context.Activities.FindAsync(request.Activity.Id);

                    if (activity == null)
                        return null;

                    _mapper.Map(request.Activity, activity);
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