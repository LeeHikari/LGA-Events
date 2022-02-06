namespace services{
    public class ParramattaWebsiteScraper{
        public (DateTime Start, DateTime? End) SplitDatesIntoSubStrings(string eventDate){
            DateTime startDate = new DateTime(2000, 1, 1);
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
            var dates = (startDate, endDate);
            return dates;
        }
    }
}