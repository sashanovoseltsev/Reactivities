using Application.Core;
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

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken token)
            {
                try
                {
                    var activityDto = await _context.Activities
                        .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
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