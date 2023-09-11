using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Profiles;
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

        // TODO: Add policy which will allow only the logged in user to update its own profile
        [HttpPut("{username}")]
        public async Task<IActionResult> UpdateUserProfile(string username, UserProfile profile)
        {
            profile.UserName = username;
            return HandleResult(await Mediator.Send(new Edit.Command { Profile = profile }));
        }
    }
}