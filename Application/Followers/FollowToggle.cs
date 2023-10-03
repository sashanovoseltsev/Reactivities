using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command: IRequest<Result<Unit>>
        {   
            // UserName of the user we want to follow by currently logged-in user
            public string TargetUserName { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dbContext;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext dbContext, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _dbContext = dbContext;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());
                if (observer == null) return null;

                var target = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == request.TargetUserName);
                if (target == null) return null;

                var following = await _dbContext.UserFollowings.FindAsync(observer.Id, target.Id);

                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        ObserverId = observer.Id,
                        Target = target,
                        TargetId = target.Id
                    };
                    _dbContext.UserFollowings.Add(following);
                }
                else
                {
                    _dbContext.UserFollowings.Remove(following);
                }

                var success = await _dbContext.SaveChangesAsync() > 0;

                return success
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure($"Failed to update following entry (user '{observer.UserName}' following '{target.UserName}')");
            }
        }
    }
}