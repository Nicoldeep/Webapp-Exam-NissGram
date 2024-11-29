
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace NissGram.Models;

public class User : IdentityUser
{
    // public int UserId { get; set; }

    // public required string UserName { get; set; }
    // public required string Email { get; set; }
    // public required string Password { get; set; }
    // public string FirstName { get; set; } = string.Empty;
    // public string LastName { get; set; } = string.Empty;

    /*
    The following properties are already defined in IdentityUser 
        Id type string 
        Username type string often required and must be unique
        Email type string required not null
        PasswordHash type string 
        Phonenr type string 
        
    */

    public string? ProfilePicture { get; set; } 
    public string? FirstName { get; set; }  

    public string? LastName { get; set; }  

    public string? About { get; set; }  

    //Posts created by the user
    public virtual ICollection<Post>? Posts { get; set; } = new List<Post>();

    //Likes made by the user to use under activity
    public virtual ICollection<UserPostLike> LikedPosts { get; set; } = new List<UserPostLike>();

    // Relasjon til kommentarer
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
}

/* The strings and classes must be declared with default values ( = string.Empty or
default! for class) to state the value is a mandatory value OR
(Line9) must be following with a question mark to state it is nullable */