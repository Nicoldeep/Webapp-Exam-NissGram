using System.ComponentModel.DataAnnotations;


namespace NissGram.Models;
public class Comment
{

    public int CommentId { get; set; }

    public virtual Post Post { get; set; } = default!;
    public virtual User User { get; set; } = default!;

    public string UserId { get; set; } = default!; // Fremmednøkkel til User

    [StringLength(2, ErrorMessage = "Note section cannot exceed 2 characters.")]
    public required string Text { get; set; }
    public DateTime dateCommented { get; set; } // should be capital letter "D", we noticed too late 


}