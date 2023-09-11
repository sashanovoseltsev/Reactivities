using Domain;
using AutoMapper;
using Application.Activities;
using Application.Profiles;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<UserProfile, UserProfile>();

            CreateMap<AppUser, UserProfile>()
                .ForMember(profile => profile.UserName, opt => opt.MapFrom(source => source.UserName))
                .ForMember(profile => profile.DisplayName, opt => opt.MapFrom(source => source.DisplayName))
                .ForMember(profile => profile.Bio, opt => opt.MapFrom(source => source.Bio))
                .ForMember(profile => profile.Image, opt => opt.MapFrom(source => source.Photos.FirstOrDefault(p => p.IsMain).Url));

            CreateMap<AppUser, AttendeeDto>()
                .ForMember(a => a.UserName, opt => opt.MapFrom(appUser => appUser.UserName))
                .ForMember(a => a.DisplayName, opt => opt.MapFrom(appUser => appUser.DisplayName))
                .ForMember(a => a.Bio, opt => opt.MapFrom(appUser => appUser.Bio))
                .ForMember(a => a.Image, opt => opt.MapFrom(appUser => appUser.Photos.FirstOrDefault(p => p.IsMain).Url));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, opt => opt.MapFrom(source => source.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url));

            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.Host, 
                    o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser));
        }
    }
}