using Microsoft.EntityFrameworkCore;
using NissGram.Models;
using NissGram.DAL.Interfaces;

namespace NissGram.DAL.Repositories;
public class CommentRepository : ICommentRepository
{
    private readonly NissDbContext _db;
    private readonly ILogger<CommentRepository> _logger;

    public CommentRepository(NissDbContext db, ILogger<CommentRepository> logger)
    {
        _db = db;
        _logger = logger;
    }

    // Add a new comment
    public async Task<bool> AddCommentAsync(Comment comment)
    {
        try
        {
            await _db.Comments.AddAsync(comment);
            await _db.SaveChangesAsync();
            _logger.LogInformation("[CommentRepository] Comment added successfully for PostId: {PostId}", comment.Post.PostId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[CommentRepository] Failed to add comment for PostId: {PostId}", comment.Post.PostId);
            return false;
        }
    }


    // Delete a comment
    public async Task<bool> DeleteCommentAsync(int commentId)
    {
        try
        {
            var comment = await _db.Comments.FindAsync(commentId);
            if (comment == null)
            {
                _logger.LogWarning("[CommentRepository] Attempted to delete a comment that does not exist. CommentId: {CommentId}", commentId);
                return false;
            }

            _db.Comments.Remove(comment);
            await _db.SaveChangesAsync();
            _logger.LogInformation("[CommentRepository] Comment deleted successfully. CommentId: {CommentId}", commentId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[CommentRepository] Failed to delete comment with CommentId: {CommentId}", commentId);
            return false;
        }
    }


}