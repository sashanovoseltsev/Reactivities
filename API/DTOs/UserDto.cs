namespace API.DTOs
{
    public class UserDto
    {
        public string DisplayName { get; set; }
        public string UserName { get; set; }
        public string Token { get; set; }
        public string Image { get; set; }
        public int Followers { get; set; }
        public int Followings { get; set; }
        public bool IsFollowing { get; set; }
    }
}