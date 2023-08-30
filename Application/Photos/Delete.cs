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
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Hanlder : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            public Hanlder(DataContext dataContext, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
                _dataContext = dataContext;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users
                    .Include(user => user.Photos)
                    .FirstOrDefaultAsync(user => user.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);

                if (photo == null) return null;

                if (photo.IsMain) 
                    return Result<Unit>.Failure("Cannot delete main photo");

                var deletionResult = _photoAccessor.DeletePhoto(request.Id);

                if (deletionResult == null) 
                    return Result<Unit>.Failure("Problem deleting photo from cloud storage");

                user.Photos.Remove(photo);

                var success = await _dataContext.SaveChangesAsync() > 0;

                return success
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure($"Problem updating photo information in DB for user {user.UserName}.");
            }
        }
    }
}