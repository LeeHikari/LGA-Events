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

/// <summary>
///     Uses a Anglesharp in order to create a connection to a website we wish to webscrape
/// </summary>
/// <returns>Returns the website inside of a IHtmlDocument variable to GetScrapeResults</returns>
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
/// to the ExportToJson method.
/// </summary>
/// <param name="document">Uses the variable which stores the website, allowing us to use it in the LINQ query</param>
/// <returns>Returns the variable storing lgaEvents</returns>

    public static async Task GetScrapeResults(IHtmlDocument document)
    {
        try
        {
            //Instantiates a generic list of type LGAEvents, which uses the properties declared
            //in it's class above.

           List<LGAEvent> lgaEvents = new List<LGAEvent>();

            //Creates a variable which stores a list of elements from a website where the class
            //name equals "content-block and the tagName is a DIV.

            lgaEvents = document.All
                .Where(e =>
                    e.ClassName == "content-block" &&
                    e.TextContent != null && e.TagName == "DIV")

                //Begins the select query by selecting the a list of class names which contain
                //title and the tagName is equals a H4 element.

                .Select(content => { 
                    var titleElement = content.Children.SingleOrDefault(childContent =>
                    childContent.ClassList.Contains("title") && 
                    childContent.TextContent != null && 
                    childContent.TagName == "H4");

                    //Creates contentDetailsElement which is the child of the previous select statement
                    //which is a class that contains "content-details" and is a DIV.

                    var contentDetailsElement = content.Children.SingleOrDefault(childContent =>
                        childContent.ClassList.Contains("content-details") &&
                        childContent.TextContent != null &&
                        childContent.TagName == "DIV");

                    //contentDetailsElement selects its children which contain both "description"
                    //and "event-date" class names.

                    var description = contentDetailsElement?.Children.SingleOrDefault(childContent =>
                        childContent.ClassList.Contains("description") &&
                        childContent.TextContent != null &&
                        childContent.TagName == "DIV");

                    var eventDate = contentDetailsElement?.Children.SingleOrDefault(childContent =>
                        childContent.ClassList.Contains("event-date") &&
                        childContent.TextContent != null &&
                        childContent.TagName == "DIV");    

                    DateTime startDate = new DateTime(1/1/2000);
                    DateTime? endDate = null;
                    int hyphenString = eventDate.TextContent.IndexOf('-');
                    if(hyphenString == -1){
                        startDate = DateTime.Parse(eventDate.TextContent);
                    }
                    else{
                        startDate = DateTime.Parse(eventDate.TextContent.Substring(0, hyphenString-1));
                        endDate = DateTime.Parse(eventDate.TextContent.Substring(hyphenString+1));
                    }
                    
                    //The LGAEvent object links up with all previous variables here

                    return new LGAEvent
                    {
                        Title = titleElement?.TextContent,
                        Description = description?.TextContent,
                        StartDate = startDate,
                        EndDate = endDate,
                        Id = startDate.ToString("yyyy/MM/dd")+'-'+titleElement.TextContent.Replace(' ', '-')
                    };
                }).ToList();

            await ExportToJson(lgaEvents);
        }
        catch (HttpRequestException e)
        {
            Console.WriteLine("\nException Caught!");	
            Console.WriteLine("Message :{0} ",e.Message);
        }
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
