using services;
using objects;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using AngleSharp.Html.Parser;
using System.Net;

namespace services
{
public class Scraper
{

    /// <summary>
    ///     Uses a Anglesharp in order to create a connection to a website we wish to webscrape
    /// </summary>
    /// <returns>Returns the website inside of a IHtmlDocument variable to GetScrapeResults</returns>
        public async Task Scrape()
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
            List<LGA_Event> lgaEvents = new List<LGA_Event>();

                //Creates a variable which stores a list of elements from a website where the class
                //name equals "content-block and the tagName is a DIV.
                lgaEvents = document.All
                    .Where(e =>
                        e.ClassName == "content-block" &&
                        e.TextContent != null && e.TagName == "DIV")

                    //Begins the select query by selecting the a list of class names which contain
                    //title and the tagName is equals a H4 element.
                    .Select(content => { 

                        //Collects the title of the LGA event
                        IElement? titleElement = content.Children.SingleOrDefault(childContent =>
                        childContent.ClassList.Contains("title") && 
                        childContent.TextContent != null && 
                        childContent.TagName == "H4");

                        //Creates contentDetailsElement which is the child of the previous select statement
                        //which is a class that contains "content-details" and is a DIV.
                        IElement? contentDetailsElement = content.Children.SingleOrDefault(childContent =>
                            childContent.ClassList.Contains("content-details") &&
                            childContent.TextContent != null &&
                            childContent.TagName == "DIV");

                        //contentDetailsElement selects its children which contain both "description"
                        //and "event-date" class names.
                        IElement? descriptionElement = contentDetailsElement?.Children.SingleOrDefault(childContent =>
                            childContent.ClassList.Contains("description") &&
                            childContent.TextContent != null &&
                            childContent.TagName == "DIV");

                        //Collects the start and end dates for the LGA event
                        IElement? eventDateElement = contentDetailsElement?.Children.SingleOrDefault(childContent =>
                            childContent.ClassList.Contains("event-date") &&
                            childContent.TextContent != null &&
                            childContent.TagName == "DIV");    

                        //Splits the Start and End dates into 2 substrings
                        //It does this by identifying the index of the hyphen and then creating 2 substrings using the index
                        ParramattaWebsiteScraper parramattaWebsiteScraper = new ParramattaWebsiteScraper();
                        (DateTime Start, DateTime? End) dates = parramattaWebsiteScraper.SplitDatesIntoSubStrings(eventDateElement.TextContent);

                        /*int hyphenIndex = eventDateElement.TextContent.IndexOf('-');
                        if(hyphenIndex == -1){
                            startDate = DateTime.Parse(eventDateElement.TextContent);
                        }
                        else{
                            startDate = DateTime.Parse(eventDateElement.TextContent.Substring(0, hyphenIndex-1));
                            endDate = DateTime.Parse(eventDateElement.TextContent.Substring(hyphenIndex+1));
                        }*/

                        //Preparing the title for being inserted into the ID by replacing all spaces with hyphens
                        string modifiedTitle = titleElement.TextContent.Replace(' ', '-');
                        
                        //The LGAEvent object links up with all previous variables here
                        return new LGA_Event
                        {
                            Title = titleElement?.TextContent,
                            Description = descriptionElement?.TextContent,
                            StartDate = dates.Start,
                            EndDate = dates.End,
                            //Creates the ID by combining the start date and title and then encodes it into a HTML friendly string
                            Id = WebUtility.HtmlEncode(dates.Start.ToString("yyyy-MM-dd")+'-'+modifiedTitle.ToLower())
                        };
                    }).ToList();
                JsonFileManagement json = new JsonFileManagement();
                await json.ExportToJson(lgaEvents);
            }
            catch (HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");	
                Console.WriteLine("Message :{0} ",e.Message);
            }
        }
    }
}