using System.IO;
using objects;
using services;
using System.Text.Json;

namespace services{
public class JsonFileManagement{
    public async Task ExportToJson(List<LGA_Event> results)
    {
            string filePath = "./LGAInfo.json";

            var options = new JsonSerializerOptions{WriteIndented = true};
            var serialized = JsonSerializer.Serialize(results, options);

            using(StreamWriter sw = new StreamWriter(filePath))
            {
                await sw.WriteAsync(serialized);
            }
        }
    }
} 