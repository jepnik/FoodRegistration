using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodRegistration.Migrations
{
    /// <inheritdoc />
    public partial class NutrientsExpanded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Carbohydrates",
                table: "Items",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Energi",
                table: "Items",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Fat",
                table: "Items",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Fiber",
                table: "Items",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Protein",
                table: "Items",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Salt",
                table: "Items",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Saturatedfat",
                table: "Items",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Sugar",
                table: "Items",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Unsaturatedfat",
                table: "Items",
                type: "REAL",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Carbohydrates",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "Energi",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "Fat",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "Fiber",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "Protein",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "Salt",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "Saturatedfat",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "Sugar",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "Unsaturatedfat",
                table: "Items");
        }
    }
}
