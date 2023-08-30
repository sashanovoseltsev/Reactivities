using Application.Photos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> Add([FromForm] Add.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] Delete.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMain([FromRoute] SetMain.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }
    }
}