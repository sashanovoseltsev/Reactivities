using Application.Core;
using MediatR;
using Persistance;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                string error = "Failed to delete activity";
                bool isSuccess;
                try
                {
                    var activityToRemove = await _context.Activities.FindAsync(request.Id);

                    if (activityToRemove == null)
                        return null;

                    _context.Activities.Remove(activityToRemove);
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