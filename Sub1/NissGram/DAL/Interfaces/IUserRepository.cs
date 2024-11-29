using Microsoft.EntityFrameworkCore;
using NissGram.Models;

namespace NissGram.DAL.Interfaces;
public interface IUserRepository
{
    Task<IEnumerable<User>?> GetAllUsersAsync();
    Task<User?> GetUserByUsernameAsync(string username);
    Task<bool> CreateUserAsync(User user);
    Task<bool> UpdateUserAsync(User user);
    Task<bool> DeleteUserByUsernameAsync(string username);
}
