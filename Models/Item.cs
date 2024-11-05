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

        [DataType(DataType.Date)]
        public DateTime CreatedDate { get; set; }   // Opprettelsesdato

        [DataType(DataType.Date)]
        public DateTime UpdatedDate { get; set; }   // Oppdateringsdato

        // Navigation property for ProductInfo (1-to-1 relationship)
        // public virtual Productinfo? Productinfo { get; set; }
/* 
        // Validation property
        public bool IsFatCompositionValid
        {
            get
            {
                double saturatedFat = Saturatedfat ?? 0;
                double unsaturatedFat = Unsaturatedfat ?? 0;
                return (saturatedFat + unsaturatedFat) <= Fat;
            }
        }

        // Method to validate fat composition
        public string ValidateFatComposition()
        {
            // If both saturated and unsaturated fats are null, return an empty string
            if (Saturatedfat == null && Unsaturatedfat == null)
            {
                return string.Empty;
            }

            // Calculate total of saturated and unsaturated fats
            double totalFatComposition = (Saturatedfat ?? 0) + (Unsaturatedfat ?? 0);

            // Check if the total fat composition exceeds the total fat
            if (totalFatComposition > Fat)
            {
                return "The combined value of saturated fat and unsaturated fat cannot exceed the total fat.";
            }

            return string.Empty; // Return an empty string if the validation passes
        } */


         // Tilpasset validering
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        // Sjekk at summen av saturated og unsaturated fat ikke overstiger fat
        if ((Saturatedfat.GetValueOrDefault() + Unsaturatedfat.GetValueOrDefault()) > Fat)
        {
            yield return new ValidationResult(
                "The combined value of Saturated fat and Unsaturated fat cannot exceed the total Fat.",
                new[] { nameof(Saturatedfat), nameof(Unsaturatedfat) }
            );
        }
    }





        
    }
}