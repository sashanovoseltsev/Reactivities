using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Result<UserProfile>>
        {
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<UserProfile>>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext dataContext, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _dataContext = dataContext;
                _mapper = mapper;
            }
            public async Task<Result<UserProfile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users
                            .ProjectTo<UserProfile>(_mapper.ConfigurationProvider, new
                            {
                                currentUserName = _userAccessor.GetUsername()
                            })
                            .SingleOrDefaultAsync(u => u.UserName == request.UserName);

                if (user == null) return null;

                return Result<UserProfile>.Success(user);
            }
        }
    }
}