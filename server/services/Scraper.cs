using Objects;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using AngleSharp.Html.Parser;
using Google.Apis.Storage.v1.Data;
using Google.Cloud.Storage.V1;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Text;
using Google.Apis.Auth.OAuth2;

namespace services
{
    public class Scraper
    {
        bool usingCloud = false;
        static string baseUrl = "https://atparramatta.com";

        public Scraper(bool usingCloud)
        {
            this.usingCloud = usingCloud;
        }

        /// <summary>
        ///     Uses a Anglesharp in order to create a connection to a website we wish to webscrape
        /// </summary>
        /// <returns>Returns the website inside of a IHtmlDocument variable to GetScrapeResults</returns>
        public async Task Scrape()
        {
            try
            {
                Website website = new Website { UrlLink = baseUrl + "/whats-on" };
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
            catch (HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");
                Console.WriteLine("Message :{0} ", e.Message);
            }

        }

        /// <summary>
        /// Elements are found and selected from the Parramatta website before being sent off
        /// to the ExportToJson method.
        /// </summary>
        /// <param name="document">Uses the variable which stores the website, allowing us to use it in the LINQ query</param>
        /// <returns>Returns the variable storing lgaEvents</returns>

        public async Task GetScrapeResults(IHtmlDocument document)
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
                    e.TagName == "DIV" &&
                    e.ClassList.Contains("col") &&
                    e.TextContent != null &&
                    e.Children.FirstOrDefault()!.TagName != "NAV")

                    //Begins the select query by selecting the a list of class names which contain
                    //title and the tagName is equals a H4 element.
                    .Select(content =>
                    {
                        //Collects event URL
                        IElement? anchorElement = content.Children.SingleOrDefault(childContent =>
                            childContent.TagName == "A" &&
                            childContent.TextContent != null &&
                            childContent.ClassList.Contains("col-wrap"));

                        string? eventUrl = null;

                        if (anchorElement != null)
                        {
                            eventUrl = baseUrl + anchorElement.Attributes.GetNamedItem("href")?.Value;
                        }

                        //Collects image URL
                        IElement? imageElement = content.Children.SingleOrDefault(childContent =>
                            childContent.TagName == "DIV" &&
                            childContent.TextContent != null &&
                            childContent.ClassList.Contains("image-block"));

                        string? imageUrl = null;

                        if (imageElement != null)
                        {
                            imageUrl = baseUrl + imageElement.Attributes.GetNamedItem("style")?.Value;
                        }


                        //Collects the title of the LGA event
                        IElement? titleElement = anchorElement?.Children.FirstOrDefault(childContent =>
                                childContent.TagName == "DIV" &&
                                childContent.ClassList.Contains("content-block"))!
                            .Children.SingleOrDefault(childContent =>
                                childContent.TagName == "H4" &&
                                childContent.TextContent != null &&
                                childContent.ClassList.Contains("title"));

                        //Creates contentDetailsElement which is the child of the previous select statement
                        //which is a class that contains "content-details" and is a DIV.
                        IElement? contentDetailsElement = anchorElement?.Children.FirstOrDefault(childContent =>
                            childContent.TagName == "DIV" &&
                            childContent.ClassList.Contains("content-block"))!
                            .Children.SingleOrDefault(childContent =>
                            childContent.TagName == "DIV" &&
                            childContent.ClassList.Contains("content-details"));

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
                        (DateTime? Start, DateTime? End)? dates = parramattaWebsiteScraper.ParseDateString(eventDateElement!.TextContent);

                        //The LGAEvent object links up with all previous variables here
                        return new LGA_Event(titleElement?.TextContent, descriptionElement?.TextContent, (DateTime)dates?.Start!, dates?.End, imageUrl, eventUrl);
                    }).ToList();

                if (this.usingCloud)
                {
                    var options = new JsonSerializerOptions
                    {
                        WriteIndented = true,
                        Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) }
                    };

                    var serialized = JsonSerializer.Serialize(lgaEvents, options);

                    try
                    {
                        var credential = GoogleCredential.GetApplicationDefault();
                            var storage = StorageClient.Create(credential);
                        byte[] byteArray = Encoding.UTF8.GetBytes(serialized);
                        MemoryStream stream = new MemoryStream(byteArray);


                        storage.UploadObject("lgaevents", "LGAInfo.json", "application/octet-stream", stream);
                    }
                    catch(Exception e)
                    {
                        Console.WriteLine(e.Message);
                    }

                }
                else
                {
                    var options = new JsonSerializerOptions
                    {
                        WriteIndented = true,
                        Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) }
                    };

                    var serialized = JsonSerializer.Serialize(lgaEvents, options);
                    using (StreamWriter sw = new StreamWriter("./LGAInfo.json"))
                    {
                        await sw.WriteAsync(serialized);
                    }
                }
            }
            catch (HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");
                Console.WriteLine("Message :{0} ", e.Message);
            }
        }
    }
}