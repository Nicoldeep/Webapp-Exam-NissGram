using System.ComponentModel.DataAnnotations;

namespace NissGram.ViewModels
{
    public class PostUpdateViewModel // Sørg for at denne er public
    {
        public int PostId { get; set; }
        [StringLength(1000, ErrorMessage = "Note section cannot exceed 1000 characters.")]
        public string? Text { get; set; }
        public string? ExistingImgUrl { get; set; }
        public IFormFile? NewImage { get; set; }
    }
}
