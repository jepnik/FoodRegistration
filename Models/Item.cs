using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodRegistration.Models
{
    public class Item
    {
         [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ItemId { get; set; }
    public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Category is required.")]
        [StringLength(50, ErrorMessage = "Category cannot exceed 50 characters.")]
        public string? Category { get; set; }

        [StringLength(50, ErrorMessage = "Certificate cannot exceed 50 characters.")]
        public string? Certificate { get; set; }

        public string? ImageUrl { get; set; }

        // Nutritional Information
[Required(ErrorMessage = "Energy is required.")]
[Range(0, double.MaxValue, ErrorMessage = "Energy must be a non-negative number.")]
public double? Energy { get; set; }

[Required(ErrorMessage = "Carbohydrates is required.")]
[Range(0, double.MaxValue, ErrorMessage = "Carbohydrates must be a non-negative number.")]
public double? Carbohydrates { get; set; }

[Required(ErrorMessage = "Sugar is required.")]
[Range(0, double.MaxValue, ErrorMessage = "Sugar must be a non-negative number.")]
public double? Sugar { get; set; }

[Required(ErrorMessage = "Protein is required.")]
[Range(0, double.MaxValue, ErrorMessage = "Protein must be a non-negative number.")]
public double? Protein { get; set; }

[Required(ErrorMessage = "Fat is required.")]
[Range(0, double.MaxValue, ErrorMessage = "Fat must be a non-negative number.")]
public double? Fat { get; set; }

[Required(ErrorMessage = "Saturated fat is required.")]
[Range(0, double.MaxValue, ErrorMessage = "Saturated fat must be a non-negative number.")]
public double? Saturatedfat { get; set; }

[Required(ErrorMessage = "Unsaturated fat is required.")]
[Range(0, double.MaxValue, ErrorMessage = "Unsaturated fat must be a non-negative number.")]
public double? Unsaturatedfat { get; set; }

[Required(ErrorMessage = "Fibre is required.")]
[Range(0, double.MaxValue, ErrorMessage = "Fibre must be a non-negative number.")]
public double? Fibre { get; set; }

[Required(ErrorMessage = "Salt is required.")]
[Range(0, double.MaxValue, ErrorMessage = "Salt must be a non-negative number.")]
public double? Salt { get; set; }

        [Required(ErrorMessage = "Country of origin is required.")]
        [StringLength(50, ErrorMessage = "Country of origin can't exceed 50 characters.")]
        public string? CountryOfOrigin { get; set; } // opprinelseland- råvrer er herfra
        
        [Required(ErrorMessage = "Country of provenance is required.")]
        [StringLength(50, ErrorMessage = "Country of provenance can't exceed 50 characters.")]
        public string? CountryOfProvenance { get; set; } //Opphavsland- endelige produksjonen eller bearbeidingen av produktet fant sted

        [DataType(DataType.Date)]
        public DateTime CreatedDate { get; set; }   // Opprettelsesdato

        [DataType(DataType.Date)]
        public DateTime UpdatedDate { get; set; }   // Oppdateringsdato        
    }
}