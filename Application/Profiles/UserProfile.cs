using Domain;

namespace Application.Profiles
{
    public class UserProfile
    {
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string Image { get; set; }
        public ICollection<Photo> Photos { get; set; }
        // Means that the currently logged-in user follows owner of this user profile
        public bool IsFollowing { get; set; }
        public int Followers { get; set; }
        public int Followings { get; set; }
    }
}