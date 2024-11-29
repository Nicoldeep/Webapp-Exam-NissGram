using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using NissGram.Models;

namespace NissGram.DAL;

public static class DBInit
{
    public static void Seed(IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.CreateScope();
        NissDbContext context = serviceScope.ServiceProvider.GetRequiredService<NissDbContext>();
        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();

#nullable disable
        if (!context.Users.Any())
        {
            var users = new List<User>
            {
                new User
                {
                    UserName = "Nico123",
                    Email = "nico123@example.com",
                    ProfilePicture = "/uploads/profile-pictures-seededUsers/c1.png"
                },
                new User
                {
                    UserName = "JaneDoe",
                    Email = "jane.doe@example.com",
                    ProfilePicture = "/uploads/profile-pictures-seededUsers/c2.png"
                },
                new User
                {
                    UserName = "JohnSmith",
                    Email = "john.smith@example.com",
                    ProfilePicture = "/uploads/profile-pictures-seededUsers/c3.png"
                },
                new User
                {
                    UserName = "Bom93",
                    Email = "bombom@gmail.com",
                    ProfilePicture = "/uploads/profile-pictures-seededUsers/c4.png"
                },
                new User
                {
                    UserName = "koko_223",
                    Email = "kko.2@outlook.com",
                    ProfilePicture = "/uploads/profile-pictures-seededUsers/c5.png"
                },
                new User
                {
                    UserName = "geir_er_kul",
                    Email = "geir34@jahoo.com",
                    ProfilePicture = "/uploads/profile-pictures-seededUsers/c6.png"
                },
                new User
                {
                    UserName = "tina_betina12",
                    Email = "tine.b@gmail.com",
                    ProfilePicture = "/uploads/profile-pictures-seededUsers/c7.png"
                }
            };

            context.AddRange(users);
            context.SaveChanges();
        }

        // SEEDED USERS
        var userNico = context.Users.FirstOrDefault(u => u.UserName == "Nico123");
        var userJane = context.Users.FirstOrDefault(u => u.UserName == "JaneDoe");
        var userJohn = context.Users.FirstOrDefault(u => u.UserName == "JohnSmith");
        var userBom = context.Users.FirstOrDefault(u => u.UserName == "Bom93");
        var userKoko = context.Users.FirstOrDefault(u => u.UserName == "koko_223");
        var userGeir = context.Users.FirstOrDefault(u => u.UserName == "geir_er_kul");
        var userTina = context.Users.FirstOrDefault(u => u.UserName == "tina_betina12");




        if (!context.Posts.Any())
        {
            var posts = new List<Post>
            {
                new Post
                {
                    User = userNico, // Brukerobjektet for å sette relasjonen
                    Text = "Very pretty colors Gggg!",
                    ImgUrl = "/images/snorekling.png",
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    UserLikes = new List<UserPostLike>
                    {
                    }
                },
                new Post
                {
                    User = userJane, // Brukerobjektet for å sette relasjonen
                    Text = "Today I went to the park and enjoyed the sunshine.",
                    ImgUrl = null,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    UserLikes = new List<UserPostLike>
                    {
                    }
                },
                new Post
                {
                    User = userJohn, // Brukerobjektet for å sette relasjonen
                    Text = "Nais hiking",
                    ImgUrl = "/images/hiking.png", // Legg til en passende URL for bildet
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    UserLikes = new List<UserPostLike>
                    {
                    }
                },
                new Post
                {
                    User = userBom, // Brukerobjektet for å sette relasjonen
                    Text = "Wow so many animals",
                    ImgUrl = "/images/safari.png", // Legg til en passende URL for bildet
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    UserLikes = new List<UserPostLike>
                    {
                    }
                },
                new Post
                {
                    User = userKoko, // Brukerobjektet for å sette relasjonen
                    Text = "Today I ate a delicious kabab.",
                    ImgUrl = null,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    UserLikes = new List<UserPostLike>
                    {
                    }
                },
                new Post
                {
                    User = userGeir, // Brukerobjektet for å sette relasjonen
                    Text = "I catched a huge cod",
                    ImgUrl = "/images/fishing.png", // Legg til en passende URL for bildet
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    UserLikes = new List<UserPostLike>
                    {
                    }
                },
                new Post
                {
                    User = userTina, // Brukerobjektet for å sette relasjonen
                    Text = "Dinner time",
                    ImgUrl = "/images/cooking.png", // Legg til en passende URL for bildet
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    UserLikes = new List<UserPostLike>
                    {
                    }
                },
                new Post
                {
                    User = userNico, // Brukerobjektet for å sette relasjonen
                    Text = "She glanced up into the sky to watch the clouds taking shape. First, she saw a dog. Next, it was an elephant. Finally, she saw a giant umbrella and at that moment the rain began to pour.",
                    ImgUrl = null,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    UserLikes = new List<UserPostLike>
                    {
                    }
                },
                new Post
                {
                    User = userJane, // Brukerobjektet for å sette relasjonen
                    Text = "Music time",
                    ImgUrl = "/images/mexican_amigos.png", // Legg til en passende URL for bildet
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    UserLikes = new List<UserPostLike>
                    {
                    }
                },
                new Post
                {
                    User = userBom, // Brukerobjektet for å sette relasjonen
                    Text = "Travel time",
                    ImgUrl = "/images/airplane_window.png", // Legg til en passende URL for bildet
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    UserLikes = new List<UserPostLike>
                    {
                    }
                },
                new Post
                {
                    User = userJane, // Brukerobjektet for å sette relasjonen
                    Text = "The red glint of paint sparkled under the sun. He had dreamed of owning this car since he was ten, and that dream had become a reality less than a year ago. It was his baby and he spent hours caring for it, pampering it, and fondling over it. She knew this all too well, and that's exactly why she had taken a sludge hammer to it.",
                    ImgUrl = null,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    UserLikes = new List<UserPostLike>
                    {
                    }
                },
                new Post
                {
                    User = userJohn, // Brukerobjektet for å sette relasjonen
                    Text = "Adventure time",
                    ImgUrl = "/images/paragliding.png", // Legg til en passende URL for bildet
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    UserLikes = new List<UserPostLike>
                    {
                    }
                },
                new Post
                {
                    User = userJane, // Brukerobjektet for å sette relasjonen
                    Text = "Just loving nature",
                    ImgUrl = "/images/northern_lights.png", // Legg til en passende URL for bildet
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    UserLikes = new List<UserPostLike>
                    {
                    }
                },
                new Post
                {
                    User = userJane, // Brukerobjektet for å sette relasjonen
                    Text = "There once lived an old man and an old woman who were peasants and had to work hard to earn their daily bread. The old man used to go to fix fences and do other odd jobs for the farmers around, and while he was gone the old woman, his wife, did the work of the house and worked in their own little plot of land.",
                    ImgUrl = null,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    UserLikes = new List<UserPostLike>
                    {
                    }
                },
                new Post
                {
                    User = userGeir, // Brukerobjektet for å sette relasjonen
                    Text = "I love steak",
                    ImgUrl = "/images/cows.png", // Legg til en passende URL for bildet
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    UserLikes = new List<UserPostLike>
                    {
                    }
                },
                new Post
                {
                    User = userJane, // Brukerobjektet for å sette relasjonen
                    Text = "Happy hour",
                    ImgUrl = "/images/friends_dining.png", // Legg til en passende URL for bildet
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    UserLikes = new List<UserPostLike>
                    {
                    }
                },
                new Post
                {
                    User = userJane, // Brukerobjektet for å sette relasjonen
                    Text = "here was no time. He ran out of the door without half the stuff he needed for work, but it didn't matter. He was late and if he didn't make this meeting on time, someone's life may be in danger.",
                    ImgUrl = null,
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    UserLikes = new List<UserPostLike>
                    {
                    }
                },
                new Post
                {
                    User = userJane, // Brukerobjektet for å sette relasjonen
                    Text = "FOOOOOD",
                    ImgUrl = "/images/picknick.png", // Legg til en passende URL for bildet
                    DateCreated = DateTime.Now,
                    DateUpdated = DateTime.Now,
                    UserLikes = new List<UserPostLike>
                    {
                    }
                }
            };


            context.AddRange(posts);
            context.SaveChanges();

            SeedRandomLikes(context);
        }



        if (!context.Comments.Any())
        {
            var post1 = context.Posts.FirstOrDefault(u => u.PostId == 1);
            var post2 = context.Posts.FirstOrDefault(u => u.PostId == 2);
            var post3 = context.Posts.FirstOrDefault(u => u.PostId == 3);
            var post4 = context.Posts.FirstOrDefault(u => u.PostId == 4);
            var post5 = context.Posts.FirstOrDefault(u => u.PostId == 5);
            var post6 = context.Posts.FirstOrDefault(u => u.PostId == 6);
            var post7 = context.Posts.FirstOrDefault(u => u.PostId == 7);
            var post8 = context.Posts.FirstOrDefault(u => u.PostId == 8);
            var post9 = context.Posts.FirstOrDefault(u => u.PostId == 9);
            var post10 = context.Posts.FirstOrDefault(u => u.PostId == 10);
            var post11 = context.Posts.FirstOrDefault(u => u.PostId == 11);
            var post12 = context.Posts.FirstOrDefault(u => u.PostId == 12);
            var post13 = context.Posts.FirstOrDefault(u => u.PostId == 13);
            var post14 = context.Posts.FirstOrDefault(u => u.PostId == 14);
            var post15 = context.Posts.FirstOrDefault(u => u.PostId == 15);
            var post16 = context.Posts.FirstOrDefault(u => u.PostId == 16);
            var post17 = context.Posts.FirstOrDefault(u => u.PostId == 17);
            var post18 = context.Posts.FirstOrDefault(u => u.PostId == 18);

            var comments = new List<Comment>
            {
                new Comment
                {
                    CommentId = 1,
                    Post = post1,
                    User = userGeir,
                    Text = "Damnnnn gurl slayyyy",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 2,
                    Post = post2,
                    User = userJane,
                    Text = "This is so inspiring! Love your work.",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 3,
                    Post = post3,
                    User = userBom,
                    Text = "Where did you take this photo? Amazing location!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 4,
                    Post = post4,
                    User = userNico,
                    Text = "Can't wait to see more of your work!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 5,
                    Post = post5,
                    User = userJohn,
                    Text = "The colors are just stunning!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 6,
                    Post = post6,
                    User = userKoko,
                    Text = "Such a powerful message. Thank you for sharing.",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 7,
                    Post = post7,
                    User = userTina,
                    Text = "I keep coming back to this post, it's incredible.",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 8,
                    Post = post8,
                    User = userJane,
                    Text = "So much talent in one post! Keep it up!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 9,
                    Post = post9,
                    User = userGeir,
                    Text = "Can’t get enough of these updates!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 10,
                    Post = post10,
                    User = userNico,
                    Text = "Epic vibes! How did you pull this off?",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 11,
                    Post = post11,
                    User = userBom,
                    Text = "This looks amazing, very well done!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 12,
                    Post = post12,
                    User = userKoko,
                    Text = "Always blown away by your creativity!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 13,
                    Post = post13,
                    User = userJane,
                    Text = "Such an inspiration!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 14,
                    Post = post14,
                    User = userGeir,
                    Text = "This should be framed in a museum!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 15,
                    Post = post15,
                    User = userTina,
                    Text = "Gorgeous shot, love the perspective.",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 16,
                    Post = post16,
                    User = userJohn,
                    Text = "Pure magic!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 17,
                    Post = post17,
                    User = userNico,
                    Text = "Always exciting to see your updates!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 18,
                    Post = post18,
                    User = userBom,
                    Text = "So much character in this!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 19,
                    Post = post1,
                    User = userJane,
                    Text = "Absolutely stunning! Where was this taken?",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 20,
                    Post = post2,
                    User = userTina,
                    Text = "Loving the detail on this one!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 21,
                    Post = post3,
                    User = userKoko,
                    Text = "Can I use this as my wallpaper?",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 22,
                    Post = post4,
                    User = userGeir,
                    Text = "Great composition! Keep up the amazing work.",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 23,
                    Post = post5,
                    User = userJohn,
                    Text = "Every detail is on point. Love it!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 24,
                    Post = post6,
                    User = userNico,
                    Text = "This just made my day!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 25,
                    Post = post7,
                    User = userBom,
                    Text = "You have such a unique style!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 26,
                    Post = post8,
                    User = userTina,
                    Text = "Speechless... your work is incredible.",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 27,
                    Post = post9,
                    User = userJane,
                    Text = "Keep these coming! You’re a true artist.",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 28,
                    Post = post10,
                    User = userGeir,
                    Text = "Fantastic use of lighting here.",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 29,
                    Post = post11,
                    User = userBom,
                    Text = "This feels like it tells a story.",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 30,
                    Post = post12,
                    User = userKoko,
                    Text = "Wow, so inspiring!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 31,
                    Post = post13,
                    User = userJohn,
                    Text = "The colors just pop here. Amazing!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 32,
                    Post = post14,
                    User = userNico,
                    Text = "Love the energy this gives off!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 33,
                    Post = post15,
                    User = userJane,
                    Text = "You’ve outdone yourself with this one.",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 34,
                    Post = post16,
                    User = userTina,
                    Text = "Wow, the vibe here is so cozy!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 35,
                    Post = post17,
                    User = userGeir,
                    Text = "I could stare at this all day!",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 36,
                    Post = post18,
                    User = userKoko,
                    Text = "This post gives me so many ideas.",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 37,
                    Post = post3,
                    User = userJohn,
                    Text = "How do you manage to keep every post so unique?",
                    dateCommented = DateTime.Now
                },
                new Comment
                {
                    CommentId = 38,
                    Post = post5,
                    User = userJane,
                    Text = "Superb work! You really capture emotion.",
                    dateCommented = DateTime.Now
                }
            };
            context.AddRange(comments);
            context.SaveChanges();
        }
#nullable restore
    }

    private static void SeedRandomLikes(NissDbContext context)
    {
        var users = context.Users.ToList();
        var posts = context.Posts.ToList();
        Random random = new Random();

        foreach (var post in posts)
        {
            // Generate a random number of likes for this post
            int numberOfLikes = random.Next(0, users.Count);

            // Select random users to like this post
            var selectedUsers = users.OrderBy(u => random.Next()).Take(numberOfLikes);

            foreach (var user in selectedUsers)
            {
                // Create a new UserPostLike entry and add it to the post's UserLikes collection
                post.UserLikes.Add(new UserPostLike
                {
                    UserId = user.Id,
                    PostId = post.PostId
                });
            }
        }

        // Save changes to the database
        context.SaveChanges();
    }
}
