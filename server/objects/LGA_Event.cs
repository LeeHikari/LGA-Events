using System.Net;

namespace Objects
{
    public class LGA_Event
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Id 
        {
            set
            {
                WebUtility.HtmlEncode(Title?.Replace(' ', '-').ToLower()+'-'+StartDate.ToString("yyyy-MM-dd"));
            } 
        }
        public string? EventImageUrl { get; set; }
        public string? EventUrl { get; set; }
    }
}