using Microsoft.AspNetCore.Identity;
using NissGram.Models;

namespace NissGram.ViewModels
{
    public class UserProfileViewModel
    {
        public User User { get; set; } // The user data
        public int PictureCount { get; set; } // Count of pictures
        public int NoteCount { get; set; } // Count of notes
        public List<Post> Pictures { get; set; } = new List<Post>(); // Pictures posted by the user
        public List<Post> Notes { get; set; } = new List<Post>(); // Notes written by the user
        public List<Post> LikedPosts { get; set; } = new List<Post>(); // Liked posts by the user
        // Constructor
        public UserProfileViewModel(User user)
        {
            User = user;
            //Sort Pictures by DateCreated descending
            Pictures = user.Posts?
                .Where(p => !string.IsNullOrEmpty(p.ImgUrl))
                .OrderByDescending(p => p.DateCreated) // Sort descending
                .ToList() ?? new List<Post>();

            // Sort Notes by DateCreated descending
            Notes = user.Posts?
                .Where(p => string.IsNullOrEmpty(p.ImgUrl))
                .OrderByDescending(p => p.DateCreated) // Sort descending
                .ToList() ?? new List<Post>();

            LikedPosts = user.LikedPosts?
                .Where(like => like.UserId == user.Id)
                .Select(like => like.Post)
                .ToList() ?? new List<Post>();

            // if (LikedPosts != null)
            // {
            //     Console.WriteLine($"Number of liked posts: {LikedPosts.Count()}");
            // }

            PictureCount = Pictures.Count;
            NoteCount = Notes.Count;
        }
        public string? StatusMessage { get; set; }

    }
}