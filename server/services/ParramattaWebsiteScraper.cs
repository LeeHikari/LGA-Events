using Objects;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using AngleSharp.Html.Parser;
namespace services{
    public class ParramattaWebsiteScraper{
        static string baseUrl = "https://atparramatta.com";
        public (DateTime? Start, DateTime? End)? ParseDateString(string? eventDate)
        {
            if(eventDate == null)
            {
                return null;
            }

            DateTime? startDate = new DateTime(2000, 1, 1);
            DateTime? endDate = null;

            int hyphenIndex = eventDate.IndexOf('-');

            if(hyphenIndex == -1)
            {
                startDate = DateTime.Parse(eventDate);
            }
            else
            {
                startDate = DateTime.Parse(eventDate.Substring(0, hyphenIndex-1));
                endDate = DateTime.Parse(eventDate.Substring(hyphenIndex+1));
            }

            return (startDate, endDate);
        }
        public List<LGAEvent> ParramattaScrape(IHtmlDocument document)
        {
            List<LGAEvent> lgaEvents = new List<LGAEvent>();

                lgaEvents = document.All
                .Where(e =>
                    e.TagName == "DIV" &&
                    e.ClassList.Contains("col") &&
                    e.TextContent != null &&
                    e.Children.FirstOrDefault()!.TagName != "NAV")

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
                        IElement? imageElement = anchorElement?.Children.SingleOrDefault(childContent =>
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
                                childContent.ClassList.Contains("content-block"))?
                            .Children.SingleOrDefault(childContent =>
                                childContent.TagName == "H4" &&
                                childContent.TextContent != null &&
                                childContent.ClassList.Contains("title"));

                        //Parent HTML element of description and event date
                        IElement? contentDetailsElement = anchorElement?.Children.FirstOrDefault(childContent =>
                            childContent.TagName == "DIV" &&
                            childContent.ClassList.Contains("content-block"))?
                            .Children.SingleOrDefault(childContent =>
                            childContent.TagName == "DIV" &&
                            childContent.ClassList.Contains("content-details"));

                        //Collects description of the LGA event
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
                        (DateTime? Start, DateTime? End)? dates = ParseDateString(eventDateElement?.TextContent);

                        //The LGAEvent object links up with all previous variables here
                        return new LGAEvent(
                            titleElement?.TextContent, 
                            descriptionElement?.TextContent, 
                            dates?.Start,
                            dates?.End, 
                            imageUrl, 
                            eventUrl);       
                    }).ToList();

                    return lgaEvents;
        }
    }
}