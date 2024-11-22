using System.ComponentModel.DataAnnotations;

namespace FoodRegistration.DTOs;

public class ItemDto
{
    public int ItemId { get; set; }

    [Required]
    [RegularExpression(@"[0-9a-zA-ZæøåÆØÅ. \-]{2,50}", ErrorMessage = "The Name must be numbers or letters and between 2 to 50 characters.")]
    [Display(Name = "Item name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(30, ErrorMessage = "The Category must be at most 30 characters.")]
    public string Category { get; set; } = string.Empty;

    [StringLength(100)]
    public string? Certificate { get; set; }

    [Url(ErrorMessage = "The Image URL is not valid.")]
    public string? ImageUrl { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Energy must be a positive value.")]
    public double? Energy { get; set; }

    [Range(0, 100, ErrorMessage = "Carbohydrates must be between 0 and 100.")]
    public double? Carbohydrates { get; set; }

    [Range(0, 100, ErrorMessage = "Sugar must be between 0 and 100.")]
    public double? Sugar { get; set; }

    [Range(0, 100, ErrorMessage = "Protein must be between 0 and 100.")]
    public double? Protein { get; set; }

    [Range(0, 100, ErrorMessage = "Fat must be between 0 and 100.")]
    public double? Fat { get; set; }

    [Range(0, 100, ErrorMessage = "Saturated fat must be between 0 and 100.")]
    public double? SaturatedFat { get; set; }

    [Range(0, 100, ErrorMessage = "Unsaturated fat must be between 0 and 100.")]
    public double? UnsaturatedFat { get; set; }

    [Range(0, 100, ErrorMessage = "Fibre must be between 0 and 100.")]
    public double? Fibre { get; set; }

    [Range(0, 100, ErrorMessage = "Salt must be between 0 and 100.")]
    public double? Salt { get; set; }

    [StringLength(50, ErrorMessage = "Country of origin must be at most 50 characters.")]
    public string? CountryOfOrigin { get; set; }

    [StringLength(50, ErrorMessage = "Country of provenance must be at most 50 characters.")]
    public string? CountryOfProvenance { get; set; }

    public DateTime CreatedDate { get; set; }
    public DateTime? UpdatedDate { get; set; }
}
