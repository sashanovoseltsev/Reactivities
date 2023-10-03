namespace Domain
{
    public class UserFollowing
    {
        // who follows
        public string ObserverId { get; set; }
        public AppUser Observer { get; set; }

        // whom the user follows
        public string TargetId { get; set; }

        public AppUser Target { get; set; }
    }
}