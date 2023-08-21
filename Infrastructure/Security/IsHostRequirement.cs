using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {
    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _accessor;

        public IsHostRequirementHandler(DataContext dbContext, IHttpContextAccessor accessor)
        {
            _accessor = accessor;
            _dbContext = dbContext;
        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return Task.CompletedTask;

            var activityId = Guid.Parse(_accessor.HttpContext?.Request.RouteValues
                                .SingleOrDefault(x => x.Key == "id").Value?.ToString());

            var attendee = _dbContext.ActivityAttendees
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.ActivityId == activityId && x.AppUserId == userId)
                .Result;

            if (attendee == null) return Task.CompletedTask;

            if (attendee.IsHost) context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}