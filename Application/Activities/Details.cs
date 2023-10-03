using Application.Core;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Activities
{
    public class Details
    {
        public class Query: IRequest<Result<ActivityDto>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<ActivityDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken token)
            {
                try
                {
                    var activityDto = await _context.Activities
                        .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new {
                            currentUserName = _userAccessor.GetUsername()
                        })
                        .FirstOrDefaultAsync(x => x.Id == request.Id);
                    return Result<ActivityDto>.Success(activityDto);
                }
                catch (Exception e)
                {
                    return Result<ActivityDto>.Failure(e.ToString());
                }
            }
        }
    }
}