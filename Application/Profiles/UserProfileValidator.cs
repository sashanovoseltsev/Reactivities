using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.Profiles
{
    public class UserProfileValidator: AbstractValidator<UserProfile>
    {
        public UserProfileValidator()
        {
            RuleFor(profile => profile.DisplayName).NotEmpty();
        }
    }
}