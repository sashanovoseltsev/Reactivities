using Domain;
using AutoMapper;
using Application.Activities;
using Application.Profiles;
using Application.Comments;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUserName = null;
            CreateMap<Activity, Activity>();
            CreateMap<UserProfile, UserProfile>();

            CreateMap<AppUser, UserProfile>()
                .ForMember(p => p.UserName, opt => opt.MapFrom(u => u.UserName))
                .ForMember(p => p.DisplayName, opt => opt.MapFrom(u => u.DisplayName))
                .ForMember(p => p.Bio, opt => opt.MapFrom(u => u.Bio))
                .ForMember(p => p.Image, opt => opt.MapFrom(u => u.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(p => p.Followers, opt => opt.MapFrom(u => u.Followers.Count))
                .ForMember(p => p.Followings, opt => opt.MapFrom(u => u.Followings.Count))
                .ForMember(p => p.IsFollowing, opt => opt.MapFrom(u => u.Followers.Any(uf => uf.Observer.UserName == currentUserName)));

            CreateMap<AppUser, AttendeeDto>()
                .ForMember(a => a.UserName, opt => opt.MapFrom(appUser => appUser.UserName))
                .ForMember(a => a.DisplayName, opt => opt.MapFrom(appUser => appUser.DisplayName))
                .ForMember(a => a.Bio, opt => opt.MapFrom(appUser => appUser.Bio))
                .ForMember(a => a.Image, opt => opt.MapFrom(appUser => appUser.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(p => p.Followers, opt => opt.MapFrom(u => u.Followers.Count))
                .ForMember(p => p.Followings, opt => opt.MapFrom(u => u.Followings.Count))
                .ForMember(p => p.IsFollowing, opt => opt.MapFrom(u => u.Followers.Any(uf => uf.Observer.UserName == currentUserName)));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, opt => opt.MapFrom(source => source.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(d => d.Followers, opt => opt.MapFrom(s => s.AppUser.Followers.Count))
                .ForMember(d => d.Followings, opt => opt.MapFrom(s => s.AppUser.Followings.Count))
                .ForMember(d => d.IsFollowing, opt => opt.MapFrom(s => s.AppUser.Followers.Any(uf => uf.Observer.UserName == currentUserName)));

            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.Host, 
                    o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser));

            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.Image, opt => opt.MapFrom(source => source.Author.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}