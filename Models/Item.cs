using System;
using System.ComponentModel.DataAnnotations;

namespace FoodRegistration.Models
{
    public class Item
    {
        public int ItemId { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [RegularExpression(@"^[0-9a-zA-ZæøåÆØÅ. \-]{2,30}$", ErrorMessage = "The Name must be numbers or letters and between 2 to 30 characters.")]
        [Display(Name = "Item name")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Category is required.")]
        [StringLength(50, ErrorMessage = "Category cannot exceed 50 characters.")]
        public string? Category { get; set; }

        [StringLength(50, ErrorMessage = "Sertificate cannot exceed 50 characters.")]
        public string? Sertificate { get; set; }

        [Url(ErrorMessage = "Invalid URL format.")]
        public string? ImageUrl { get; set; }

        // Nutritional Information
        [Range(0, double.MaxValue, ErrorMessage = "Energy must be a non-negative number.")]
        public double Energy { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Carbohydrates must be a non-negative number.")]
        public double Carbohydrates { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Sugar must be a non-negative number.")]
        public double Sugar { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Protein must be a non-negative number.")]
        public double Protein { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Fat must be a non-negative number.")]
        public double Fat { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Saturated fat must be a non-negative number.")]
        public double? Saturatedfat { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Unsaturated fat must be a non-negative number.")]
        public double? Unsaturatedfat { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Fibre must be a non-negative number.")]
        public double Fibre { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Salt must be a non-negative number.")]
        public double Salt { get; set; }

        [Required(ErrorMessage = "Country of origin is required.")]
        [StringLength(50, ErrorMessage = "Country of origin can't exceed 50 characters.")]
        public string? CountryOfOrigin { get; set; } // opprinelseland- råvrer er herfra
        public string? CountryOfProvenance { get; set; } //Opphavsland- endelige produksjonen eller bearbeidingen av produktet fant sted

        [Required(ErrorMessage = "Item number is required.")]
        [RegularExpression(@"[0-9a-zA-Z\-]{1,20}", ErrorMessage = "Item number must be alphanumeric and between 1 to 20 characters.")]
        public string? ItemNumber { get; set; }      // Varenummer

        [DataType(DataType.Date)]
        public DateTime CreatedDate { get; set; }   // Opprettelsesdato

        [DataType(DataType.Date)]
        public DateTime UpdatedDate { get; set; }   // Oppdateringsdato

        // Navigation property for ProductInfo (1-to-1 relationship)
        // public virtual Productinfo? Productinfo { get; set; }
    }
}