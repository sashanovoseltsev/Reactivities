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
            CreateMap<AppUser, UserProfile>()
                .ForMember(profile => profile.UserName, opt => opt.MapFrom(source => source.UserName))
                .ForMember(profile => profile.DisplayName, opt => opt.MapFrom(source => source.DisplayName))
                .ForMember(profile => profile.Bio, opt => opt.MapFrom(source => source.Bio));
            CreateMap<ActivityAttendee, UserProfile>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio));
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.Host, 
                    o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser));
        }
    }
}