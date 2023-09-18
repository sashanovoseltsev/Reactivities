using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Comments
{
    public class List
    {
        public class Query: IRequest<Result<List<CommentDto>>>
        {
            public Guid ActivityId { get; set; }    
        }

        public class Handler : IRequestHandler<Query, Result<List<CommentDto>>>
        {
            private readonly DataContext _dbContext;
            private readonly IMapper _mapper;
            public Handler(DataContext dbContext, IMapper mapper)
            {
                _mapper = mapper;
                _dbContext = dbContext;
            }

            public async Task<Result<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var comments = await _dbContext.Comments
                                    .Where(c => c.Activity.Id == request.ActivityId)
                                    .OrderByDescending(c => c.CreatedAt)
                                    .ProjectTo<CommentDto>(_mapper.ConfigurationProvider)
                                    .ToListAsync();

                return Result<List<CommentDto>>.Success(comments);
            }
        }
    }
}