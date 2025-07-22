using Microsoft.EntityFrameworkCore;
using RatioMaster.Core.Models;

namespace RatioMaster.API.Data
{
    public class RatioMasterContext : DbContext
    {
        public RatioMasterContext(DbContextOptions<RatioMasterContext> options) : base(options)
        {
        }

        public DbSet<TorrentInfo> Torrents { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<TorrentInfo>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(500);
                entity.Property(e => e.InfoHash).IsRequired().HasMaxLength(40);
                entity.Property(e => e.TrackerUrl).IsRequired().HasMaxLength(500);
                entity.Property(e => e.ClientType).HasMaxLength(100);
                
                // Conversion pour ProxySettings en JSON
                entity.Property(e => e.ProxySettings)
                    .HasConversion(
                        v => v == null ? null : System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                        v => v == null ? null : System.Text.Json.JsonSerializer.Deserialize<ProxySettings>(v, (System.Text.Json.JsonSerializerOptions?)null));
            });
        }
    }
}
