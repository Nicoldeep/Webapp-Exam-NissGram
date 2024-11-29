using System.ComponentModel.DataAnnotations;
using NissGram.Models;
namespace NissGram.ViewModels
{
    public class UserUpdateCreateViewModel
    {
        public string? ProfilePicture { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [RegularExpression(@"[a-zA-ZæøåÆØÅ. \-]{2,20}", ErrorMessage = "The Name must be letters and between 2 to 20 characters.")]
        [Display(Name = "First name")]  
        public string? FirstName { get; set; }

        [RegularExpression(@"[a-zA-ZæøåÆØÅ. \-]{2,20}", ErrorMessage = "The Name must be letters and between 2 to 20 characters.")]
        [Display(Name = "Last name")]
        public string? LastName { get; set; }

        [StringLength(500, ErrorMessage = "About section cannot exceed 500 characters.")]
        public string? About { get; set; }

        [RegularExpression(@"^[0-9]{8,10}$", ErrorMessage = "The phone number must contain only numbers and be between 8 and 10 digits.")]
        public string? PhoneNumber { get; set; }
        //public string Password { get; set; } = string.Empty;
        //public string ConfirmPassword { get; set; } = string.Empty;

    }
}

