using Application.Core;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Followers
{
    public class List
    {
        public class Query: IRequest<Result<List<UserProfile>>>
        {
            public string Predicate { get; set; }
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserProfile>>>
        {
            private readonly DataContext _dbContext;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext dbContext, IMapper mapper, IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _dbContext = dbContext;
                _userAccessor = userAccessor;
            }
            public async Task<Result<List<UserProfile>>> Handle(Query query, CancellationToken cancellationToken)
            {
                var profiles = new List<UserProfile>();

                switch (query.Predicate)
                {
                    case "followers":
                        // list of profiles who follow UserName
                        profiles = await _dbContext.UserFollowings.Where(uf => uf.Target.UserName == query.UserName)
                                        .Select(uf => uf.Observer)
                                        .ProjectTo<UserProfile>(_mapper.ConfigurationProvider, new 
                                        {
                                            currentUserName = _userAccessor.GetUsername()
                                        })
                                        .ToListAsync();
                        break;
                    case "following":
                        // list of profiles who are followed by UserName
                        profiles = await _dbContext.UserFollowings.Where(uf => uf.Observer.UserName == query.UserName)
                                        .Select(uf => uf.Target)
                                        .ProjectTo<UserProfile>(_mapper.ConfigurationProvider, new 
                                        {
                                            currentUserName = _userAccessor.GetUsername()
                                        })
                                        .ToListAsync();
                        break;
                }

                return Result<List<UserProfile>>.Success(profiles);
            }
        }
    }
}