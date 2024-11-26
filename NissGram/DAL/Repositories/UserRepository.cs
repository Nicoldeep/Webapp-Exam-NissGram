using Microsoft.EntityFrameworkCore;
using NissGram.Models;

namespace NissGram.DAL;
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

    /*public async Task<User?> GetUserByUsernameAsync(string username)
    {
        try
        {
            return await _db.Users.FirstOrDefaultAsync(u => u.UserName == username);
        }
        catch (Exception e)
        {
            _logger.LogError("[UserRepository] user FirstOrDefaultAsync(u => u.UserName == username) failed for username {username}, error message: {e}", username, e.Message);
            return null;
        }

    }*/

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        try
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if (user != null && string.IsNullOrEmpty(user.ProfilePicture))
            {
                user.ProfilePicture = "/images/profile_image_default.png"; // Default profile picture
            }
            return user;
        }
        catch (Exception e)
        {
            _logger.LogError("[UserRepository] Error fetching user by username: {Username}, error: {Error}", username, e.Message);
            return null;
        }
    }


    public async Task CreateUserAsync(User user)
    {
        await _db.Users.AddAsync(user);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateUserAsync(User user)
    {
        _db.Users.Update(user);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteUserAsync(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user != null)
        {
            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
        }
    }
}

