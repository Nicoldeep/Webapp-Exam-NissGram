using System.ComponentModel.DataAnnotations;

namespace NissGram.Models;
public class Post
{
    public int PostId { get; set; }
    public virtual User User { get; set; } = default!;

    [StringLength(1000, ErrorMessage = "Note section cannot exceed 1000 characters.")]
    public string? Text { get; set; }
    public string? ImgUrl { get; set; }
    public DateTime DateCreated { get; set; } = DateTime.Now;
    public DateTime DateUpdated { get; set; } = DateTime.Now;
    // Use a join entity for many-to-many
    public virtual ICollection<UserPostLike> UserLikes { get; set; } = new List<UserPostLike>();
    public virtual ICollection<Comment> UserComments { get; set; } = new List<Comment>();
}