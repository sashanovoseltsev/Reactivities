using Application.Core;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> {}

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }
            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    var activities = await _context.Activities
                        // .Select(a => new ActivityDto
                        // {
                        //     Id = a.Id,
                        //     Title = a.Title,
                        //     Category = a.Category,
                        //     Date = a.Date,
                        //     Description = a.Description,
                        //     City = a.City,
                        //     Venue = a.Venue,
                        //     Attendees = a.Attendees.Select(at => new Profiles.Profile
                        //     {
                        //         UserName = at.AppUser.UserName,
                        //         Bio = at.AppUser.Bio,
                        //         DisplayName = at.AppUser.DisplayName
                        //     }).ToList()
                        // })
                        // or simply
                        .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                        .ToListAsync();

                    return Result<List<ActivityDto>>.Success(activities);
                }
                catch (Exception e)
                {
                    return Result<List<ActivityDto>>.Failure(e.ToString());
                }

            }
        }
    }
}