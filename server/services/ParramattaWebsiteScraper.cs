namespace services{
    public class ParramattaWebsiteScraper{
        public (DateTime? Start, DateTime? End)? ParseDateString(string eventDate){
            if(eventDate == null){
                return null;
            }

            DateTime? startDate = new DateTime(2000, 1, 1);
            DateTime? endDate = null;
            int hyphenIndex = eventDate.IndexOf('-');
            if(hyphenIndex == -1){
                startDate = DateTime.Parse(eventDate);
            }
            else
            {
                startDate = DateTime.Parse(eventDate.Substring(0, hyphenIndex-1));
                endDate = DateTime.Parse(eventDate.Substring(hyphenIndex+1));
            }
            return (startDate, endDate);
        }
    }
}