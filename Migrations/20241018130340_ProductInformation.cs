using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodRegistration.Migrations
{
    /// <inheritdoc />
    public partial class ProductInformation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "productinfos",
                columns: table => new
                {
                    ProductinfoId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CountryOfOrigin = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    CountryOfProvenance = table.Column<string>(type: "TEXT", nullable: true),
                    ItemNumber = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_productinfos", x => x.ProductinfoId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "productinfos");
        }
    }
}
