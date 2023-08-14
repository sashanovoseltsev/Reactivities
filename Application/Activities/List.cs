using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<Activity>>> {}

        public class Handler : IRequestHandler<Query, Result<List<Activity>>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
                
            }
            public async Task<Result<List<Activity>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    var activities = await _context.Activities.ToListAsync();
                    return Result<List<Activity>>.Success(activities);
                }
                catch (Exception e)
                {
                    return Result<List<Activity>>.Failure(e.ToString());
                }

            }
        }
    }
}