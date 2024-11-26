using NissGram.Models;

namespace NissGram.DAL
{
    public interface ICommentRepository
    {
        Task<IEnumerable<Comment>> GetCommentsByPostIdAsync(int postId);
        Task<Comment?> GetCommentByIdAsync(int commentId);
        Task<bool> AddCommentAsync(Comment comment);
        Task<bool> DeleteCommentAsync(int commentId);
    }
}
