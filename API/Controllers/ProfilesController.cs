using Application.Profiles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetUserProfile([FromRoute] Details.Query query)
        {
            return HandleResult(await Mediator.Send(query));
        }

        [Authorize(Policy = "IsProfileOwner")]
        [HttpPut("{username}")]
        public async Task<IActionResult> UpdateUserProfile(string username, Edit.Command editCommand)
        {
            editCommand.UserName = username;
            return HandleResult(await Mediator.Send(editCommand));
        }
    }
}