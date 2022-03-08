using System.Net;

namespace Objects
{
    public class LGAEvent
    {
        public LGAEvent(string? _title, string? _description, DateTime? _startDate, DateTime? _endDate, string? _eventImageUrl, string? _eventUrl)
        {
            Title = _title;
            Description = _description;
            StartDate = _startDate;
            EndDate = _endDate;
            Id = WebUtility.HtmlEncode(StartDate?.ToString("yyyy-MM-dd")+'-'+Title?.Replace(' ','-').ToLower());
            EventImageUrl = _eventImageUrl!.Replace("background:url", "").Replace("\u0027", "").Replace("(", "").Replace(")", "");
            EventUrl = _eventUrl;
        }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Id { get; set; }
        public string? EventImageUrl { get; set; }
        public string? EventUrl { get; set; }
    }
}