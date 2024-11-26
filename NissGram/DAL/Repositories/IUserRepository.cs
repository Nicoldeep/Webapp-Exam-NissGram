using Microsoft.EntityFrameworkCore;
using NissGram.Models;

namespace NissGram.DAL;
public interface IUserRepository
{
    Task<IEnumerable<User>?> GetAllUsersAsync();
    //Task<User?> GetUserByIdAsync(int id);
    Task<User?> GetUserByUsernameAsync(string username);
    Task CreateUserAsync(User user);
    Task UpdateUserAsync(User user);
    Task DeleteUserByUsernameAsync(string username);
}
