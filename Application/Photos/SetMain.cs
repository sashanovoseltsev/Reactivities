using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext dataContext, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _dataContext = dataContext;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.Include(user => user.Photos)
                                .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);
                if (photo == null) return null;

                var mainPhoto = user.Photos.FirstOrDefault(p => p.IsMain);
                if (mainPhoto != null) mainPhoto.IsMain = false;

                photo.IsMain = true;

                var success = await _dataContext.SaveChangesAsync() > 0;

                return success
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure($"Problem updating photo information in DB for user {user.UserName}.");
            }
        }
    }
}