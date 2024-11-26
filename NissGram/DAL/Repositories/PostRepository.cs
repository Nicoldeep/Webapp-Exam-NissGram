using Microsoft.EntityFrameworkCore;
using NissGram.Models;

namespace NissGram.DAL;
public class PostRepository : IPostRepository
{
    private readonly NissDbContext _db;
    private readonly ILogger<PostRepository> _logger;

    public PostRepository(NissDbContext db, ILogger<PostRepository> logger)
    {
        _db = db;
        _logger = logger;
    }


    public async Task<User?> GetUserByIdAsync(string userId)
    {
        return await _db.Users.Include(u => u.Posts).FirstOrDefaultAsync(u => u.Id == userId);
    }


    // GET ALL POSTS
    public async Task<IEnumerable<Post>?> GetAllPostsAsync()
    {
        try
        {
            var posts = await _db.Posts
                .OrderByDescending(post => post.DateCreated) // Ensure this property exists
                .ToListAsync();
            return posts;
        }
        catch (Exception e)
        {
            _logger.LogError("[PostRepository] Posts ToListAsync() failed when GetAllPostsAsync(), error message: {e}", e.Message);
            return null;
        }
    }


    // Get All Posts by User
    public async Task<IEnumerable<Post>?> GetAllPostsAsync(User user)
    {
        try
        {
            return await _db.Posts.Where(p => p.User == user).ToListAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("[PostRepository] Failed to get posts for User {@user}, Error message: {e}", user, e.Message);
            return null;
        }
    }

    // GET SINGLE POST 
    public async Task<Post?> GetPostByIdAsync(int id)
    {
        try
        {
            return await _db.Posts.FindAsync(id);
        }
        catch (Exception e)
        {
            _logger.LogError("[PostRepository] post FindAsync(id) failed when GetPostByIdAsync for PostId {PostId:0000}, error message: {e}", id, e.Message);
            return null;
        }

    }

    // Fjerne senere
    public async Task<User?> TempGetRandUser()
    {
        return await _db.Users.OrderBy(u => u.Id).FirstOrDefaultAsync();

    }
    // CREATE
    public async Task<bool> CreatePostAsync(Post post)
    {
        try
        {

            _db.Posts.Add(post);
            await _db.SaveChangesAsync();
            Console.WriteLine("Post created");
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError("[PostRepository] post creation failed for post {@post}, error message: {e}", post, e.Message);
            return false;
        }
    }


    // UPDATE
    public async Task<bool> UpdatePostAsync(Post post)
    {
        try
        {
            _db.Posts.Update(post);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError("[PostRepository] post update failed for post {@post}, error message: {e}", post, e.Message);
            return false;
        }
    }

    // DELETE
    public async Task<bool> DeletePostAsync(int id)
    {
        try
        {
            var post = await _db.Posts.FindAsync(id);
            if (post == null)
            {
                _logger.LogError("[PostRepository] post not found for the PostId {PostId:0000}", id);
                return false;
            }
            _db.Posts.Remove(post);
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError("[PostRepository] post deletion failed for the PostId {PostId:0000}, error message: {e}", id, e.Message);
            return false;
        }
    }

    public async Task<int> GetCountLikes(Post post)
    {
        try
        {
            return await _db.UserPostLikes.Where(p => p.PostId == post.PostId).CountAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("[PostRepository] post likes failed for post {@post}, error message {e}", post, e.Message);
            return -1;
        }
    }

}

