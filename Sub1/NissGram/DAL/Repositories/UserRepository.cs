using Microsoft.EntityFrameworkCore;
using NissGram.Models;
using NissGram.DAL.Interfaces;

namespace NissGram.DAL.Repositories;

public class UserRepository : IUserRepository
{
    private readonly NissDbContext _db;
    private readonly ILogger<UserRepository> _logger;

    public UserRepository(NissDbContext db, ILogger<UserRepository> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<IEnumerable<User>?> GetAllUsersAsync()
    {
        try
        {
            return await _db.Users.ToListAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("[UserRepository] users ToListAsync() failed when GetAllUsersAsync(), error message: {e}", e.Message);
            return null;
        }
    }

    public async Task<User?> GetUserByIdAsync(int id)
    {
        try
        {
            return await _db.Users.FindAsync(id);
        }
        catch (Exception e)
        {
            _logger.LogError("[UserRepository] user FindAsync(id) failed for UserId {UserId:0000}, error message: {e}", id, e.Message);
            return null;
        }

    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        try
        {
            return await _db.Users.FirstOrDefaultAsync(u => u.UserName == username);
        }
        catch (Exception e)
        {
            _logger.LogError("[UserRepository] Error fetching user by username: {Username}, error: {Error}", username, e.Message);
            return null;
        }
    }


    public async Task<bool> CreateUserAsync(User user)
    {
        if (user == null)
        {
            _logger.LogWarning("[UserRepository] Attempted to create a null user. User: {user}", user);
            return false;
        }

        try
        {
            await _db.Users.AddAsync(user);
            await _db.SaveChangesAsync();
            _logger.LogInformation("[UserRepository] User with username {Username} was successfully created.", user.UserName);
            return true; // Success
        }
        catch (Exception ex)
        {
            _logger.LogError("[UserRepository] An error occurred while creating user with username {Username}. Exception: {ex}", user.UserName, ex.Message);
            return false;
        }
    }

    public async Task<bool> UpdateUserAsync(User user)
    {
        if (user == null)
        {
            _logger.LogWarning("[UserRepository] Attempted to create a null user. User: {user}", user);
            return false;
        }

        try
        {
            var existingUser = await _db.Users.FindAsync(user.Id);

            _db.Users.Update(user);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[UserRepository] An error occurred while updating user with ID {UserId}.", user.Id);
            return false;
        }
    }


    // public async Task<bool> DeleteUserByUsernameAsync(string username)
    // {
    //     try
    //     {
    //         var user = await _db.Users.FirstOrDefaultAsync(u => u.UserName == username);
    //         if (user == null)
    //         {
    //             _logger.LogWarning("[UserRepository] User with username {Username} was not found and could not be deleted.", username);
    //             return false;

    //         }

    //         // Delete related posts
    //         _db.Posts.RemoveRange(user.Posts);

    //         // Delete related likes
    //         _db.UserPostLikes.RemoveRange(user.LikedPosts);

    //         _db.Users.Remove(user);
    //         await _db.SaveChangesAsync();
    //         return true;
    //     }
    //     catch (Exception ex)
    //     {
    //         _logger.LogError("[UserRepository] An error occurred while trying to delete user with username {Username}. Exception: {e}", username, ex.Message);
    //         return false;
    //     }
    // }

    public async Task<bool> DeleteUserByUsernameAsync(string username)
{
    try
    {
         var user = await _db.Users
            .Include(u => u.Comments) // Inkluder kommentarer
            .Include(u => u.Posts) // Inkluder innlegg
            .FirstOrDefaultAsync(u => u.UserName == username);

        if (user == null)
        {
            _logger.LogWarning("[UserRepository] User with username {Username} was not found and could not be deleted.", username);
            return false;
        }

        // Slett relaterte kommentarer
        if (user.Comments != null && user.Comments.Any())
        {
            _db.Comments.RemoveRange(user.Comments);
        }

        // Slett relaterte innlegg
        if (user.Posts != null && user.Posts.Any())
        {
            _db.Posts.RemoveRange(user.Posts);
        }

        // Brukerens kommentarer blir slettet automatisk på grunn av "cascade delete"
        _db.Users.Remove(user);

        // Log message to terminal
        Console.WriteLine($"[UserRepository] User with username '{username}' has been successfully deleted.");
        await _db.SaveChangesAsync();
        return true;
    }
    catch (Exception ex)
    {
        _logger.LogError("[UserRepository] An error occurred while trying to delete user with username {Username}. Exception: {e}", username, ex.Message);
        return false;
    }
}

}

