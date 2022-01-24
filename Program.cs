using System.Text.Json;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using AngleSharp.Html.Parser;
using System.IO;

Scraper.Scrape().Wait();

class Website
{
    private string? Title { get; set; }
    private string? Url { get; set; }
    public string? UrlLink { get; set; }
    private string? ImageUrl { get; set; }

}

public class LGAEvent
{
    public string? Title {get; set;}
    public string? Description { get; set; }
    public string? Id { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class Scraper
{

    public static async Task Scrape()
    {
        try
        {
            Website website = new Website { UrlLink = "https://atparramatta.com/whats-on" };

            CancellationTokenSource cancellationToken = new CancellationTokenSource();
            HttpClient httpClient = new HttpClient();
            
            HttpResponseMessage request = await httpClient.GetAsync(website.UrlLink);
            cancellationToken.Token.ThrowIfCancellationRequested();

            Stream response = await request.Content.ReadAsStreamAsync();
            cancellationToken.Token.ThrowIfCancellationRequested();
            
            HtmlParser parser = new HtmlParser();
            IHtmlDocument document = parser.ParseDocument(response);

            await GetScrapeResults(document);
            
        }
        catch(HttpRequestException e)
        {
            Console.WriteLine("\nException Caught!");	
            Console.WriteLine("Message :{0} ",e.Message);
        }

    }

    /// <summary>
        /// Elements are found and selected from the Parramatta website before being sent off
        /// to the ExportToJson method
    /// </summary>

    public static async Task GetScrapeResults(IHtmlDocument document)
    {
        List<LGAEvent> lgaEvents = new List<LGAEvent>();

        lgaEvents = document.All
            .Where(e =>
                e.ClassName == "content-block" &&
                e.TextContent != null && e.TagName == "DIV")

            .Select(content => { 
                var titleElement = content.Children.SingleOrDefault(childContent =>
                childContent.ClassList.Contains("title") && 
                childContent.TextContent != null && 
                childContent.TagName == "H4");

                var contentDetailsElement = content.Children.SingleOrDefault(childContent =>
                    childContent.ClassList.Contains("content-details") &&
                    childContent.TextContent != null &&
                    childContent.TagName == "DIV");

                var description = contentDetailsElement?.Children.SingleOrDefault(childContent =>
                    childContent.ClassList.Contains("description") &&
                    childContent.TextContent != null &&
                    childContent.TagName == "DIV");

                var eventDate = contentDetailsElement?.Children.SingleOrDefault(childContent =>
                    childContent.ClassList.Contains("event-date") &&
                    childContent.TextContent != null &&
                    childContent.TagName == "DIV");    
                 
                return new LGAEvent
                {
                    Title = titleElement?.TextContent,
                    Description = description?.TextContent,
                    // StartDate = eventDate?.TextContent;
                };
            }).ToList();

        await ExportToJson(lgaEvents);
    }

    public static async Task ExportToJson(List<LGAEvent> results)
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
