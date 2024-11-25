
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace NissGram.Models;

public class User : IdentityUser
{
    /*
    The following properties are already defined in IdentityUser 
        Id type string 
        Username type string often required and must be unique
        Email type string required not null
        PasswordHash type string 
        Phonenr type string 
        
    */
    public string? ProfilePicture { get; set; }
    [RegularExpression(@"[a-zA-ZæøåÆØÅ. \-]{2,20}", ErrorMessage = "The Name must be letters and between 2 to 20 characters.")]
    [Display(Name = "First name")]
    public string? FirstName { get; set; }

    [RegularExpression(@"[a-zA-ZæøåÆØÅ. \-]{2,20}", ErrorMessage = "The Name must be letters and between 2 to 20 characters.")]
    [Display(Name = "Last name")]
    public string? LastName { get; set; }

    [StringLength(500, ErrorMessage = "About section cannot exceed 500 characters.")]
    public string? About { get; set; }  // Added this - db?

    //Posts created by the user
    public virtual ICollection<Post>? Posts { get; set; }

    //Likes made by the user to use under activity
    public virtual ICollection<UserPostLike> LikedPosts { get; set; } = new List<UserPostLike>();

}

/* The strings and classes must be declared with default values ( = string.Empty or
default! for class) to state the value is a mandatory value OR
(Line9) must be following with a question mark to state it is nullable */