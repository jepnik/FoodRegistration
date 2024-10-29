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

        [StringLength(50, ErrorMessage = "Sertifikat cannot exceed 50 characters.")]
        public string? Sertifikat { get; set; }

        [Url(ErrorMessage = "Invalid URL format.")]
        public string? ImageUrl { get; set; }

        // Nutritional Information
        [Range(0, double.MaxValue, ErrorMessage = "Energi must be a non-negative number.")]
        public double Energi { get; set; }

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

        [Range(0, double.MaxValue, ErrorMessage = "Fiber must be a non-negative number.")]
        public double Fiber { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Salt must be a non-negative number.")]
        public double Salt { get; set; }

        // Navigation property for ProductInfo (1-to-1 relationship)
        public virtual Productinfo? Productinfo { get; set; }

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
        }
    }
}