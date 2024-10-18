using System;
using System.ComponentModel.DataAnnotations;

namespace FoodRegistration.Models // Bytt ut med ditt faktiske namespaces
{
    public class Productinfo
    {
        public int ProductinfoId { get; set; } 

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

        // Fremmednøkkel for å koble til Item. Kan jeg slette debbe og bare ha den under
        //altså bare beholde int itemid get set?
       /*  [ForeignKey("Item")] */
        public int ItemId { get; set; } // Må tilføres

        // Navigasjonspropertie til Item
        public virtual Item? Item { get; set; } // Nullable for å håndtere tilfeller uten tilknyttede varer
        
        public Productinfo()
        {
            CreatedDate = DateTime.Now; // Setter opprettelsesdato til nåværende tid
            UpdatedDate = DateTime.Now;  // Setter oppdateringsdato til nåværende tid
        }
    }
}