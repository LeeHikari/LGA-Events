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
                    ParramattaWebsiteScraper parramattaWebsiteScraper = new ParramattaWebsiteScraper();
                    List<LGA_Event> lgaEvents = parramattaWebsiteScraper.ParramattaScrape(document);

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