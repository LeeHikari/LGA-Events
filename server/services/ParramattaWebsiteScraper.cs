using Objects;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using AngleSharp.Html.Parser;

namespace services
{
    public class ParramattaWebsiteScraper
    {
        static string baseUrl = "https://atparramatta.com";
        public List<LGAEvent> ParramattaScrape(IHtmlDocument document)
        {
            IEnumerable<IElement> elements = document.All
                .Where(e =>
                    e.TagName == "DIV" &&
                    e.ClassList.Contains("col") &&
                    e.TextContent != null &&
                    e.Children.First()?.TagName != "NAV");

            var lgaEvents = new List<LGAEvent>();

            IElement? anchorElement = null;
            string? eventUrl = null;
            string? imageUrl = null;
            string? title = null;
            string? description = null;
            IElement? contentDetailsElement = null;
            (DateTime startDate, DateTime? endDate) dates = (new DateTime(), null);

            for (int i = 0; i < elements.Count(); i++)
            {
                IElement content = elements.ElementAt(i);

                imageUrl = GetImageURL(content);
                if (imageUrl == null)
                {
                    continue;
                }

                anchorElement = GetAnchorElement(content);
                if (anchorElement == null)
                {
                    continue;
                }

                title = GetTitle(anchorElement);
                if (title == null)
                {
                    continue;
                }

                eventUrl = GetEventUrl(content, anchorElement);
                if (eventUrl == null)
                {
                    continue;
                }

                contentDetailsElement = GetContentDetails(anchorElement);
                if (contentDetailsElement == null)
                {
                    continue;
                }

                dates = GetEventDates(contentDetailsElement);
                if (dates.HasValue == false)
                {
                    continue;
                }

                description = GetDescription(contentDetailsElement);

                lgaEvents.Add(new LGAEvent(
                        title,
                        description,
                        dates.startDate,
                        dates.endDate,
                        imageUrl,
                        eventUrl));
            }

            return lgaEvents;
        }

        IElement? GetAnchorElement(IElement content)
        {
            return content.Children.SingleOrDefault(child =>
                child.TagName == "A" &&
                child.TextContent != null &&
                child.ClassList.Contains("col-wrap"));
        }

        string? GetEventUrl(IElement content, IElement? anchorElement)
        {
            if (anchorElement == null)
            {
                return null;
            }

            var anchorHref = anchorElement.Attributes.GetNamedItem("href");
            if (anchorHref == null)
            {
                return null;
            }

            return baseUrl + anchorHref.Value;
        }

        string? GetImageURL(IElement? content)
        {
            IElement? imageElement = content?.Children.SingleOrDefault(childContent =>
                        childContent.TagName == "DIV" &&
                        childContent.TextContent != null &&
                        childContent.ClassList.Contains("image-block"));

            if (imageElement == null)
            {
                return null;
            }

            var imageHref = imageElement?.Attributes.GetNamedItem("href");
            if (imageHref == null)
            {
                return null;
            }

            return baseUrl + imageHref.Value;
        }

        string? GetTitle(IElement? anchorElement)
        {
            IElement? titleElement = anchorElement?.Children.FirstOrDefault(childContent =>
                    childContent.TagName == "DIV" &&
                    childContent.ClassList.Contains("content-block"))?
                .Children.FirstOrDefault(childContent =>
                    childContent.TagName == "H4" &&
                    childContent.ClassList.Contains("title"));

            return titleElement?.TextContent;
        }

        string? GetDescription(IElement? contentDetailsElement)
        {
            IElement? descriptionElement = contentDetailsElement?.Children.SingleOrDefault(childContent =>
                childContent.ClassList.Contains("description") &&
                childContent.TextContent != null &&
                childContent.TagName == "DIV");
            return descriptionElement?.TextContent;
        }


        (DateTime startDate, DateTime? endDate)? ParseDateString(string eventDate)
        {
            var startDate = new DateTime();
            DateTime? endDate = null;

            int hyphenIndex = eventDate.IndexOf('-');
          
            try
            {
                if (hyphenIndex == -1)
                {
                    startDate = DateTime.Parse(eventDate);
                }
                else
                {
                    startDate = DateTime.Parse(eventDate.Substring(0, hyphenIndex - 1));
                    endDate = DateTime.Parse(eventDate.Substring(hyphenIndex + 1));
                }

            if(hyphenIndex == -1)
            {
                startDate = DateTime.Parse(eventDate);

            }
            catch
            {
                // Exceptions should be handled correctly. Shouldn't be used for pathways.
                // Should set the values manually to null if they fail via TryParse.
                return null;
            }

            return (startDate, endDate);
        }

        (DateTime startDate, DateTime? endDate)? GetEventDates(IElement? contentDetailsElement)
        {
            if (contentDetailsElement == null)
            {
                return null;
            }

            IElement? eventDateElement = contentDetailsElement?.Children.SingleOrDefault(childContent =>
                childContent.ClassList.Contains("event-date") &&
                childContent.TextContent != null &&
                childContent.TagName == "DIV");

            if (eventDateElement?.TextContent == null)
            {
                return null;
            }

            //Splits the Start and End dates into 2 substrings
            //It does this by identifying the index of the hyphen and then creating 2 substrings using the index
            return ParseDateString(eventDateElement.TextContent);
        }

        /// <summary>
        /// Gets the parent HTML element of description and event date.
        /// </summary>
        IElement? GetContentDetails(IElement? anchorElement)
        {
            IElement? contentDetailsElement = anchorElement?.Children.FirstOrDefault(childContent =>
                childContent.TagName == "DIV" &&
                childContent.ClassList.Contains("content-block"))?
                .Children.SingleOrDefault(childContent =>
                childContent.TagName == "DIV" &&
                childContent.ClassList.Contains("content-details"));

            return contentDetailsElement;
        }
    }
}
