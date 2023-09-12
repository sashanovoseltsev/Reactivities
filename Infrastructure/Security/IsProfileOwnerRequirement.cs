using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistance;

namespace Infrastructure.Security
{
    public class IsProfileOwnerRequirement: IAuthorizationRequirement {}

    public class IsProfileOwnerRequirementHandler : AuthorizationHandler<IsProfileOwnerRequirement>
    {
        private readonly IHttpContextAccessor _httpAccessor;
        public IsProfileOwnerRequirementHandler(IHttpContextAccessor httpAccessor)
        {
            _httpAccessor = httpAccessor;
        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsProfileOwnerRequirement requirement)
        {
            var loggedUserName = context.User.FindFirstValue(ClaimTypes.Name);

            if (string.IsNullOrEmpty(loggedUserName)) return Task.CompletedTask;

            var requestedUserName = _httpAccessor.HttpContext.Request.RouteValues
                                        .FirstOrDefault(v => v.Key == "username")
                                        .Value.ToString();

            if (string.IsNullOrEmpty(requestedUserName)) return Task.CompletedTask;

            if (requestedUserName == loggedUserName) context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}